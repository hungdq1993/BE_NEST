# 📱 Danh Sách Màn Hình Front-End

## 🎯 Tổng Quan

Dựa trên hệ thống quản lý đội bóng với các tính năng: Quản lý trận đấu, Thanh toán, Quỹ, Bình chọn, Thông báo.

---

## 🔐 Authentication & User Management

### 1. **Login Page** (`/login`)
**Mô tả**: Màn hình đăng nhập
**Tính năng**:
- Login với Google (Firebase)
- Login với Email/Password
- Remember me
- Forgot password (nếu có)

**API sử dụng**:
- `POST /api/auth/firebase`
- `POST /api/auth/login`

---

### 2. **Register Page** (`/register`)
**Mô tả**: Màn hình đăng ký tài khoản mới
**Tính năng**:
- Form đăng ký (email, password, name)
- Validation
- Link với Firebase

**API sử dụng**:
- `POST /api/auth/register`

---

### 3. **User Profile** (`/profile`)
**Mô tả**: Thông tin cá nhân của user
**Tính năng**:
- Xem thông tin: tên, email, skill level, avatar
- Cập nhật profile
- Đổi mật khẩu
- Upload avatar

**API sử dụng**:
- `GET /api/users/me`
- `PATCH /api/users/:id`

---

## 🏠 Dashboard & Home

### 4. **Dashboard** (`/dashboard`)
**Mô tả**: Trang chủ sau khi login
**Tính năng**:
- Thống kê tổng quan:
  - Số trận sắp tới
  - Số tiền nợ (monthly fees, penalties)
  - Thông báo mới
  - Vote sessions đang mở
- Quick actions
- Recent activities

**API sử dụng**:
- `GET /api/matches?status=UPCOMING`
- `GET /api/funds/user-debt/:userId`
- `GET /api/votes/sessions?status=ACTIVE`

---

## ⚽ Matches Management

### 5. **Matches List** (`/matches`)
**Mô tả**: Danh sách tất cả trận đấu
**Tính năng**:
- Hiển thị danh sách trận đấu (upcoming, past, cancelled)
- Filter theo status, date
- Search
- Pagination
- Quick actions: Register, View details

**API sử dụng**:
- `GET /api/matches`
- `PATCH /api/matches/:id/register`
- `PATCH /api/matches/:id/unregister`

---

### 6. **Match Detail** (`/matches/:id`)
**Mô tả**: Chi tiết trận đấu
**Tính năng**:
- Thông tin trận: date, location, status
- Danh sách players đã đăng ký
- Team lineups (nếu đã chia đội)
- Match result (nếu đã có kết quả)
- Payment info (nếu là team thua)
- Actions:
  - Register/Unregister (player)
  - Split teams (admin)
  - Update result (admin)
  - Process losing team payments (admin)

**API sử dụng**:
- `GET /api/matches/:id`
- `GET /api/funds/matches/:matchId` (chi tiết với payments)
- `PATCH /api/matches/:id/register`
- `POST /api/matches/:id/split-teams`
- `PATCH /api/matches/:id/result`
- `POST /api/funds/matches/:matchId/process-losing-team`

---

### 7. **Create Match** (`/matches/create`) - Admin only
**Mô tả**: Tạo trận đấu mới
**Tính năng**:
- Form tạo match: date, location, match fee
- Validation
- Preview

**API sử dụng**:
- `POST /api/matches`

---

## 💰 Funds Management

### 8. **My Payments** (`/payments/my`)
**Mô tả**: Danh sách thanh toán của user
**Tính năng**:
- Monthly fees chưa đóng
- Penalties chưa đóng
- Match payments chưa đóng
- Lịch sử thanh toán
- Tổng nợ
- Button "Thanh toán" cho từng item

**API sử dụng**:
- `GET /api/funds/user-debt/:userId`
- `GET /api/funds/user-summary/:userId`

---

### 9. **Payment Methods** (`/payments/:type/:id`)
**Mô tả**: Chọn phương thức thanh toán
**Tính năng**:
- Chọn gateway: VNPay, Momo, Bank Transfer
- Hiển thị thông tin thanh toán
- QR code (cho bank transfer)
- Redirect đến payment gateway

