import { useState } from "react";
import { toast } from "react-toastify";
import interviewService from "../../../services/client/interviewService";
import "../../../styles/admin/pages/interviewDetailModal.css";

const InterviewDetailModal = ({ schedule, candidate, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [time, setTime] = useState(schedule?.time ? new Date(schedule.time).toISOString().slice(0, 16) : "");
  const [address, setAddress] = useState(schedule?.address || "");
  const [status, setStatus] = useState(schedule?.status || "scheduled");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!time.trim() || !address.trim()) {
      toast.warning("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      setLoading(true);
      const res = await interviewService.updateSchedule(schedule.id, {
        time: new Date(time).toISOString(),
        address,
        status,
      });

      if (res.success) {
        toast.success("Cập nhật lịch phỏng vấn thành công");
        setIsEditing(false);
        onUpdate?.();
      } else {
        toast.error(res.message || "Cập nhật thất bại");
      }
    } catch (err) {
      toast.error("Lỗi khi cập nhật lịch phỏng vấn");
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN");
  };

  return (
    <div className="idm-overlay" onClick={onClose}>
      <div className="idm-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="idm-header">
          <h2 className="idm-title">
            Phỏng vấn : {candidate?.personal?.fullName || "Ứng viên"}
          </h2>
          <button className="idm-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div className="idm-body">
          {isEditing ? (
            <>
              {/* Editing Mode */}
              <div className="idm-field">
                <label className="idm-label">Thời gian đề xuất :</label>
                <div className="idm-input-wrap">
                  <input
                    type="datetime-local"
                    className="idm-input"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                  <span className="idm-icon">📅</span>
                </div>
              </div>

              <div className="idm-field">
                <label className="idm-label">Người tham gia :</label>
                <div className="idm-input-wrap idm-input-wrap--readonly">
                  <span className="idm-readonly-text">
                    {candidate?.personal?.email || "—"}
                  </span>
                </div>
              </div>

              <div className="idm-field">
                <label className="idm-label">Địa điểm/ Link :</label>
                <div className="idm-input-wrap">
                  <input
                    type="text"
                    className="idm-input"
                    placeholder="https://meet.google.com/... hoặc địa chỉ văn phòng"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>

              <div className="idm-field">
                <label className="idm-label">Trạng Thái :</label>
                <div className="idm-input-wrap">
                  <select
                    className="idm-input"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="scheduled">Đã lên lịch</option>
                    <option value="completed">Hoàn tất</option>
                    <option value="cancelled">Hủy</option>
                    <option value="rescheduled">Lên lại</option>
                  </select>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* View Mode */}
              <div className="idm-field">
                <label className="idm-label">Thời gian đề xuất :</label>
                <div className="idm-input-wrap idm-input-wrap--readonly">
                  <span className="idm-readonly-text">
                    {schedule?.time ? formatDateTime(schedule.time) : "—"}
                  </span>
                </div>
              </div>

              <div className="idm-field">
                <label className="idm-label">Người tham gia :</label>
                <div className="idm-input-wrap idm-input-wrap--readonly">
                  <span className="idm-readonly-text">
                    {candidate?.personal?.email || "—"}
                  </span>
                </div>
              </div>

              <div className="idm-field">
                <label className="idm-label">Địa điểm/ Link :</label>
                <div className="idm-input-wrap idm-input-wrap--readonly">
                  <span className="idm-readonly-text">{schedule?.address || "—"}</span>
                </div>
              </div>

              <div className="idm-field">
                <label className="idm-label">Trạng Thái :</label>
                <div className="idm-input-wrap idm-input-wrap--readonly">
                  <span
                    className="idm-status-badge"
                    style={{
                      color:
                        schedule?.status === "completed"
                          ? "#10b981"
                          : schedule?.status === "cancelled"
                          ? "#ef4444"
                          : schedule?.status === "rescheduled"
                          ? "#f59e0b"
                          : "#3b82f6",
                    }}
                  >
                    {schedule?.status === "scheduled"
                      ? "Đã lên lịch"
                      : schedule?.status === "completed"
                      ? "Hoàn tất"
                      : schedule?.status === "cancelled"
                      ? "Hủy"
                      : "Lên lại"}
                  </span>
                </div>
              </div>

              <div className="idm-field">
                <label className="idm-label">Thời gian tạo :</label>
                <div className="idm-input-wrap idm-input-wrap--readonly">
                  <span className="idm-readonly-text">
                    {schedule?.createdAt ? formatDateTime(schedule.createdAt) : "—"}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="idm-footer">
          {isEditing ? (
            <>
              <button
                className="idm-btn idm-btn--cancel"
                onClick={() => setIsEditing(false)}
                disabled={loading}
              >
                Hủy
              </button>
              <button
                className="idm-btn idm-btn--save"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? "Đang lưu..." : "Lưu"}
              </button>
            </>
          ) : (
            <>
              <button className="idm-btn idm-btn--cancel" onClick={onClose}>
                Đóng
              </button>
              <button
                className="idm-btn idm-btn--edit"
                onClick={() => setIsEditing(true)}
              >
                ✏️ Chỉnh sửa
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewDetailModal;
