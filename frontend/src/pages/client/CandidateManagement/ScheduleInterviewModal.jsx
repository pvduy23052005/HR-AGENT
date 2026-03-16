import { useState } from "react";
import { toast } from "react-toastify";
import interviewService from "../../../services/client/interviewService";
import "../../../styles/client/pages/scheduleInterviewModal.css";

const ScheduleInterviewModal = ({ candidate, onClose, onSuccess }) => {
  const [time, setTime] = useState("");
  const [address, setAddress] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
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
        candidateID: candidate.id,
        jobID: candidate.jobID,
        time: new Date(time).toISOString(),
        address,
        durationMinutes: Number(durationMinutes),
        notes,
      });

      if (res.success) {
        toast.success("Đặt lịch và gửi lời mời phỏng vấn thành công!");
        onSuccess?.();
        onClose();
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

  return (
    <div className="sim-overlay" onClick={onClose}>
      <div className="sim-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sim-header">
          <h2 className="sim-title">
            Phỏng vấn : {candidate?.personal?.fullName || candidate?.fullName || "Ứng viên"}
          </h2>
        </div>

        {/* Body */}
        <div className="sim-body">
          {/* Thời gian */}
          <div className="sim-field">
            <label className="sim-label">Thời gian đề xuất :</label>
            <div className="sim-input-wrap">
              <input
                type="datetime-local"
                className="sim-input"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
              <span className="sim-icon">📅</span>
            </div>
          </div>

          {/* Thời lượng */}
          <div className="sim-field">
            <label className="sim-label">Thời lượng (phút) :</label>
            <div className="sim-input-wrap">
              <select
                className="sim-input"
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

          {/* Người tham gia (hiển thị info) */}
          <div className="sim-field">
            <label className="sim-label">Người tham gia :</label>
            <div className="sim-input-wrap sim-input-wrap--readonly">
              <span className="sim-readonly-text">
                {candidate?.personal?.email || candidate?.email || "—"}
              </span>
            </div>
          </div>

          {/* Địa điểm / Link */}
          <div className="sim-field">
            <label className="sim-label">Địa điểm/ Link :</label>
            <div className="sim-input-wrap">
              <input
                type="text"
                className="sim-input"
                placeholder="https://meet.google.com/... hoặc địa chỉ văn phòng"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>

          {/* Ghi chú (optional) */}
          <div className="sim-field">
            <label className="sim-label">Ghi chú :</label>
            <div className="sim-input-wrap">
              <textarea
                className="sim-input sim-textarea"
                placeholder="Ghi chú thêm cho buổi phỏng vấn (tuỳ chọn)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sim-footer">
          <button className="sim-btn sim-btn--cancel" onClick={onClose} disabled={loading}>
            Huỷ
          </button>
          <button
            className="sim-btn sim-btn--submit"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Đang gửi..." : "Gửi lời mời"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleInterviewModal;