**API sử dụng**:
- `POST /api/payments`
- `GET /api/payments/:id`

---

### 10. **Payment Success/Callback** (`/payments/success`)
**Mô tả**: Màn hình sau khi thanh toán thành công
**Tính năng**:
- Hiển thị thông tin thanh toán
- Download receipt (nếu có)
- Link quay về dashboard

**API sử dụng**:
- `GET /api/payments/:id`

---

### 11. **Funds Dashboard** (`/funds`) - Admin only
**Mô tả**: Tổng quan quỹ
**Tính năng**:
- Tổng thu (monthly fees, penalties, match payments)
- Tổng chi (expenses)
- Số dư
- Breakdown theo category
- Charts/Graphs

**API sử dụng**:
- `GET /api/funds/summary`
- `GET /api/funds/stats`

---

### 12. **Monthly Fees Management** (`/funds/monthly-fees`) - Admin only
**Mô tả**: Quản lý tiền tháng
**Tính năng**:
- Danh sách monthly fees
- Tạo monthly fee cho 1 user
- **Tạo monthly fees cho tất cả users** (bulk) - MỚI
- Filter theo period, user, status
- Mark as paid
- Xem danh sách users đã/chưa thanh toán theo period - MỚI

**API sử dụng**:
- `GET /api/funds/monthly-fees`
- `POST /api/funds/monthly-fees`
- `POST /api/funds/monthly-fees/bulk` - MỚI
- `GET /api/funds/monthly-fees/period/status` - MỚI
- `GET /api/funds/monthly-fees/period?month=1&year=2026`
- `PATCH /api/funds/monthly-fees/:id/pay`

---

### 13. **Penalties Management** (`/funds/penalties`) - Admin only
**Mô tả**: Quản lý tiền phạt
**Tính năng**:
- Danh sách penalties
- Tạo penalty cho user
- Filter theo match, user, status
- Mark as paid

**API sử dụng**:
- `GET /api/funds/penalties`
- `POST /api/funds/penalties`
- `PATCH /api/funds/penalties/:id/pay`

---

### 14. **Expenses Management** (`/funds/expenses`) - Admin only
**Mô tả**: Quản lý chi tiêu
**Tính năng**:
- Danh sách expenses
- Tạo expense mới
- Filter theo category, date
- Edit/Delete expense

**API sử dụng**:
- `GET /api/funds/expenses`
- `POST /api/funds/expenses`
- `PUT /api/funds/expenses/:id`
- `DELETE /api/funds/expenses/:id`

---

### 15. **Monthly Fee Period Status** (`/funds/monthly-fees/period/:month/:year`) - Admin only
**Mô tả**: Màn hình chi tiết tình trạng thanh toán theo period - MỚI
**Tính năng**:
- Hiển thị danh sách users đã thanh toán
- Hiển thị danh sách users chưa thanh toán
- Tổng số tiền đã thu/chưa thu
- Export to Excel (nếu có)
- Filter, search

**API sử dụng**:
- `GET /api/funds/monthly-fees/period/status?month=1&year=2026`

---

## 🗳️ Voting System

### 16. **Vote Sessions List** (`/votes`)
**Mô tả**: Danh sách các phiên bình chọn
**Tính năng**:
- Hiển thị active votes
- Hiển thị past votes
- Status badges (ACTIVE, CLOSED, UPCOMING)
- Quick vote button

**API sử dụng**:
- `GET /api/votes/sessions`

---

### 17. **Vote Detail** (`/votes/:id`)
**Mô tả**: Chi tiết phiên bình chọn
**Tính năng**:
- Thông tin vote: title, description, options
- Submit vote (nếu chưa vote)
- View results (nếu đã vote hoặc closed)
- Real-time updates (WebSocket)

**API sử dụng**:
- `GET /api/votes/sessions/:id`
- `POST /api/votes/sessions/:id/vote`
- `GET /api/votes/sessions/:id/stats`

---

### 18. **Create Vote Session** (`/votes/create`) - Admin only
**Mô tả**: Tạo phiên bình chọn mới
**Tính năng**:
- Form tạo vote: title, description, options
- Set start/end date
- Preview

**API sử dụng**:
- `POST /api/votes/sessions`

---

