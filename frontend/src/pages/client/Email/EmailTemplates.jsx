import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "../../../styles/client/pages/emailTemplates.css";

const EMAIL_TEMPLATES = [
  {
    id: 1,
    name: "Mẫu 1",
    title: "[HR-Agent] Thư mời phỏng vấn vị trí [Tên Vị Trí]",
    content: `Thân gửi [Tên Ứng Viên],

Cảm ơn bạn đã ứng tuyển vị trí [Tên Vị Trí] tại công ty chúng tôi. Hệ thống và đội tuyển dụng rất ấn tượng với các kỹ năng của bạn.

Chúng tôi rất muốn tìm hiểu thêm về bạn thông qua một cuộc phỏng vấn. Dưới đây là thông tin buổi phỏng vấn:

**Thông tin buổi phỏng vấn:**
- Thời gian: [Giờ] ngày [Ngày/Tháng/Năm]
- Hình thức: Phỏng vấn trực tuyến qua Google Meet
- Link tham gia: [Link Google Meet]
- Người phỏng vấn: [Tên người phỏng vấn]

Vui lòng xác nhận tham gia qua email này để chúng tôi sắp xếp lịch thích hợp. Nếu bạn không thể tham gia vào thời gian trên, vui lòng liên hệ với chúng tôi sớm.

Trân trọng,
[Tên Chuyên Viên / Công ty]`,
  },
  {
    id: 2,
    name: "Mẫu 2",
    title: "[HR-Agent] Kết quả phỏng vấn",
    content: `Thân gửi [Tên Ứng Viên],

Cảm ơn bạn đã dành thời gian tham gia buổi phỏng vấn cho vị trí [Tên Vị Trí]. Đây là cơ hội tốt để chúng tôi tìm hiểu rõ hơn về kinh nghiệm và kỹ năng của bạn.

Sau khi xem xét kỹ lưỡng, chúng tôi quyết định tiếp tục với vòng phỏng vấn tiếp theo. Chúng tôi sẽ liên hệ với bạn trong vòng [X] ngày để sắp xếp lịch.

Nếu bạn có bất kỳ câu hỏi nào, vui lòng không ngần ngại liên hệ với chúng tôi.

Trân trọng,
[Tên Chuyên Viên / Công ty]`,
  },
  {
    id: 3,
    name: "Mẫu 3",
    title: "[HR-Agent] Thư từ chối ứng tuyển",
    content: `Thân gửi [Tên Ứng Viên],

Cảm ơn bạn đã ứng tuyển và tham gia phỏng vấn cho vị trí [Tên Vị Trí] tại công ty chúng tôi. Chúng tôi đánh giá cao sự nỗ lực và kinh nghiệm của bạn.

Tuy nhiên, sau khi xem xét toàn bộ các ứng viên, chúng tôi quyết định tiếp tục với các ứng viên khác có kinh nghiệm phù hợp hơn với vị trí này.

Chúng tôi hy vọng sẽ có cơ hội hợp tác với bạn trong tương lai. Vui lòng theo dõi các cơ hội việc làm khác trên website của chúng tôi.

Trân trọng,
[Tên Chuyên Viên / Công ty]`,
  },
  {
    id: 4,
    name: "Mẫu 4",
    title: "[HR-Agent] Thư chào hỏi cập nhật tiến độ",
    content: `Thân gửi [Tên Ứng Viên],

Chúng tôi muốn cập nhật cho bạn về tiến độ của hồ sơ ứng tuyển vị trí [Tên Vị Trí].

Hiện tại, hồ sơ của bạn đang được xem xét kỹ lưỡng bởi đội tuyển dụng. Chúng tôi sẽ liên hệ với bạn trong vòng [X] ngày nữa để thông báo kết quả hoặc sắp xếp vòng phỏng vấn tiếp theo.

Nếu bạn có bất kỳ câu hỏi hay cần thêm thông tin, vui lòng liên hệ với chúng tôi.

Trân trọng,
[Tên Chuyên Viên / Công ty]`,
  },
];

const EmailTemplates = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCandidates, setSelectedCandidates] = useState([]);

  useEffect(() => {
    // Lấy selectedCandidateIds từ React Router state
    const state = location.state?.selectedCandidateIds;
    if (state && Array.isArray(state)) {
      setSelectedCandidates(state);
    } else {
      toast.warning("Không có ứng viên nào được chọn!");
      navigate("/candidates");
    }
  }, [navigate, location]);

  const handleSelectTemplate = (template) => {
    // Truyền template + selectedCandidates qua React Router state
    navigate(`/candidates/emails/${template.id}/detail`, {
      state: { 
        selectedTemplate: template,
        selectedCandidateIds: selectedCandidates 
      }
    });
  };

  return (
    <div className="email-templates-page">
      <button className="etp-back" onClick={() => navigate("/candidates")}>
        ← Quay lại
      </button>

      <div className="etp-header">
        <h1>Danh sách mẫu email</h1>
        <p>Chọn mẫu email để gửi cho {selectedCandidates.length} ứng viên đã chọn</p>
      </div>

      <div className="etp-container">
        <div className="etp-templates">
          {EMAIL_TEMPLATES.map((template) => (
            <div key={template.id} className="etp-template-card">
              <h3 className="etp-template-name">{template.name}</h3>
              <p className="etp-template-title">{template.title}</p>
              <p className="etp-template-preview">
                {template.content.substring(0, 120)}...
              </p>
              <button
                className="etp-btn-select"
                onClick={() => handleSelectTemplate(template)}
              >
                Chọn mẫu này
              </button>
            </div>
          ))}
        </div>

        {/* Side Info */}
        <div className="etp-side">
          <div className="etp-info-card">
            <h3>Thông tin</h3>
            <div className="etp-info-item">
              <span className="etp-label">Ứng viên được chọn:</span>
              <span className="etp-value">{selectedCandidates.length}</span>
            </div>
            <p className="etp-note">
              Bạn sẽ gửi email đến tất cả ứng viên đã chọn. Có thể tuỳ chỉnh nội dung email trước khi gửi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailTemplates;
