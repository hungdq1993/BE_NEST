# Hướng Dẫn Sử Dụng API - Monthly Fees

## 📋 Tổng Quan

Các API mới và đã được cập nhật cho tính năng quản lý tiền tháng (Monthly Fees).

---

## 🆕 API MỚI

### 1. **POST /api/funds/monthly-fees/bulk**
**Mô tả**: Tạo monthly fees cho TẤT CẢ users trong hệ thống cùng lúc

**Authorization**: `ADMIN` role required

**Request Body**:
```json
{
  "month": 1,
  "year": 2026,
  "amount": 200000,
  "note": "Tiền tháng 1/2026"
}
```

**Validation Rules**:
- `month`: Số từ 1-12 (bắt buộc)
- `year`: Số từ 2000-2100 (bắt buộc)
- `amount`: Số >= 0 (bắt buộc)
- `note`: String (tùy chọn)

**Response** (200 OK):
```json
[
  {
    "id": "65f1234567890abcdef12345",
    "userId": "65f1234567890abcdef11111",
    "userName": "Nguyễn Văn A",
    "month": 1,
    "year": 2026,
    "amount": 200000,
    "isPaid": false,
    "paidAt": null,
    "note": "Tiền tháng 1/2026",
    "createdAt": "2026-01-15T10:30:00.000Z",
    "updatedAt": "2026-01-15T10:30:00.000Z"
  },
  {
    "id": "65f1234567890abcdef12346",
    "userId": "65f1234567890abcdef11112",
    "userName": "Trần Thị B",
    "month": 1,
    "year": 2026,
    "amount": 200000,
    "isPaid": false,
    "paidAt": null,
    "note": "Tiền tháng 1/2026",
    "createdAt": "2026-01-15T10:30:00.000Z",
    "updatedAt": "2026-01-15T10:30:00.000Z"
  }
]
```

**Lưu ý**:
- Nếu user đã có monthly fee cho period này, sẽ tự động skip (không tạo duplicate)
- API sẽ tạo fees cho tất cả users active trong hệ thống
- Nếu không có user nào, sẽ trả về lỗi 400

**Ví dụ sử dụng cURL**:
```bash
curl -X POST "http://localhost:3000/api/funds/monthly-fees/bulk" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "month": 1,
    "year": 2026,
    "amount": 200000,
    "note": "Tiền tháng 1/2026"
  }'
```

---

### 2. **GET /api/funds/monthly-fees/period/status**
**Mô tả**: Lấy danh sách users đã thanh toán và chưa thanh toán theo period (tháng/năm)

**Authorization**: `ADMIN` role required

**Query Parameters**:
- `month` (required): Số từ 1-12
- `year` (required): Số từ 2000-2100

**Response** (200 OK):
```json
{
  "month": 1,
  "year": 2026,
  "totalUsers": 10,
  "paidUsers": [
    {
      "userId": "65f1234567890abcdef11111",
      "userName": "Nguyễn Văn A",
      "feeId": "65f1234567890abcdef12345",
      "amount": 200000,
      "paidAt": "2026-01-16T14:30:00.000Z"
    },
    {
      "userId": "65f1234567890abcdef11112",
      "userName": "Trần Thị B",
      "feeId": "65f1234567890abcdef12346",
      "amount": 200000,
      "paidAt": "2026-01-17T09:15:00.000Z"
    }
  ],
  "unpaidUsers": [
    {
      "userId": "65f1234567890abcdef11113",
      "userName": "Lê Văn C",
      "feeId": "65f1234567890abcdef12347",
      "amount": 200000
    },
    {
      "userId": "65f1234567890abcdef11114",
      "userName": "Phạm Thị D",
      "feeId": null,
      "amount": 0
    }
  ],
  "totalAmount": 2000000,
  "paidAmount": 400000,
  "unpaidAmount": 1600000
}
```

**Giải thích Response**:
- `totalUsers`: Tổng số users trong hệ thống
- `paidUsers`: Danh sách users đã thanh toán (có `feeId` và `paidAt`)
- `unpaidUsers`: Danh sách users chưa thanh toán
  - Nếu có `feeId`: Đã tạo fee nhưng chưa thanh toán
  - Nếu `feeId` = null và `amount` = 0: Chưa tạo fee cho user này
- `totalAmount`: Tổng số tiền cần thu (tổng của tất cả fees đã tạo)
- `paidAmount`: Tổng số tiền đã thu được
- `unpaidAmount`: Tổng số tiền chưa thu được

**Ví dụ sử dụng cURL**:
```bash
curl -X GET "http://localhost:3000/api/funds/monthly-fees/period/status?month=1&year=2026" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🔄 API ĐÃ ĐƯỢC CẬP NHẬT

### 3. **POST /api/funds/monthly-fees** (Đã cập nhật validation)
**Mô tả**: Tạo monthly fee cho 1 user cụ thể (đã thêm validation decorators)

**Authorization**: `ADMIN` role required

**Request Body**:
```json
{
  "userId": "65f1234567890abcdef11111",
  "month": 1,
  "year": 2026,
  "amount": 200000,
  "note": "Tiền tháng 1/2026"
}
```

**Validation Rules** (MỚI):
- `userId`: MongoDB ObjectId hợp lệ (bắt buộc)
- `month`: Số từ 1-12 (bắt buộc)
- `year`: Số từ 2000-2100 (bắt buộc)
- `amount`: Số >= 0 (bắt buộc)
- `note`: String (tùy chọn)

**Response** (200 OK):
```json
{
  "id": "65f1234567890abcdef12345",
  "userId": "65f1234567890abcdef11111",
  "userName": "Nguyễn Văn A",
  "month": 1,
  "year": 2026,
  "amount": 200000,
  "isPaid": false,
  "paidAt": null,
  "note": "Tiền tháng 1/2026",
  "createdAt": "2026-01-15T10:30:00.000Z",
  "updatedAt": "2026-01-15T10:30:00.000Z"
}
```

**Error Responses**:
- `400 Bad Request`: 
  - Validation error (thiếu field, sai format)
  - Duplicate fee: `"Tiền tháng cho user này trong tháng 1/2026 đã tồn tại"`

**Ví dụ sử dụng cURL**:
```bash
curl -X POST "http://localhost:3000/api/funds/monthly-fees" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "65f1234567890abcdef11111",
    "month": 1,
    "year": 2026,
    "amount": 200000,
    "note": "Tiền tháng 1/2026"
  }'
