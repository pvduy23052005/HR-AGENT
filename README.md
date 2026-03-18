# Intelligent HR Assistant (HR Agent)

**Intelligent HR Assistant** là một nền tảng quản lý tuyển dụng toàn diện, tự động hóa các quy trình sàng lọc hồ sơ, ghép nối công việc (job matching), và phân tích ứng viên. Hệ thống ứng dụng sức mạnh của **Generative AI (Google Gemini)**, trích xuất dữ liệu có cấu trúc và sở hữu giao diện người dùng full-stack hiện đại.

---

## Mục tiêu dự án

Ứng dụng được thiết kế nhằm giúp các chuyên viên Nhân sự (HR) / Tuyển dụng:
- **Tự động phân tích CV** (PDF / văn bản) thành định dạng JSON có cấu trúc.
- **Tự động tìm kiếm ứng viên tiềm năng** bằng cách khai thác thông tin từ LinkedIn, GitHub và các nguồn công khai khác qua luồng duyệt web tự động (agentic browsing).
- **Lưu trữ và quản lý** hồ sơ ứng viên và các bài đăng tuyển dụng.
- **Đánh giá mức độ phù hợp** giữa ứng viên và công việc bằng AI/ngữ nghĩa.
- **Tạo và gửi email tiếp cận (outreach emails)** hoàn toàn tự động khi tìm thấy ứng viên phù hợp.
- **Cung cấp thông tin chi tiết nhanh chóng** (tóm tắt năng lực, cảnh báo rủi ro (red flags), gợi ý câu hỏi phỏng vấn).

> **Luồng làm việc tiêu chuẩn:** Tải CV lên ➔ Phân tích ➔ Lưu trữ ➔ Đánh giá bằng AI ➔ Liên hệ tự động.

---

## Các tính năng chính

### 1. Phân tích & Trích xuất CV (Data Structuring)
- Tải file CV (PDF/Text) trực tiếp qua giao diện web.
- Sử dụng **Google Gemini** (qua `@google/genai`) để đọc và trích xuất dữ liệu ứng viên thành cấu trúc rõ ràng.
- Lưu trữ dữ liệu đã phân tích vào cơ sở dữ liệu MongoDB.

### 2. Quản lý Tin tuyển dụng (Job Management)
- Tạo mới, cập nhật, xóa và liệt kê các bài đăng tuyển dụng.
- Sử dụng tin tuyển dụng làm dữ liệu gốc để AI đối chiếu với hồ sơ ứng viên.

### 3. Quản lý Ứng viên (Candidate Management)
- Danh sách ứng viên đi kèm tóm tắt hồ sơ (kỹ năng nổi bật, thông tin liên hệ, link CV).
- Hồ sơ chi tiết bao gồm lịch sử học vấn, kinh nghiệm làm việc, dự án thực tế và bộ kỹ năng.

### 4. Ghép nối Ứng viên & Công việc bằng AI
Khi chọn một ứng viên và một tin tuyển dụng, **Gemini AI** sẽ tự động:
- Chấm **điểm phù hợp** (Matching score).
- Đưa ra bản **tóm tắt** ngắn gọn.
- Chỉ ra các **điểm cần lưu ý/rủi ro** (Red flags).
- Đề xuất **câu hỏi phỏng vấn** chuyên sâu.

### 5. Tìm kiếm Ứng viên Tự động (Sourcing)
- Tích hợp Nanobrowser (agent flows) để tự động rà soát các hồ sơ khớp với tiêu chí tuyển dụng.
- Thu thập dữ liệu công khai (Trạng thái Open to work, Tech stack, Chức danh) từ LinkedIn/GitHub để xây dựng danh sách tiềm năng.

### 6. Gửi Email & Lên lịch Tự động
- Tự động tạo email cá nhân hóa dựa trên template AI và bối cảnh của ứng viên/công việc.
- Lên lịch hoặc gửi email trực tiếp qua dịch vụ tích hợp.
- Theo dõi trạng thái phản hồi của ứng viên.

### 7. Xác thực & Bảo mật
- Xác thực bằng Token (JWT được lưu trong HTTP-only cookie).
- Bảo vệ các API endpoints bằng middleware an toàn.

---

## Công nghệ sử dụng (Tech Stack)

- **Backend:** Node.js, Express, TypeScript
- **Cơ sở dữ liệu:** MongoDB (Mongoose)
- **Frontend:** React, Vite, React Router, Axios
- **AI Engine:** Google Gemini (`@google/genai`)
- **Lưu trữ file:** Multer (in-memory), Cloudinary
- **Xác thực:** JWT (JSON Web Tokens)

---

## Kiến trúc hệ thống

Dự án được cấu trúc theo mô hình **Monorepo** bao gồm hai ứng dụng chính và một module công cụ:

```text
 repository
 ┣ backend/       # Node.js + Express API server
 ┣ frontend/      # React (Vite) client UI
 ┗ nanobrowser/   # Agent flow dùng để rà soát/sourcing web tự động
