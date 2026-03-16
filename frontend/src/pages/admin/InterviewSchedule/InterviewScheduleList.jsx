import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import interviewService from "../../../services/client/interviewService";
import candidateService from "../../../services/client/candidateService";
import InterviewDetailModal from "./InterviewDetailModal";
import "../../../styles/admin/pages/interviewScheduleList.css";

const InterviewScheduleList = () => {
  const [schedules, setSchedules] = useState([]);
  const [candidatesMap, setCandidatesMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Lấy danh sách lịch phỏng vấn
  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const res = await interviewService.getSchedules();
      if (res.success) {
        setSchedules(res.data || []);
        // Lấy thông tin ứng viên từ các lịch
        const candidateIds = [...new Set((res.data || []).map((s) => s.candidateId))];
        if (candidateIds.length > 0) {
          await fetchCandidates(candidateIds);
        }
      } else {
        toast.error(res.message || "Lỗi khi lấy danh sách lịch phỏng vấn");
      }
    } catch (err) {
      toast.error("Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  // Lấy thông tin ứng viên
  const fetchCandidates = async (candidateIds) => {
    try {
      const map = {};
      for (const id of candidateIds) {
        const res = await candidateService.getCandidateDetail(id);
        if (res.success && res.data) {
          map[id] = res.data;
        }
      }
      setCandidatesMap(map);
    } catch (err) {
      console.error("Lỗi khi lấy thông tin ứng viên:", err);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  // Xóa lịch phỏng vấn
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa lịch phỏng vấn này?")) return;

    try {
      const res = await interviewService.deleteSchedule(id);
      if (res.success) {
        toast.success("Xóa lịch phỏng vấn thành công");
        setSchedules(schedules.filter((s) => s.id !== id));
      } else {
        toast.error(res.message || "Xóa thất bại");
      }
    } catch (err) {
      toast.error("Lỗi khi xóa lịch phỏng vấn");
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      scheduled: { label: "Đã lên lịch", color: "#3b82f6" },
      completed: { label: "Hoàn tất", color: "#10b981" },
      cancelled: { label: "Hủy", color: "#ef4444" },
      rescheduled: { label: "Lên lại", color: "#f59e0b" },
    };
    const info = statusMap[status] || { label: status, color: "#6b7280" };
    return <span style={{ color: info.color, fontWeight: "500" }}>{info.label}</span>;
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN");
  };

  const getCandidateName = (candidateId) => {
    const candidate = candidatesMap[candidateId];
    return candidate?.personal?.fullName || "—";
  };

  return (
    <div className="interview-schedule-container">
      <div className="isl-header">
        <h1>📅 Quản Lý Lịch Phỏng Vấn</h1>
        <button className="isl-refresh-btn" onClick={fetchSchedules} disabled={loading}>
          {loading ? "Đang tải..." : "↻ Làm mới"}
        </button>
      </div>

      {schedules.length === 0 ? (
        <div className="isl-empty">
          <p>Không có lịch phỏng vấn nào</p>
        </div>
      ) : (
        <div className="isl-table-wrapper">
          <table className="isl-table">
            <thead>
              <tr>
                <th>Ứng Viên</th>
                <th>Thời Gian</th>
                <th>Địa Điểm/Link</th>
                <th>Trạng Thái</th>
                <th>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((schedule) => (
                <tr key={schedule.id}>
                  <td className="isl-candidate-name">{getCandidateName(schedule.candidateId)}</td>
                  <td>{formatDateTime(schedule.time)}</td>
                  <td className="isl-address">{schedule.address}</td>
                  <td>{getStatusBadge(schedule.status)}</td>
                  <td className="isl-actions">
                    <button
                      className="isl-btn isl-btn--detail"
                      onClick={() => {
                        setSelectedSchedule(schedule);
                        setShowDetailModal(true);
                      }}
                      title="Xem chi tiết"
                    >
                      👁️
                    </button>
                    <button
                      className="isl-btn isl-btn--delete"
                      onClick={() => handleDelete(schedule.id)}
                      title="Xóa"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Chi Tiết */}
      {showDetailModal && selectedSchedule && (
        <InterviewDetailModal
          schedule={selectedSchedule}
          candidate={candidatesMap[selectedSchedule.candidateId]}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedSchedule(null);
          }}
          onUpdate={() => {
            fetchSchedules();
            setShowDetailModal(false);
          }}
        />
      )}
    </div>
  );
};

export default InterviewScheduleList;
