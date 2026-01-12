# Frontend Integration Guide - Firebase Login

## 🔥 Flow tổng quan

1. **User login Firebase** → Frontend nhận `idToken`
2. **Gửi idToken đến backend** → `POST /api/auth/firebase`
3. **Backend verify & tạo JWT** → Trả về `accessToken` + `refreshToken`
4. **Frontend lưu tokens** → Dùng cho các request sau

---

## 📦 Setup Firebase SDK (Frontend)

### 1. Cài đặt Firebase

```bash
npm install firebase
```

### 2. Khởi tạo Firebase Config

**`src/config/firebase.ts`**
```typescript
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA03mtIPAYJ6duZB84Pka6doXYA3-zboMk",
  authDomain: "football-d12b2.firebaseapp.com",
  projectId: "football-d12b2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
```

---

## 🎯 React Implementation

### 1. Auth Service

**`src/services/authService.ts`**
```typescript
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  User
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

const API_URL = 'http://localhost:3000/api';

interface BackendAuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export const authService = {
  // Login với Google
  async loginWithGoogle(): Promise<BackendAuthResponse> {
    try {
      // 1. Login Firebase
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      // 2. Gửi idToken đến backend
      const response = await fetch(`${API_URL}/auth/firebase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        throw new Error('Backend authentication failed');
      }

      const data: BackendAuthResponse = await response.json();

      // 3. Lưu tokens vào localStorage
      localStorage.setItem('accessToken', data.tokens.accessToken);
      localStorage.setItem('refreshToken', data.tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Login với Email/Password
  async loginWithEmail(email: string, password: string): Promise<BackendAuthResponse> {
    try {
      // 1. Login Firebase
      const result = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await result.user.getIdToken();

      // 2. Gửi idToken đến backend (giống Google)
      const response = await fetch(`${API_URL}/auth/firebase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        throw new Error('Backend authentication failed');
      }

      const data: BackendAuthResponse = await response.json();

      // 3. Lưu tokens
      localStorage.setItem('accessToken', data.tokens.accessToken);
      localStorage.setItem('refreshToken', data.tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Logout
  async logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    await auth.signOut();
  },

  // Get current user
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Get access token
  getAccessToken() {
    return localStorage.getItem('accessToken');
  },
};
```

### 2. API Service (với JWT Authentication)

**`src/services/apiService.ts`**
```typescript
const API_URL = 'http://localhost:3000/api';

// Axios interceptor hoặc fetch wrapper
export const api = {
  async get(endpoint: string) {
    const token = localStorage.getItem('accessToken');

    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 401) {
      // Token expired, cần refresh
      await this.refreshToken();
      // Retry request
      return this.get(endpoint);
    }

    return response.json();
  },

  async post(endpoint: string, data: any) {
    const token = localStorage.getItem('accessToken');

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.status === 401) {
      await this.refreshToken();
      return this.post(endpoint, data);
    }

    return response.json();
  },

  async refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');

    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json();
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
  },
};
```

### 3. Login Component

**`src/components/Login.tsx`**
```tsx
import React, { useState } from 'react';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await authService.loginWithGoogle();
      console.log('Login success:', data);
      navigate('/dashboard'); // Redirect sau khi login
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const data = await authService.loginWithEmail(email, password);
      console.log('Login success:', data);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>

      {error && <div className="error">{error}</div>}

      {/* Google Login */}
      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="btn-google"
      >
        {loading ? 'Đang đăng nhập...' : 'Login with Google'}
      </button>

      <div className="divider">Hoặc</div>

      {/* Email Login */}
      <form onSubmit={handleEmailLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Đang đăng nhập...' : 'Login with Email'}
        </button>
      </form>
    </div>
  );
};
```

### 4. Protected Route

**`src/components/ProtectedRoute.tsx`**
```tsx
import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const user = authService.getCurrentUser();
  const token = authService.getAccessToken();

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
```

### 5. App Router

**`src/App.tsx`**
```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

---

## 🔐 Sử dụng API với Authentication

### Example: Fetch User Profile

```typescript
import { api } from './services/apiService';

// Trong component
const fetchUserProfile = async () => {
  try {
    const profile = await api.get('/users/me');
    console.log(profile);
  } catch (error) {
    console.error('Failed to fetch profile:', error);
  }
};
```

### Example: Create Match

```typescript
const createMatch = async () => {
  try {
    const match = await api.post('/matches', {
      date: new Date(),
      location: 'Sân A',
    });
    console.log('Match created:', match);
  } catch (error) {
    console.error('Failed to create match:', error);
  }
};
```

---

## 🌐 Vue.js Implementation

**`src/services/authService.js`**
```javascript
import {
  signInWithPopup,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { auth, googleProvider } from '@/config/firebase';

const API_URL = 'http://localhost:3000/api';

export const authService = {
  async loginWithGoogle() {
    const result = await signInWithPopup(auth, googleProvider);
    const idToken = await result.user.getIdToken();

    const response = await fetch(`${API_URL}/auth/firebase`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });

    const data = await response.json();

    localStorage.setItem('accessToken', data.tokens.accessToken);
    localStorage.setItem('refreshToken', data.tokens.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));

    return data;
  },

  // Similar methods...
};
```

---

## 📝 Environment Variables

**`.env`**
```
VITE_API_URL=http://localhost:3000/api
VITE_FIREBASE_API_KEY=AIzaSyA03mtIPAYJ6duZB84Pka6doXYA3-zboMk
VITE_FIREBASE_AUTH_DOMAIN=football-d12b2.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=football-d12b2
```

---

## ✅ Checklist

- [ ] Cài đặt Firebase SDK
- [ ] Setup Firebase config
- [ ] Implement authService với Google & Email login
- [ ] Implement API service với JWT authentication
- [ ] Tạo Login component
- [ ] Tạo Protected Route
- [ ] Handle token refresh khi expired
- [ ] Test flow đầy đủ

---

## 🚀 Quick Start

```bash
# Frontend (React)
npx create-react-app football-app --template typescript
cd football-app
npm install firebase react-router-dom

# Tạo các file theo hướng dẫn trên
# Start frontend
npm start
```

Backend đã chạy sẵn tại: `http://localhost:3000/api`

---

## 🔍 Troubleshooting

**CORS Error?**
- Backend đã config CORS cho `http://localhost:5173`
- Nếu dùng port khác, thêm vào `src/main.ts`

**401 Unauthorized?**
- Check token có được gửi trong header không
- Check token còn hạn không

**Firebase Error?**
- Check API key có đúng không
- Check authorized domains trong Firebase Console