```

---

### 4. **POST /api/funds/penalties** (Đã cập nhật validation)
**Mô tả**: Tạo penalty cho user (đã thêm validation decorators)

**Authorization**: `ADMIN` role required

**Request Body**:
```json
{
  "userId": "65f1234567890abcdef11111",
  "matchId": "65f1234567890abcdef22222",
  "amount": 50000,
  "reason": "ĐI_MUON",
  "description": "Đi muộn 15 phút"
}
```

**Validation Rules** (MỚI):
- `userId`: MongoDB ObjectId hợp lệ (bắt buộc)
- `matchId`: MongoDB ObjectId hợp lệ (bắt buộc)
- `amount`: Số >= 0 (bắt buộc)
- `reason`: String, min length 1 (bắt buộc)
- `description`: String (tùy chọn)

---

## 📝 Workflow Sử Dụng Đề Xuất

### Scenario 1: Tạo đợt thanh toán tiền tháng mới cho tất cả users

**Bước 1**: Tạo monthly fees cho tất cả users
```http
POST /api/funds/monthly-fees/bulk
{
  "month": 1,
  "year": 2026,
  "amount": 200000,
  "note": "Tiền tháng 1/2026"
}
```

**Bước 2**: Xem danh sách users đã/chưa thanh toán
```http
GET /api/funds/monthly-fees/period/status?month=1&year=2026
```

**Bước 3**: Đánh dấu user đã thanh toán (khi user nộp tiền)
```http
PATCH /api/funds/monthly-fees/{feeId}/pay
```

**Bước 4**: Xem lại danh sách để cập nhật
```http
GET /api/funds/monthly-fees/period/status?month=1&year=2026
```

---

### Scenario 2: Tạo monthly fee cho 1 user cụ thể

```http
POST /api/funds/monthly-fees
{
  "userId": "65f1234567890abcdef11111",
  "month": 1,
  "year": 2026,
  "amount": 200000,
  "note": "Tiền tháng 1/2026"
}
```

---

## ⚠️ Lưu Ý Quan Trọng

1. **Duplicate Prevention**: 
   - Hệ thống có unique index trên `(user, month, year)`
   - Nếu tạo duplicate, sẽ trả về lỗi 400 với message rõ ràng

2. **Bulk Create**:
   - API `bulk` sẽ tự động skip users đã có fee cho period đó
   - Chỉ tạo fees cho users chưa có

3. **Period Status**:
   - API `period/status` sẽ hiển thị TẤT CẢ users trong hệ thống
   - Users chưa có fee sẽ có `feeId: null` và `amount: 0`
   - Users đã có fee nhưng chưa thanh toán sẽ có `feeId` và `amount`

4. **Authorization**:
   - Tất cả endpoints đều yêu cầu `ADMIN` role
   - Cần JWT token hợp lệ trong header: `Authorization: Bearer {token}`

---

## 🔗 Base URL

- **Development**: `http://localhost:3000/api`
- **Production**: `https://your-domain.com/api`

---

---

## 🆕 API MỚI: Users Statistics

### 3. **GET /api/funds/users-statistics**
**Mô tả**: Lấy danh sách tất cả users kèm thống kê chi tiết về nợ, thanh toán, số trận thua

**Authorization**: `ADMIN` role required

**Response** (200 OK):
```json
{
  "totalUsers": 10,
  "users": [
    {
      "userId": "65f1234567890abcdef11111",
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

**Giải thích Response**:
- `users`: Danh sách users với thống kê đầy đủ
  - `totalOwed`: Tổng nợ (monthly fees + penalties + match payments chưa đóng)
  - `totalPaid`: Tổng đã đóng
  - `losingMatchesCount`: Số trận thua (match payments chưa đóng)
  - `pendingMonthlyFees`: Tiền tháng chưa đóng
  - `pendingPenalties`: Tiền phạt chưa đóng
  - `pendingMatchPayments`: Tiền trận chưa đóng
- `summary`: Tổng hợp của tất cả users

**Ví dụ sử dụng cURL**:
```bash
curl -X GET "http://localhost:3000/api/funds/users-statistics" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Use Cases**:
- Màn hình danh sách users với thống kê nợ
- Báo cáo tổng hợp tình trạng thanh toán
- Export Excel cho admin
- Filter/Sort users theo nợ

---

## 📚 Các API Liên Quan

- `GET /api/funds/monthly-fees` - Lấy tất cả monthly fees
- `GET /api/funds/monthly-fees/unpaid` - Lấy monthly fees chưa thanh toán
- `GET /api/funds/monthly-fees/period?month=1&year=2026` - Lấy fees theo period
- `GET /api/funds/users-statistics` - Lấy thống kê tất cả users - MỚI
- `GET /api/funds/user-summary/:userId` - Lấy summary của 1 user
- `GET /api/funds/user-debt/:userId` - Lấy chi tiết nợ của 1 user
- `PATCH /api/funds/monthly-fees/{id}/pay` - Đánh dấu đã thanh toán
- `DELETE /api/funds/monthly-fees/{id}` - Xóa monthly fee