## 👥 Users Management - Admin only

### 19. **Users List** (`/users`)
**Mô tả**: Quản lý users
**Tính năng**:
- Danh sách users
- Filter theo role, status
- Search
- View profile
- Edit/Delete user
- Activate/Deactivate user

**API sử dụng**:
- `GET /api/users`
- `PATCH /api/users/:id`
- `DELETE /api/users/:id`

---

### 19.1. **Users Statistics** (`/users/statistics`) - Admin only
**Mô tả**: Danh sách tất cả users kèm thống kê chi tiết về nợ, thanh toán - MỚI
**Tính năng**:
- **Bảng danh sách users** với các cột:
  - Tên, Email, Role, Skill Level
  - **Tổng nợ** (totalOwed) - highlight màu đỏ nếu > 0
  - **Tổng đã đóng** (totalPaid)
  - **Số trận thua** (losingMatchesCount)
  - **Tiền tháng**: Đã đóng / Chưa đóng
  - **Tiền phạt**: Đã đóng / Chưa đóng
  - **Tiền trận**: Đã đóng / Chưa đóng
  - Status (Active/Inactive)
- **Filter & Sort**:
  - Sort theo: Tổng nợ (cao → thấp), Tên, Số trận thua
  - Filter: Role, Users có nợ, Users active/inactive
  - Search: Theo tên hoặc email
- **Summary Cards** (ở đầu trang):
  - Tổng số users
  - Tổng nợ của tất cả users
  - Tổng đã thu được
  - Breakdown: Tiền tháng chưa thu, Tiền phạt chưa thu, Tiền trận chưa thu
- **Actions**:
  - Click vào user → Navigate đến User Detail
  - Export to Excel (với tất cả thống kê)
  - Print report
  - Quick actions: Xem chi tiết nợ, Thanh toán

**API sử dụng**:
- `GET /api/funds/users-statistics` - MỚI

**UI/UX Suggestions**:
- Table với pagination (20-50 items/page)
- Color coding:
  - Nợ > 0: Highlight màu đỏ nhạt
  - Đã đóng đủ: Màu xanh
  - Có trận thua: Badge màu cam
- Responsive: Mobile view dạng cards thay vì table
- Loading skeleton khi fetch data
- Empty state khi không có users

---

---

### 20. **User Detail** (`/users/:id`)
**Mô tả**: Chi tiết user
**Tính năng**:
- Thông tin user
- Payment history
- Match history
- Vote history
- Edit user info

**API sử dụng**:
- `GET /api/users/:id`
- `GET /api/funds/user-summary/:userId`
- `GET /api/funds/user-debt/:userId`

---

### 20.1. **Users Statistics** (`/users/statistics`) - Admin only
**Mô tả**: Danh sách tất cả users kèm thống kê chi tiết - MỚI
**Tính năng**:
- Danh sách tất cả users với thông tin:
  - Tên, email, role, skill level
  - **Tổng nợ** (totalOwed)
  - **Tổng đã đóng** (totalPaid)
  - **Số trận thua** (losingMatchesCount)
  - **Tiền tháng**: đã đóng/chưa đóng
  - **Tiền phạt**: đã đóng/chưa đóng
  - **Tiền trận**: đã đóng/chưa đóng
- Filter/Sort:
  - Sort theo tổng nợ (cao → thấp)
  - Filter theo role
  - Filter users có nợ
  - Search theo tên/email
- Summary tổng quan:
  - Tổng nợ của tất cả users
  - Tổng đã thu
  - Tổng tiền tháng chưa thu
  - Tổng tiền phạt chưa thu
  - Tổng tiền trận chưa thu
- Actions:
  - Click vào user để xem chi tiết
  - Export to Excel
  - Print report

**API sử dụng**:
- `GET /api/funds/users-statistics` - MỚI

