# API Endpoints & Postman Testing Guide — HR Agent

## 1. Tổng quan
File này hướng dẫn cách test toàn bộ API backend của ứng dụng HR Agent bằng Postman, bao gồm:
- Danh sách endpoints (method, URL, chức năng)
- Yêu cầu xác thực (JWT)
- Cách lấy và sử dụng JWT trong Postman
- Hướng dẫn test từng endpoint

---

## 2. Yêu cầu xác thực
- Các endpoint liên quan đến quản lý job, candidate, AI đều yêu cầu JWT (token) ở cookie `access_token`.
- Endpoint `/auth/login` trả về JWT, các endpoint khác cần gửi cookie này.

### Cách lấy JWT:
1. Gửi POST `/auth/login` với thông tin đăng nhập hợp lệ.
2. Sau khi đăng nhập thành công, lấy giá trị cookie `access_token` từ response.
3. Trong Postman, thêm cookie này vào request (tab Cookies hoặc Pre-request Script).

### Cách vượt qua xác thực:
- Nếu không có tài khoản, hãy tạo user test hoặc nhờ admin cung cấp.
- Sau khi có JWT, gửi kèm cookie `access_token` cho các request cần xác thực.

---

## 3. Danh sách API Endpoints

### Auth
- `POST /auth/login` — Đăng nhập, trả về JWT cookie
  - Body: `{ "username": "...", "password": "..." }`
  - Response: `{ "message": "Login success" }` + cookie `access_token`
- `POST /auth/logout` — Đăng xuất, xóa cookie

### CV Upload
- `POST /upload/cv` — Upload CV, parse bằng AI, tạo candidate
  - Form-data: file (PDF/text)
  - Yêu cầu JWT
  - Response: `{ "candidate": { ... } }`

### Job Management
- `GET /job` — Danh sách jobs
  - Yêu cầu JWT
- `POST /job/create` — Tạo job mới
  - Body: `{ "title": "...", "description": "...", ... }`
  - Yêu cầu JWT
- `PATCH /job/update/:id` — Cập nhật job
  - Body: `{ ...fields cần update... }`
  - Yêu cầu JWT
- `DELETE /job/delete/:id` — Xóa job
  - Yêu cầu JWT

### Candidate & AI
- `GET /candidates` — Danh sách candidate
  - Yêu cầu JWT
- `POST /ai` — Phân tích candidate vs job, trả về đánh giá AI
  - Body: `{ "candidateId": "...", "jobId": "..." }`
  - Yêu cầu JWT
  - Response: `{ "score": ..., "summary": ..., "redFlags": ..., "interviewQuestions": ... }`

---

## 4. Hướng dẫn test bằng Postman

### 4.1 Đăng nhập lấy JWT
- Tạo request POST `/auth/login`
- Body dạng JSON: `{ "username": "...", "password": "..." }`
- Sau khi login thành công, kiểm tra tab Cookies, lấy giá trị `access_token`.

### 4.2 Gửi request với JWT
- Trong Postman, ở mỗi request cần xác thực:
  - Vào tab Cookies, thêm cookie `access_token` với giá trị đã lấy.
  - Hoặc dùng Pre-request Script để tự động set cookie.

### 4.3 Test upload CV
- Tạo request POST `/upload/cv`
- Chọn Body dạng form-data, thêm trường `file` (PDF/text)
- Đảm bảo đã set cookie JWT

### 4.4 Test job management
- GET `/job`: Gửi request, kiểm tra response là danh sách jobs.
- POST `/job/create`: Body JSON, gửi request, kiểm tra job mới được tạo.
- PATCH `/job/update/:id`: Body JSON, gửi request với id job cần update.
- DELETE `/job/delete/:id`: Gửi request với id job cần xóa.

### 4.5 Test candidate & AI
- GET `/candidates`: Gửi request, kiểm tra danh sách candidate.
- POST `/ai`: Body JSON với candidateId và jobId, kiểm tra response AI.

---

## 5. Lưu ý
- Nếu gặp lỗi 401/403, kiểm tra lại cookie JWT.
- Đảm bảo backend đã chạy và kết nối đúng MongoDB.
- Có thể dùng Postman Collection để lưu sẵn các request.

---

## 6. Mẫu Pre-request Script (tự động set cookie)
```javascript
pm.environment.set("access_token", "<JWT_TOKEN_HERE>");
// Trong tab Cookies, thêm access_token với giá trị này
```

---

## 7. Tham khảo
- Xem thêm file README.md và backend/.env.example để biết cấu hình môi trường.
- Liên hệ admin nếu cần tài khoản test hoặc gặp vấn đề xác thực.

---

_Last updated: March 2026_