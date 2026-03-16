import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import interviewService from "../../../services/client/interviewService";
import candidateService from "../../../services/client/candidateService";
import "../../../styles/client/pages/scheduleInterviewPage.css";

const ScheduleInterviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [time, setTime] = useState("");
  const [address, setAddress] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    fetchCandidate();
  }, [id]);

  const fetchCandidate = async () => {
    try {
      const res = await candidateService.getCandidateDetail(id);
      if (res.success && res.candidate) {
        setCandidate(res.candidate);
      } else {
        toast.error("Không tìm thấy ứng viên");
        navigate(-1);
      }
    } catch (err) {
      toast.error("Lỗi khi tải dữ liệu ứng viên");
      navigate(-1);
    } finally {
      setPageLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!time) {
      toast.warning("Vui lòng chọn thời gian phỏng vấn!");
      return;
    }
    if (!address.trim()) {
      toast.warning("Vui lòng nhập địa điểm / meeting link!");
      return;
    }

    try {
      setLoading(true);
      const res = await interviewService.schedule({
        candidateID: candidate._id || candidate.id,
        jobID: candidate.jobID || candidate.job?._id || "",
        time: new Date(time).toISOString(),
        address,
        durationMinutes: Number(durationMinutes),
        notes,
      });

      if (res.success) {
        toast.success("Đặt lịch và gửi lời mời phỏng vấn thành công!");
        setTimeout(() => {
          navigate(`/applications/${id}`);
        }, 1500);
      } else {
        toast.error(res.message || "Đặt lịch thất bại!");
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "Lỗi khi đặt lịch phỏng vấn!";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return <div className="sip-loading">Đang tải...</div>;
  }

  if (!candidate) {
    return <div className="sip-error">Không tìm thấy ứng viên</div>;
  }

  return (
    <div className="schedule-interview-page">
      <button className="sip-back-btn" onClick={() => navigate(-1)}>
        ← Quay lại
      </button>

      <div className="sip-container">
        {/* Left Side - Info */}
        <div className="sip-left">
          <div className="sip-card sip-candidate-info">
            <h2 className="sip-card-title">ℹ️ Thông Tin Ứng Viên</h2>
            <div className="sip-info-item">
              <label>Họ Tên</label>
              <span className="sip-info-value">
                {candidate?.personal?.fullName || "—"}
              </span>
            </div>
            <div className="sip-info-item">
              <label>Email</label>
              <span className="sip-info-value">
                {candidate?.personal?.email || "—"}
              </span>
            </div>
            <div className="sip-info-item">
              <label>Điện Thoại</label>
              <span className="sip-info-value">
                {candidate?.personal?.phone || "—"}
              </span>
            </div>
            <div className="sip-info-item">
              <label>Vị Trí Ứng Tuyển</label>
              <span className="sip-info-value">
                {candidate?.job?.title || "—"}
              </span>
            </div>
          </div>

          <div className="sip-card sip-tips">
            <h3 className="sip-card-title">💡 Gợi Ý</h3>
            <ul className="sip-tips-list">
              <li>Chọn thời gian phù hợp với cả 2 bên</li>
              <li>Chuẩn bị một danh sách các câu hỏi</li>
              <li>Kiểm tra đường truyền internet trước cuộc họp</li>
              <li>Gửi lịch sớm để ứng viên có thời gian chuẩn bị</li>
            </ul>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="sip-right">
          <div className="sip-card sip-form-card">
            <h1 className="sip-form-title">
              📅 Lên Lịch Phỏng Vấn: {candidate?.personal?.fullName}
            </h1>

            <form onSubmit={handleSubmit} className="sip-form">
              {/* Thời gian */}
              <div className="sip-form-group">
                <label htmlFor="time" className="sip-form-label">
                  Thời gian đề xuất <span className="sip-required">*</span>
                </label>
                <div className="sip-form-input-wrap">
                  <input
                    id="time"
                    type="datetime-local"
                    className="sip-form-input"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  />
                  <span className="sip-form-icon">📅</span>
                </div>
              </div>

              {/* Thời lượng */}
              <div className="sip-form-group">
                <label htmlFor="duration" className="sip-form-label">
                  Thời lượng (phút)
                </label>
                <div className="sip-form-input-wrap">
                  <select
                    id="duration"
                    className="sip-form-input"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(e.target.value)}
                  >
                    <option value={30}>30 phút</option>
                    <option value={45}>45 phút</option>
                    <option value={60}>60 phút</option>
                    <option value={90}>90 phút</option>
                    <option value={120}>120 phút</option>
                  </select>
                </div>
              </div>

              {/* Người tham gia */}
              <div className="sip-form-group">
                <label className="sip-form-label">Người tham gia</label>
                <div className="sip-form-input-wrap sip-form-input-wrap--readonly">
                  <span className="sip-form-readonly">
                    {candidate?.personal?.email || "—"}
                  </span>
                </div>
              </div>

              {/* Địa điểm / Link */}
              <div className="sip-form-group">
                <label htmlFor="address" className="sip-form-label">
                  Địa điểm / Link <span className="sip-required">*</span>
                </label>
                <div className="sip-form-input-wrap">
                  <input
                    id="address"
                    type="text"
                    className="sip-form-input"
                    placeholder="https://meet.google.com/... hoặc địa chỉ văn phòng"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                  <span className="sip-form-icon">🔗</span>
                </div>
              </div>

              {/* Ghi chú */}
              <div className="sip-form-group">
                <label htmlFor="notes" className="sip-form-label">
                  Ghi chú (tuỳ chọn)
                </label>
                <div className="sip-form-input-wrap">
                  <textarea
                    id="notes"
                    className="sip-form-input sip-form-textarea"
                    placeholder="VD: Chuẩn bị thảo luận về kỹ năng leadership, background kinh nghiệm..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="sip-form-actions">
                <button
                  type="button"
                  className="sip-btn sip-btn--cancel"
                  onClick={() => navigate(-1)}
                  disabled={loading}
                >
                  Huỷ
                </button>
                <button
                  type="submit"
                  className="sip-btn sip-btn--submit"
                  disabled={loading}
                >
                  {loading ? "Đang gửi..." : "✉️ Gửi lời mời"}
                </button>
              </div>
            </form>

            <div className="sip-form-note">
              <p>
                ✓ Hệ thống sẽ tự động gửi email mời và tạo sự kiện trên lịch của ứng viên
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleInterviewPage;
