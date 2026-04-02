# API Endpoints & Postman Testing Guide — HR Agent

## 1. Tổng quan

Hướng dẫn test toàn bộ API backend của ứng dụng HR Agent bằng Postman. Hệ thống chia làm 2 module chính:

- **Client** (`/`) — Dành cho HR users (quản lý job, candidate, AI, v.v.)
- **Admin** (`/admin`) — Dành cho quản trị hệ thống (quản lý users, thống kê)

---

## 2. Xác thực (Authentication)

Tất cả các endpoint được bảo vệ đều yêu cầu JWT ở cookie `access_token`.

### Cách lấy JWT:

1. Gửi `POST /auth/login` với body hợp lệ.
2. Response trả về cookie `access_token` — Postman tự động lưu cookie.
3. Các request tiếp theo sẽ tự động gửi kèm cookie.

### Lưu ý:

- Nếu gặp lỗi **401 Unauthorized** → cookie hết hạn hoặc chưa login.
- Nếu gặp lỗi **403 Forbidden** → tài khoản không đủ quyền.

---

## 3. Client Module — API Endpoints

### 3.1 Auth

| Method | Endpoint        | Mô tả                  | Auth |
|--------|-----------------|-------------------------|------|
| POST   | `/auth/login`   | Đăng nhập, trả JWT      | ❌   |
| POST   | `/auth/logout`  | Đăng xuất, xóa cookie   | ✅   |

**Body — Login:**
```json
{
  "email": "hr@example.com",
  "password": "123456"
}
```

---

### 3.2 User (Password Management)

| Method | Endpoint                      | Mô tả                        | Auth |
|--------|-------------------------------|-------------------------------|------|
| POST   | `/user/password/forgot`       | Gửi OTP qua email             | ❌   |
| POST   | `/user/password/otp`          | Xác minh OTP                  | ❌   |
| POST   | `/user/password/reset`        | Đặt lại mật khẩu (qua OTP)   | ❌   |
| POST   | `/user/password/reset-not-otp`| Đổi mật khẩu (đang đăng nhập) | ✅   |

**Body — Forgot Password:**
```json
{
  "email": "hr@example.com"
}
```

**Body — Verify OTP:**
```json
{
  "email": "hr@example.com",
  "otp": "123456"
}
```

**Body — Reset Password:**
```json
{
  "email": "hr@example.com",
  "otp": "123456",
  "newPassword": "newPassword123"
}
```

---

### 3.3 Upload CV

| Method | Endpoint      | Mô tả                                  | Auth |
|--------|---------------|-----------------------------------------|------|
| POST   | `/upload/cv`  | Upload CV (PDF) + avatar, parse bằng AI | ✅   |

**Body (form-data):**
- `cv` — file PDF (required)
- `avatar` — file ảnh (optional)

---

### 3.4 Job Management

| Method | Endpoint             | Mô tả                        | Auth |
|--------|----------------------|-------------------------------|------|
| GET    | `/job`               | Lấy danh sách jobs            | ✅   |
| GET    | `/job/detail/:id`    | Lấy chi tiết 1 job            | ✅   |
| GET    | `/job/:id/candidates`| Lấy danh sách ứng viên theo job| ✅   |
| POST   | `/job/create`        | Tạo job mới                   | ✅   |
| PATCH  | `/job/update/:id`    | Cập nhật job                  | ✅   |
| DELETE | `/job/delete/:id`    | Xóa job                       | ✅   |

**Body — Create/Update Job:**
```json
{
  "title": "Frontend Developer",
  "description": "Phát triển giao diện web...",
  "requirements": "React, TypeScript...",
  "salary": "15-25 triệu",
  "location": "Hà Nội"
}
```

---

### 3.5 Candidate

| Method | Endpoint                          | Mô tả                    | Auth |
|--------|-----------------------------------|---------------------------|------|
| GET    | `/candidates`                     | Lấy danh sách candidates  | ✅   |
| GET    | `/candidates/:candidateID`        | Chi tiết 1 candidate      | ✅   |
| PATCH  | `/candidates/change-status/:id`   | Đổi trạng thái ứng viên   | ✅   |

**Body — Change Status:**
```json
{
  "status": "accepted"
}
```

---

### 3.6 AI Analysis

| Method | Endpoint       | Mô tả                                     | Auth |
|--------|----------------|--------------------------------------------|------|
| POST   | `/ai/analyze`  | Phân tích ứng viên vs job, trả đánh giá AI | ✅   |

**Body:**
```json
{
  "candidateId": "...",
  "jobId": "..."
}
```

**Response:**
```json
{
  "score": 85,
  "summary": "...",
  "redFlags": [...],
  "interviewQuestions": [...]
}
```

---

### 3.7 Verification

