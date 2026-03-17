import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import emailService from "../../services/client/emailService";
import "../../styles/client/pages/emailDetail.css";

const EmailDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [template, setTemplate] = useState(null);
  const [customTitle, setCustomTitle] = useState("");
  const [customContent, setCustomContent] = useState("");
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    // Lấy template + selectedCandidateIds từ React Router state
    const state = location.state;
    
    if (state?.selectedTemplate) {
      const tmpl = state.selectedTemplate;
      setTemplate(tmpl);
      setCustomTitle(tmpl.title);
      setCustomContent(tmpl.content);
    } else {
      toast.warning("Không có mẫu email nào được chọn!");
      navigate("/applications/emails");
      return;
    }

    if (state?.selectedCandidateIds && Array.isArray(state.selectedCandidateIds)) {
      setSelectedCandidates(state.selectedCandidateIds);
    } else {
      toast.warning("Không có ứng viên nào được chọn!");
      navigate("/applications");
    }
  }, [navigate, location]);

  const handleSend = async () => {
    if (!customTitle.trim()) {
      toast.warning("Vui lòng nhập tiêu đề email!");
      return;
    }
    if (!customContent.trim()) {
      toast.warning("Vui lòng nhập nội dung email!");
      return;
    }

    setSending(true);
    toast.info(`🔄 Đang gửi email tới ${selectedCandidates.length} ứng viên...`);

    try {
      const response = await emailService.sendBulkEmail({
        candidateIds: selectedCandidates,
        template: {
          id: template.id,
          name: template.name,
        },
        title: customTitle,
        content: customContent,
      });

      if (response.success) {
        toast.success(
          `✅ Gửi email thành công tới ${selectedCandidates.length} ứng viên!`
        );
        // Redirect về applications
        setTimeout(() => {
          navigate("/applications");
        }, 1500);
      } else {
        toast.error(response.message || "Gửi email thất bại!");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Có lỗi xảy ra khi gửi email!");
    } finally {
      setSending(false);
    }
  };

  if (!template) {
    return <div className="ed-loading">Đang tải...</div>;
  }

  return (
    <div className="email-detail-page">
      <button className="ed-back" onClick={() => navigate("/applications/emails")}>
        ← Quay lại
      </button>

      <div className="ed-header">
        <h1>Chỉnh sửa email</h1>
        <p>Mẫu: <strong>{template.name}</strong> | Gửi tới: <strong>{selectedCandidates.length} ứng viên</strong></p>
      </div>

      <div className="ed-container">
        {/* Main Content */}
        <div className="ed-main">
          <div className="ed-section">
            <label className="ed-label">Tiêu đề Email</label>
            <input
              type="text"
              className="ed-input"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="Nhập tiêu đề email..."
            />
          </div>

          <div className="ed-section">
            <label className="ed-label">Nội dung Email</label>
            <textarea
              className="ed-textarea"
              value={customContent}
              onChange={(e) => setCustomContent(e.target.value)}
              placeholder="Nhập nội dung email..."
              rows={20}
            />
            <p className="ed-hint">
              💡 Gợi ý: Sử dụng [Tên Ứng Viên], [Tên Vị Trí], [Công ty], v.v. để thay thế động
            </p>
          </div>
        </div>

        {/* Side Panel */}
        <div className="ed-side">
          <div className="ed-card">
            <h3>📋 Thông tin gửi</h3>
            <div className="ed-info-item">
              <span className="ed-key">Mẫu:</span>
              <span className="ed-value">{template.name}</span>
            </div>
            <div className="ed-info-item">
              <span className="ed-key">Ứng viên:</span>
              <span className="ed-value">{selectedCandidates.length}</span>
            </div>
            <div className="ed-info-item">
              <span className="ed-key">Tiêu đề:</span>
              <span className="ed-value-preview">{customTitle || "—"}</span>
            </div>
          </div>

          <div className="ed-card ed-preview">
            <h3>👁️ Xem trước</h3>
            <div className="ed-preview-content">
              <div className="ed-preview-title">{customTitle}</div>
              <div className="ed-preview-body">
                {customContent.substring(0, 200)}...
              </div>
            </div>
          </div>

          <button
            className="ed-btn-send"
            onClick={handleSend}
            disabled={sending}
          >
            {sending ? "⏳ Đang gửi..." : "✉️ Gửi email"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailDetail;
