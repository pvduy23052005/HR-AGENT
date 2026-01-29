import express from "express";
import cors from "cors";

const app = express();
const PORT = 3000;

// Cho phép tất cả các nguồn (Extension và Frontend) truy cập
app.use(cors());
app.use(express.json());

// Database tạm thời trong RAM
let candidates = [];

// --- API NHẬN DỮ LIỆU TỪ TEST SCRIPT CỦA BẠN ---
app.post("/api/cv", (req, res) => {
  const { candidateName, rawData } = req.body;

  console.log(`\n📩 Nhận được yêu cầu từ Test Script:`);
  console.log(`   - Tên ứng viên: ${candidateName}`);
  console.log(`   - Nội dung: ${rawData.substring(0, 30)}...`);

  // Tạo object ứng viên mới
  const newCandidate = {
    id: Date.now(),
    fullName: candidateName || "Chưa có tên",
    rawData: rawData || "",
    receivedAt: new Date().toLocaleTimeString(),
    // Giả lập một số kỹ năng để Frontend hiển thị cho đẹp
    skills: ["Auto-Generated", "Testing"],
    yearsOfExperience: Math.floor(Math.random() * 10),
  };

  candidates.push(newCandidate);

  // Trả về kết quả cho hàm testSendCV của bạn
  res.status(201).json({
    success: true,
    message: "Đã nhận dữ liệu thành công!",
    receivedData: newCandidate,
  });
});

// --- API CHO FRONTEND LẤY DANH SÁCH ---
app.get("/api/cv", (req, res) => {
  res.json(candidates);
});

app.post("/api/match", (req, res) => {
  res.json({
    result: "CV Nguyễn Văn A – phù hợp 85%",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend đang chạy tại: http://localhost:${PORT}`);
  console.log(`👉 Đang chờ dữ liệu từ hàm testSendCV của bạn...`);
});