| Method | Endpoint                            | Mô tả                         | Auth |
|--------|-------------------------------------|--------------------------------|------|
| GET    | `/verification/:candidateID`        | Lấy chi tiết kiểm chứng       | ✅   |
| POST   | `/verification/candidate`           | Gửi kiểm chứng ứng viên       | ✅   |
| POST   | `/verification/confirm`             | Xác nhận kết quả kiểm chứng   | ✅   |

**Body — Verify Candidate:**
```json
{
  "candidateID": "...",
  "data": { ... }
}
```

**Body — Confirm Verification:**
```json
{
  "candidateID": "...",
  "status": "verified"
}
```

---

### 3.8 Interview

| Method | Endpoint               | Mô tả                  | Auth |
|--------|------------------------|-------------------------|------|
| POST   | `/interview/schedule`  | Lên lịch phỏng vấn      | ✅   |

---

### 3.9 Email

| Method | Endpoint          | Mô tả                    | Auth |
|--------|-------------------|---------------------------|------|
| POST   | `/email/send-bulk`| Gửi email hàng loạt        | ✅   |

---

### 3.10 Report

| Method | Endpoint              | Mô tả                  | Auth |
|--------|-----------------------|-------------------------|------|
| GET    | `/report/statistics`  | Lấy thống kê tổng quan  | ✅   |

---

## 4. Admin Module — API Endpoints

### 4.1 Admin Auth

| Method | Endpoint            | Mô tả                  | Auth |
|--------|---------------------|-------------------------|------|
| POST   | `/admin/auth/login` | Đăng nhập admin         | ❌   |
| POST   | `/admin/auth/logout`| Đăng xuất admin         | ✅   |

**Body — Login:**
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

---

### 4.2 Admin User Management

| Method | Endpoint                      | Mô tả                    | Auth |
|--------|-------------------------------|---------------------------|------|
| GET    | `/admin/users`                | Danh sách HR users        | ✅   |
| POST   | `/admin/users/create`         | Tạo user mới              | ✅   |
| PATCH  | `/admin/users/edit/:id`       | Cập nhật thông tin user   | ✅   |
| POST   | `/admin/users/change-status`  | Đổi trạng thái user       | ✅   |

**Body — Create User:**
```json
{
  "fullName": "Nguyễn Văn A",
  "email": "user@example.com",
  "password": "123456"
}
```

**Body — Edit User:**
```json
{
  "fullName": "Nguyễn Văn B",
  "email": "newemail@example.com",
  "status": "active"
}
```

**Body — Change Status:**
```json
{
  "id": "userId...",
  "status": "inactive"
}
```

---

### 4.3 Admin Report & Statistics

| Method | Endpoint                     | Mô tả                     | Auth |
|--------|------------------------------|----------------------------|------|
| GET    | `/admin/report/statistics`   | Thống kê hệ thống          | ✅   |
| GET    | `/admin/report/users`        | Danh sách tất cả HR users   | ✅   |
| GET    | `/admin/report/export`       | Xuất báo cáo thống kê       | ✅   |

---

## 5. Hướng dẫn test bằng Postman

### Bước 1: Login lấy JWT
1. Tạo request `POST /auth/login`.
2. Body JSON: `{ "email": "...", "password": "..." }`.
3. Sau khi thành công, Postman tự lưu cookie `access_token`.

### Bước 2: Test các endpoint
- Đảm bảo đã login trước khi gọi các endpoint có Auth ✅.
- Postman tự gửi cookie nếu cùng domain.

### Bước 3: Upload CV
- Chọn Body → form-data.
- Thêm field `cv` (type: File) và chọn file PDF.
- Có thể thêm field `avatar` (type: File) nếu cần.

---

## 6. Mẫu Pre-request Script (tự động login)

```javascript
// Tự động login nếu chưa có token
const loginRequest = {
  url: pm.environment.get("base_url") + "/auth/login",
  method: "POST",
  header: { "Content-Type": "application/json" },
  body: {
    mode: "raw",
    raw: JSON.stringify({
      email: pm.environment.get("email"),
      password: pm.environment.get("password")
    })
  }
};

pm.sendRequest(loginRequest, (err, res) => {
  if (!err && res.code === 200) {
    console.log("Auto-login thành công!");
  }
});
```

---

## 7. Environment Variables (Postman)

| Variable   | Giá trị mặc định           |
|------------|-----------------------------|
| `base_url` | `http://localhost:5050`      |
| `email`    | `hr@example.com`            |
| `password` | `123456`                     |

---

## 8. Lưu ý

- Đảm bảo backend đã chạy (`pnpm dev`) và kết nối đúng MongoDB.
- Sử dụng Postman Collection để lưu và tổ chức các request.
- Xem thêm file `README.md` và `.env.example` để biết cấu hình môi trường.