**Response Example**:
```json
{
  "totalUsers": 10,
  "users": [
    {
      "userId": "65f123...",
      "userName": "Nguyễn Văn A",
      "email": "user@example.com",
      "role": "PLAYER",
      "skillLevel": 5,
      "isActive": true,
      "totalOwed": 500000,
      "totalPaid": 1000000,
      "pendingMonthlyFees": 200000,
      "pendingPenalties": 100000,
      "pendingMatchPayments": 200000,
      "losingMatchesCount": 2,
      "totalMonthlyFees": 1200000,
      "paidMonthlyFees": 1000000,
      "unpaidMonthlyFees": 200000,
      "totalPenalties": 300000,
      "paidPenalties": 200000,
      "unpaidPenalties": 100000,
      "totalMatchPayments": 400000,
      "paidMatchPayments": 200000,
      "unpaidMatchPayments": 200000
    }
  ],
  "summary": {
    "totalOwed": 5000000,
    "totalPaid": 10000000,
    "totalPendingMonthlyFees": 2000000,
    "totalPendingPenalties": 1000000,
    "totalPendingMatchPayments": 2000000
  }
}
```

---

## 🔔 Notifications

### 21. **Notifications Center** (`/notifications`)
**Mô tả**: Trung tâm thông báo
**Tính năng**:
- Danh sách notifications
- Mark as read
- Filter theo type
- Real-time updates (WebSocket)

**API sử dụng**:
- WebSocket connection
- `GET /api/notifications` (nếu có REST API)

---

## 📊 Reports & Statistics - Admin only

### 22. **Funds Report** (`/reports/funds`)
**Mô tả**: Báo cáo quỹ
**Tính năng**:
- Charts: Thu-Chi theo tháng
- Breakdown: Monthly fees, penalties, expenses
- Export to PDF/Excel

**API sử dụng**:
- `GET /api/funds/stats`
- `GET /api/funds/summary`

---

### 23. **Matches Report** (`/reports/matches`)
**Mô tả**: Báo cáo trận đấu
**Tính năng**:
- Số trận đấu theo tháng
- Attendance statistics
- Player participation

**API sử dụng**:
- `GET /api/matches` (với filters)

---

## 🎨 Common Components

### Layout Components:
- **Header/Navbar**: Logo, menu, user menu, notifications bell
- **Sidebar**: Navigation menu (responsive)
- **Footer**: Links, copyright

### Shared Components:
- **Loading Spinner**: Global loading state
- **Error Boundary**: Error handling
- **Toast/Notification**: Success/Error messages
- **Modal/Dialog**: Confirmations, forms
- **Table**: Reusable data table với pagination, sorting
- **Form Components**: Input, Select, DatePicker, etc.
- **Charts**: Revenue, expenses charts (nếu dùng Chart.js/Recharts)

---

## 📱 Mobile Responsive

Tất cả màn hình cần responsive cho:
- Desktop (1920px+)
- Tablet (768px - 1024px)
- Mobile (320px - 767px)

---

## 🔄 Real-time Features (WebSocket)

Các màn hình cần real-time updates:
- **Dashboard**: New matches, notifications
- **Match Detail**: Player registrations, team splits
- **Vote Detail**: Vote submissions, results
- **Notifications Center**: New notifications
- **Payment Status**: Payment confirmations

---

## 🎯 Priority Implementation Order

### Phase 1 - Core Features:
1. Login/Register
2. Dashboard
3. Matches List & Detail
4. My Payments
5. Payment Methods

### Phase 2 - Admin Features:
6. Create Match
7. Monthly Fees Management (bao gồm bulk create & period status)
8. Penalties Management
9. Users Management
10. Users Statistics (danh sách users với thống kê nợ) - MỚI

### Phase 3 - Advanced Features:
10. Voting System
11. Expenses Management
12. Reports & Statistics
13. Notifications Center

---

## 🛠️ Tech Stack Recommendations

- **Framework**: React (Vite) hoặc Next.js
- **State Management**: Zustand hoặc Redux Toolkit
- **UI Library**: Ant Design, Material-UI, hoặc Tailwind CSS
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts hoặc Chart.js
- **WebSocket**: Socket.io-client
- **HTTP Client**: Axios
- **Routing**: React Router
- **Date Handling**: date-fns hoặc dayjs

---

## 📝 Notes

- Tất cả màn hình cần có loading states
- Error handling cho mọi API calls
- Toast notifications cho user actions
- Confirmation dialogs cho delete actions
- Form validation đầy đủ
- Accessibility (a11y) considerations

---

**Last Updated**: 2026-01-15
**Version**: 1.0
