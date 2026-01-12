# Football Management System - Architecture & Features Documentation

## 📋 Mục lục

1. [Tổng quan hệ thống](#tổng-quan-hệ-thống)
2. [Architecture Diagram](#architecture-diagram)
3. [Database Schema](#database-schema)
4. [Authentication Flow](#authentication-flow)
5. [Matches Management](#matches-management)
6. [Team Splitting Algorithm](#team-splitting-algorithm)
7. [Payment System](#payment-system)
8. [Funds Management](#funds-management)
9. [Voting System](#voting-system)
10. [Notification System](#notification-system)

---

## 🎯 Tổng quan hệ thống

**Football Management System** là ứng dụng quản lý đội bóng với các tính năng:
- ⚽ Quản lý trận đấu & chia đội tự động
- 💰 Thanh toán qua nhiều cổng (VNPay, Momo, Bank Transfer)
- 📊 Quản lý quỹ (phí tháng, phạt)
- 🗳️ Hệ thống bình chọn
- 🔔 Thông báo real-time
- 🔐 Xác thực Firebase + JWT

---

## 🏗️ Architecture Diagram

```mermaid
graph TB
    subgraph "Client Layer"
        WEB[Web App<br/>React/Vue]
        MOBILE[Mobile App<br/>React Native]
    end

    subgraph "API Gateway"
        API[NestJS API<br/>:3000/api]
    end

    subgraph "Authentication"
        FIREBASE[Firebase Auth]
        JWT[JWT Service]
    end

    subgraph "Core Services"
        AUTH[Auth Service]
        USERS[Users Service]
        MATCHES[Matches Service]
        PAYMENTS[Payments Service]
        FUNDS[Funds Service]
        VOTES[Votes Service]
        NOTIF[Notifications Service]
    end

    subgraph "External Services"
        VNPAY[VNPay Gateway]
        MOMO[Momo Gateway]
        BANK[Bank Transfer<br/>VietQR]
        CASSO[Casso Webhook]
    end

    subgraph "Database"
        MONGO[(MongoDB)]
    end

    subgraph "Real-time"
        WS[WebSocket Gateway]
    end

    WEB --> API
    MOBILE --> API

    API --> AUTH
    API --> USERS
    API --> MATCHES
    API --> PAYMENTS
    API --> FUNDS
    API --> VOTES
    API --> NOTIF

    AUTH --> FIREBASE
    AUTH --> JWT

    PAYMENTS --> VNPAY
    PAYMENTS --> MOMO
    PAYMENTS --> BANK
    CASSO --> PAYMENTS

    USERS --> MONGO
    MATCHES --> MONGO
    PAYMENTS --> MONGO
    FUNDS --> MONGO
    VOTES --> MONGO

    NOTIF --> WS
    WS --> WEB
    WS --> MOBILE

    style API fill:#4CAF50
    style MONGO fill:#47A248
    style FIREBASE fill:#FFCA28
    style WS fill:#2196F3
```

---

## 💾 Database Schema

```mermaid
erDiagram
    USER ||--o{ MATCH : creates
    USER ||--o{ PAYMENT : makes
    USER ||--o{ MONTHLY_FEE : pays
    USER ||--o{ PENALTY : receives
    USER ||--o{ VOTE_RESPONSE : submits

    MATCH ||--o{ TEAM_LINEUP : has
    MATCH ||--o{ PENALTY : generates

    VOTE_SESSION ||--o{ VOTE_RESPONSE : contains

    PAYMENT }o--|| USER : "paid by"

    USER {
        ObjectId _id
        string email
        string password
        string name
        string role
        number skillLevel
        string avatar
        string firebaseUid
        boolean isActive
    }

    MATCH {
        ObjectId _id
        date date
        string location
        array playerIds
        string status
        object result
    }

    TEAM_LINEUP {
        ObjectId _id
        ObjectId matchId
        array teamA
        array teamB
        number balanceScore
    }

    PAYMENT {
        ObjectId _id
        ObjectId userId
        number amount
        string type
        string status
        string gateway
        object metadata
    }

    MONTHLY_FEE {
        ObjectId _id
        ObjectId userId
        number amount
        string period
        boolean isPaid
        date paidAt
    }

    PENALTY {
        ObjectId _id
        ObjectId userId
        ObjectId matchId
        number amount
        string reason
        boolean isPaid
    }

    VOTE_SESSION {
        ObjectId _id
        string title
        string description
        array options
        date startDate
        date endDate
        string status
    }

    VOTE_RESPONSE {
        ObjectId _id
        ObjectId sessionId
        ObjectId userId
        string selectedOption
    }
```

---

## 🔐 Authentication Flow

### 1. Firebase + JWT Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant FB as Firebase
    participant BE as Backend API
    participant DB as MongoDB

    Note over U,DB: Login Flow

    U->>F: Click "Login with Google"
    F->>FB: signInWithPopup()
    FB-->>F: User credential
    F->>FB: getIdToken()
    FB-->>F: Firebase ID Token

    F->>BE: POST /api/auth/firebase<br/>{idToken}
    BE->>FB: verifyIdToken()
    FB-->>BE: Firebase user info

    alt User exists
        BE->>DB: findByFirebaseUid()
        DB-->>BE: User data
    else User not exists
        alt Email exists
            BE->>DB: findByEmail()
            DB-->>BE: User data
            BE->>DB: linkFirebaseUid()
        else New user
            BE->>DB: createFromFirebase()
            DB-->>BE: New user
        end
    end

    BE->>BE: generateTokens()<br/>(JWT)
    BE-->>F: {user, tokens}
    F->>F: Save to localStorage
    F-->>U: Redirect to Dashboard

    Note over U,DB: Authenticated Requests

    U->>F: Request protected resource
    F->>BE: GET /api/users/me<br/>Header: Bearer {accessToken}
    BE->>BE: Verify JWT
    BE->>DB: Query data
    DB-->>BE: Data
    BE-->>F: Response
    F-->>U: Display data
```

### 2. Token Refresh Flow

```mermaid
sequenceDiagram
    participant F as Frontend
    participant BE as Backend

    F->>BE: API Request<br/>Authorization: Bearer {expired_token}
    BE-->>F: 401 Unauthorized

    F->>BE: POST /api/auth/refresh<br/>{refreshToken}
    BE->>BE: Verify refresh token
    BE->>BE: Generate new tokens
    BE-->>F: {accessToken, refreshToken}

    F->>F: Update localStorage
    F->>BE: Retry original request<br/>Authorization: Bearer {new_token}
    BE-->>F: 200 OK + Data
```

---

## ⚽ Matches Management

### 1. Create Match Flow

```mermaid
sequenceDiagram
    participant A as Admin
    participant F as Frontend
    participant BE as Backend
    participant DB as MongoDB
    participant WS as WebSocket

    A->>F: Create Match<br/>{date, location}
    F->>BE: POST /api/matches
    BE->>BE: Validate input
    BE->>DB: Save match
    DB-->>BE: Match created

    BE->>WS: Emit "match-created"
    WS-->>F: Notify all users

    BE-->>F: Match data
    F-->>A: Show success
```

### 2. Register for Match

```mermaid
sequenceDiagram
    participant P as Player
    participant F as Frontend
    participant BE as Backend
    participant DB as MongoDB
    participant WS as WebSocket

    P->>F: Click "Tham gia"
    F->>BE: PATCH /api/matches/:id/register
    BE->>DB: findById(matchId)
    DB-->>BE: Match data

    BE->>BE: Check if user<br/>already registered

    alt Already registered
        BE-->>F: 400 Error
        F-->>P: "Đã đăng ký rồi"
    else Not registered
        BE->>DB: Add userId to<br/>match.playerIds
        DB-->>BE: Updated match

        BE->>WS: Emit "player-registered"
        WS-->>F: Update match UI

        BE-->>F: Success
        F-->>P: "Đăng ký thành công"
    end
```

---

## 🎲 Team Splitting Algorithm

### Flow Diagram

```mermaid
flowchart TD
    Start([Match has players]) --> CheckCount{Players >= 4?}

    CheckCount -->|No| Error[Return error:<br/>Not enough players]
    CheckCount -->|Yes| GetPlayers[Get all players<br/>with skill levels]

    GetPlayers --> Shuffle[Shuffle players randomly]
    Shuffle --> Sort[Sort by skill level<br/>descending]

    Sort --> InitTeams[Initialize<br/>Team A & Team B<br/>with empty arrays]

    InitTeams --> Loop{More players?}

    Loop -->|Yes| CalcSkills[Calculate total skill<br/>for both teams]
    CalcSkills --> Compare{Team A skill<br/>< Team B skill?}

    Compare -->|Yes| AddToA[Add player<br/>to Team A]
    Compare -->|No| AddToB[Add player<br/>to Team B]

    AddToA --> Loop
    AddToB --> Loop

    Loop -->|No| CalcBalance[Calculate balance score:<br/>abs(skillA - skillB)]

    CalcBalance --> SaveDB[Save TeamLineup<br/>to database]
    SaveDB --> Return[Return teams<br/>with balance score]

    Return --> End([End])
    Error --> End

    style Start fill:#4CAF50
    style End fill:#F44336
    style Compare fill:#FF9800
    style CalcBalance fill:#2196F3
```

### Algorithm Code Flow

```typescript
function splitTeams(players: Player[]) {
  // 1. Shuffle for randomness
  shuffle(players);

  // 2. Sort by skill level (high to low)
  players.sort((a, b) => b.skillLevel - a.skillLevel);

  // 3. Initialize teams
  const teamA = [], teamB = [];
  let skillA = 0, skillB = 0;

  // 4. Greedy assignment
  for (const player of players) {
    if (skillA <= skillB) {
      teamA.push(player);
      skillA += player.skillLevel;
    } else {
      teamB.push(player);
      skillB += player.skillLevel;
    }
  }

  // 5. Calculate balance
  const balanceScore = Math.abs(skillA - skillB);

  return { teamA, teamB, balanceScore };
}
```

---

## 💳 Payment System

### 1. Payment Flow (VNPay/Momo)

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant BE as Backend
    participant DB as MongoDB
    participant GW as Payment Gateway<br/>(VNPay/Momo)

    Note over U,GW: Initiate Payment

    U->>F: Click "Thanh toán"
    F->>BE: POST /api/payments<br/>{amount, type, gateway}

    BE->>DB: Create Payment<br/>status: PENDING
    DB-->>BE: Payment created

    alt VNPay
        BE->>BE: Generate VNPay URL<br/>with signature
        BE-->>F: {paymentUrl}
    else Momo
        BE->>GW: Request payment URL
        GW-->>BE: {payUrl, deeplink}
        BE-->>F: {paymentUrl}
    end

    F->>F: Redirect to payment URL
    F-->>U: Show payment page

    Note over U,GW: User Completes Payment

    U->>GW: Enter card info & pay
    GW-->>GW: Process payment

    Note over U,GW: Callback & Update

    GW->>BE: GET /api/payments/callback<br/>?orderId=xxx&status=success

    BE->>BE: Verify signature
    BE->>DB: Update payment<br/>status: SUCCESS
    DB-->>BE: Updated

    BE-->>GW: Return success
    GW->>U: Redirect to return URL

    U->>F: Redirected back
    F->>BE: GET /api/payments/:id
    BE->>DB: Get payment status
    DB-->>BE: Payment data
    BE-->>F: {status: SUCCESS}
    F-->>U: Show success message
```

### 2. Bank Transfer + Casso Webhook Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant BE as Backend
    participant DB as MongoDB
    participant VQR as VietQR
    participant BANK as User's Bank
    participant CASSO as Casso

    Note over U,CASSO: Generate QR Code

    U->>F: Click "Chuyển khoản"
    F->>BE: POST /api/payments<br/>{amount, type: BANK_TRANSFER}

    BE->>DB: Create Payment<br/>status: PENDING
    DB-->>BE: Payment with unique code

    BE->>VQR: Generate QR Code<br/>amount + content
    VQR-->>BE: QR image URL

    BE-->>F: {qrCode, accountInfo, content}
    F-->>U: Display QR + Instructions

    Note over U,CASSO: User Transfers

    U->>BANK: Scan QR & transfer
    BANK-->>BANK: Process transfer

    Note over U,CASSO: Casso Webhook

    BANK->>CASSO: Bank transaction notification
    CASSO->>BE: POST /api/payments/casso-webhook<br/>{tid, amount, description}

    BE->>BE: Verify secure token
    BE->>BE: Parse transaction code<br/>from description

    BE->>DB: Find payment by code
    DB-->>BE: Payment found

    BE->>DB: Update payment<br/>status: SUCCESS
    DB-->>BE: Updated

    BE->>WS: Emit "payment-confirmed"<br/>to user
    WS-->>F: Real-time notification

    F-->>U: "Thanh toán thành công!"

    BE-->>CASSO: 200 OK
```

### 3. Admin Confirm Payment Flow

```mermaid
sequenceDiagram
    participant A as Admin
    participant F as Frontend
    participant BE as Backend
    participant DB as MongoDB
    participant WS as WebSocket
    participant U as User

    A->>F: View pending payments
    F->>BE: GET /api/payments?status=PENDING
    BE->>DB: Query pending payments
    DB-->>BE: Payments list
    BE-->>F: Payments data
    F-->>A: Display list

    A->>F: Click "Xác nhận"<br/>on payment
    F->>BE: PATCH /api/payments/:id/confirm<br/>{confirmed: true}

    BE->>BE: Check admin role
    BE->>DB: Update payment<br/>status: SUCCESS
    DB-->>BE: Updated

    BE->>WS: Emit "payment-confirmed"
    WS-->>U: Notification

    BE-->>F: Success response
    F-->>A: "Đã xác nhận"
```

---

## 💰 Funds Management

### 1. Monthly Fee Collection

```mermaid
sequenceDiagram
    participant A as Admin
    participant BE as Backend
    participant DB as MongoDB
    participant WS as WebSocket
    participant U as Users

    A->>BE: POST /api/funds/monthly-fees<br/>{period, amount, userIds}

    loop For each user
        BE->>DB: Create MonthlyFee<br/>{userId, amount, period}
        DB-->>BE: Fee created
    end

    BE->>WS: Emit "monthly-fee-created"
    WS-->>U: Notification to all users

    BE-->>A: {created: count}
```

### 2. Penalty Assignment

```mermaid
sequenceDiagram
    participant A as Admin
    participant BE as Backend
    participant DB as MongoDB
    participant WS as WebSocket
    participant P as Player

    A->>BE: POST /api/funds/penalties<br/>{userId, matchId, amount, reason}

    BE->>DB: Create Penalty
    DB-->>BE: Penalty created

    BE->>WS: Emit "penalty-assigned"<br/>to userId
    WS-->>P: Notification

    BE-->>A: Penalty data
```

### 3. Payment & Statistics

```mermaid
flowchart LR
    A[User Dashboard] --> B{View Options}

    B --> C[My Fees]
    B --> D[My Penalties]
    B --> E[Fund Stats]

    C --> F[GET /api/funds/monthly-fees/my]
    D --> G[GET /api/funds/penalties/my]
    E --> H[GET /api/funds/stats]

    F --> I[Show unpaid fees]
    G --> J[Show unpaid penalties]
    H --> K[Total collected<br/>Total unpaid]

    I --> L[Click Pay]
    J --> L

    L --> M[PATCH /api/funds/.../pay<br/>Creates payment]
    M --> N[Redirect to<br/>Payment Gateway]

    style L fill:#4CAF50
    style M fill:#2196F3
```

---

## 🗳️ Voting System

### Complete Voting Flow

```mermaid
sequenceDiagram
    participant A as Admin
    participant BE as Backend
    participant DB as MongoDB
    participant WS as WebSocket
    participant U as Users

    Note over A,U: Create Vote Session

    A->>BE: POST /api/votes/sessions<br/>{title, options, startDate, endDate}
    BE->>DB: Create VoteSession<br/>status: ACTIVE
    DB-->>BE: Session created

    BE->>WS: Emit "vote-session-created"
    WS-->>U: Notification

    BE-->>A: Session data

    Note over A,U: Users Vote

    U->>BE: POST /api/votes/sessions/:id/vote<br/>{selectedOption}

    BE->>DB: Check if user<br/>already voted

    alt Already voted
        BE-->>U: 400 Error
    else Not voted
        BE->>DB: Create VoteResponse
        DB-->>BE: Response saved
        BE-->>U: Success
    end

    Note over A,U: View Results

    A->>BE: GET /api/votes/sessions/:id/stats
    BE->>DB: Aggregate vote responses
    DB-->>BE: Vote statistics
    BE-->>A: {options: [{name, count}]}
```

### Vote Statistics Calculation

```mermaid
flowchart TD
    Start([GET /stats]) --> Query[Query all VoteResponses<br/>for sessionId]
    Query --> Group[Group by selectedOption]
    Group --> Count[Count each group]
    Count --> Sort[Sort by count DESC]
    Sort --> Format[Format as array:<br/>{option, count, percentage}]
    Format --> Return[Return statistics]
    Return --> End([End])

    style Start fill:#4CAF50
    style End fill:#2196F3
```

---

## 🔔 Notification System

### WebSocket Gateway Architecture

```mermaid
graph TB
    subgraph "Clients"
        C1[User 1 Browser]
        C2[User 2 Browser]
        C3[User 3 Mobile]
    end

    subgraph "Backend"
        WS[WebSocket Gateway<br/>@WebSocketGateway]
        AUTH[Auth Middleware]
        EVENTS[Event Handlers]
    end

    subgraph "Services"
        MATCH[Matches Service]
        PAY[Payments Service]
        FUND[Funds Service]
        VOTE[Votes Service]
    end

    C1 --> |WebSocket Connection| WS
    C2 --> |WebSocket Connection| WS
    C3 --> |WebSocket Connection| WS

    WS --> AUTH
    AUTH --> EVENTS

    MATCH -.->|emit event| WS
    PAY -.->|emit event| WS
    FUND -.->|emit event| WS
    VOTE -.->|emit event| WS

    WS -.->|broadcast| C1
    WS -.->|broadcast| C2
    WS -.->|broadcast| C3

    style WS fill:#2196F3
    style AUTH fill:#FF9800
```

### Notification Event Types

```mermaid
flowchart LR
    A[Event Types] --> B[match-created]
    A --> C[player-registered]
    A --> D[teams-split]
    A --> E[payment-confirmed]
    A --> F[monthly-fee-created]
    A --> G[penalty-assigned]
    A --> H[vote-session-created]

    B --> I[Broadcast to all]
    C --> I
    D --> I
    E --> J[Send to specific user]
    F --> I
    G --> J
    H --> I

    style A fill:#4CAF50
    style I fill:#2196F3
    style J fill:#FF9800
```

### WebSocket Connection Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant WS as WebSocket Gateway
    participant AUTH as Auth Service

    C->>WS: Connect with token<br/>ws://localhost:3000?token=xxx
    WS->>AUTH: Validate JWT token

    alt Valid token
        AUTH-->>WS: User info
        WS->>WS: Store connection<br/>with userId
        WS-->>C: Connection accepted
        WS->>C: Emit "connected"
    else Invalid token
        AUTH-->>WS: Error
        WS-->>C: Disconnect
    end

    Note over C,WS: Connected - Listen for events

    WS->>C: Emit "match-created"<br/>{match data}
    C->>C: Update UI

    WS->>C: Emit "payment-confirmed"<br/>{payment data}
    C->>C: Show notification

    Note over C,WS: Disconnect

    C->>WS: Disconnect
    WS->>WS: Remove connection<br/>from pool
```

---

## 🔄 Complete User Journey

### Player Match Journey

```mermaid
flowchart TD
    Start([User Login]) --> Dashboard[View Dashboard]

    Dashboard --> Matches[View Upcoming Matches]
    Matches --> Register{Want to join?}

    Register -->|Yes| CheckReg[Click Register]
    Register -->|No| Dashboard

    CheckReg --> API1[POST /api/matches/:id/register]
    API1 --> Notify1[Receive notification]

    Notify1 --> Wait[Wait for match day]

    Wait --> Split[Admin splits teams]
    Split --> Notify2[Receive team assignment]

    Notify2 --> Play[Play match]

    Play --> Result[Admin updates result]
    Result --> CheckPenalty{Got penalty?}

    CheckPenalty -->|Yes| Notify3[Receive penalty notification]
    CheckPenalty -->|No| CheckFee[Check monthly fee]

    Notify3 --> CheckFee

    CheckFee --> ViewFees[GET /api/funds/my-summary]
    ViewFees --> PaymentDecision{Need to pay?}

    PaymentDecision -->|Yes| ChooseMethod[Choose payment method]
    PaymentDecision -->|No| Dashboard

    ChooseMethod --> Gateway[Payment Gateway]
    Gateway --> Confirm[Payment confirmed]
    Confirm --> Notify4[Receive confirmation]

    Notify4 --> Dashboard

    style Start fill:#4CAF50
    style Dashboard fill:#2196F3
    style Gateway fill:#FF9800
    style Confirm fill:#4CAF50
```

---

## 📊 API Endpoints Summary

### Authentication
```
POST   /api/auth/login          - Email/Password login
POST   /api/auth/register       - Register new user
POST   /api/auth/firebase       - Firebase login (Google/Email)
POST   /api/auth/refresh        - Refresh JWT token
POST   /api/auth/logout         - Logout
```

### Users
```
GET    /api/users               - Get all users
GET    /api/users/me            - Get current user
GET    /api/users/:id           - Get user by ID
PATCH  /api/users/:id           - Update user
DELETE /api/users/:id           - Delete user
```

### Matches
```
POST   /api/matches             - Create match
GET    /api/matches             - Get all matches
GET    /api/matches/:id         - Get match by ID
PATCH  /api/matches/:id         - Update match
DELETE /api/matches/:id         - Delete match
PATCH  /api/matches/:id/register   - Register for match
PATCH  /api/matches/:id/unregister - Unregister from match
POST   /api/matches/:id/split-teams - Split teams
PATCH  /api/matches/:id/result - Update match result
```

### Payments
```
POST   /api/payments            - Create payment
GET    /api/payments            - Get all payments
GET    /api/payments/:id        - Get payment by ID
GET    /api/payments/callback   - Payment gateway callback
POST   /api/payments/casso-webhook - Casso webhook
PATCH  /api/payments/:id/confirm - Admin confirm payment
```

### Funds
```
POST   /api/funds/monthly-fees  - Create monthly fees
GET    /api/funds/monthly-fees  - Get all monthly fees
GET    /api/funds/monthly-fees/unpaid - Get unpaid fees
PATCH  /api/funds/monthly-fees/:id/pay - Pay monthly fee

POST   /api/funds/penalties     - Create penalty
GET    /api/funds/penalties     - Get all penalties
GET    /api/funds/penalties/unpaid - Get unpaid penalties
PATCH  /api/funds/penalties/:id/pay - Pay penalty

GET    /api/funds/stats         - Get fund statistics
GET    /api/funds/my-summary    - Get my payment summary
```

### Votes
```
POST   /api/votes/sessions      - Create vote session
GET    /api/votes/sessions      - Get all vote sessions
GET    /api/votes/sessions/:id  - Get vote session
POST   /api/votes/sessions/:id/vote - Submit vote
GET    /api/votes/sessions/:id/stats - Get vote statistics
```

---

## 🛡️ Security Features

```mermaid
flowchart TD
    A[Security Layers] --> B[Authentication]
    A --> C[Authorization]
    A --> D[Data Validation]
    A --> E[Payment Security]

    B --> B1[Firebase ID Token Verification]
    B --> B2[JWT Access Token]
    B --> B3[JWT Refresh Token]

    C --> C1[Role-based Access Control<br/>ADMIN, PLAYER]
    C --> C2[JWT Auth Guard]
    C --> C3[Roles Guard]

    D --> D1[Class Validator DTOs]
    D --> D2[Validation Pipe]
    D --> D3[Transform Pipe]

    E --> E1[VNPay Signature Verification]
    E --> E2[Momo Signature Verification]
    E --> E3[Casso Secure Token]

    style A fill:#4CAF50
    style B fill:#2196F3
    style C fill:#FF9800
    style D fill:#9C27B0
    style E fill:#F44336
```

---

## 📈 Performance Optimizations

1. **Database Indexing**
   - User email & firebaseUid indexes
   - Match date & status indexes
   - Payment userId & status indexes

2. **Caching Strategy**
   - Firebase singleton instance
   - JWT token caching on client

3. **Real-time Updates**
   - WebSocket for instant notifications
   - Reduces polling overhead

4. **Pagination**
   - Query filters for large datasets
   - Limit/offset pagination

---

## 🚀 Deployment Architecture

```mermaid
graph TB
    subgraph "Production Environment"
        LB[Load Balancer]

        subgraph "API Servers"
            API1[NestJS Instance 1]
            API2[NestJS Instance 2]
        end

        MONGO[(MongoDB Cluster)]
        REDIS[(Redis Cache)]

        subgraph "External Services"
            FB[Firebase]
            VNPAY[VNPay]
            MOMO[Momo]
            CASSO[Casso]
        end
    end

    subgraph "Monitoring"
        LOGS[Logging Service]
        METRICS[Metrics/Analytics]
    end

    LB --> API1
    LB --> API2

    API1 --> MONGO
    API2 --> MONGO

    API1 --> REDIS
    API2 --> REDIS

    API1 --> FB
    API1 --> VNPAY
    API1 --> MOMO
    CASSO --> API1

    API1 --> LOGS
    API2 --> LOGS
    API1 --> METRICS
    API2 --> METRICS

    style LB fill:#4CAF50
    style MONGO fill:#47A248
    style REDIS fill:#DC382D
```

---

## 📝 Environment Variables

```bash
# Application
NODE_ENV=production
PORT=3000

# Database
MONGODB_URI=mongodb+srv://...

# JWT
JWT_SECRET=strong-secret-key
JWT_EXPIRES_IN=1d
JWT_REFRESH_SECRET=strong-refresh-secret
JWT_REFRESH_EXPIRES_IN=7d

# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Payment Gateways
VNPAY_TMN_CODE=your-vnpay-code
VNPAY_HASH_SECRET=your-vnpay-secret
MOMO_PARTNER_CODE=your-momo-code
MOMO_ACCESS_KEY=your-momo-access-key
MOMO_SECRET_KEY=your-momo-secret

# Bank Transfer
BANK_ACCOUNT_NO=your-account-number
BANK_ACCOUNT_NAME=YOUR NAME
BANK_BIN=970416
CASSO_API_KEY=your-casso-key
CASSO_SECURE_TOKEN=your-casso-token

# CORS
FRONTEND_URL=https://your-frontend-domain.com
```

---

## 🎓 Best Practices

### 1. Error Handling
```typescript
// Always use specific error types
throw new UnauthorizedException('Invalid credentials');
throw new NotFoundException('User not found');
throw new ConflictException('Email already exists');
```

### 2. Async/Await
```typescript
// Always use async/await for database operations
async function getUser(id: string) {
  const user = await this.userRepository.findById(id);
  if (!user) throw new NotFoundException();
  return user;
}
```

### 3. Validation
```typescript
// Use DTOs with class-validator
export class CreateMatchDto {
  @IsDate()
  date: Date;

  @IsString()
  @IsNotEmpty()
  location: string;
}
```

---

## 📚 References

- [NestJS Documentation](https://docs.nestjs.com)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [MongoDB Documentation](https://docs.mongodb.com)
- [VNPay Integration](https://sandbox.vnpayment.vn/apis/)
- [Momo Payment](https://developers.momo.vn)
- [Casso Documentation](https://docs.casso.vn)

---

**Document Version:** 1.0
**Last Updated:** 2026-01-12
**Author:** Development Team
