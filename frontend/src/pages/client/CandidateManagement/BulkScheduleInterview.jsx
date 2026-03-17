import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import interviewService from "../../../services/client/interviewService";
import candidateService from "../../../services/client/candidateService";
import "../../../styles/client/pages/bulkScheduleInterview.css";

const BulkScheduleInterview = () => {
  const navigate = useNavigate();
  
  const [selectedCandidateIds, setSelectedCandidateIds] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [time, setTime] = useState("");
  const [address, setAddress] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Lấy danh sách candidates từ sessionStorage
      const stored = sessionStorage.getItem("selectedCandidates");
      if (!stored) {
        toast.warning("Không có ứng viên được chọn!");
        navigate("/candidates");
        return;
      }

      const ids = JSON.parse(stored);
      setSelectedCandidateIds(ids);

      // Fetch chi tiết candidates
      const res = await candidateService.getAll();
      if (res.candidates) {
        const selected = res.candidates.filter((c) => ids.includes(c.id));
        setCandidates(selected);
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi tải dữ liệu!");
      navigate("/candidates");
    } finally {
      setPageLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!time) {
      toast.warning("Vui lòng chọn thời gian!");
      return;
    }
    if (!address.trim()) {
      toast.warning("Vui lòng nhập địa điểm / link!");
      return;
    }

    if (selectedCandidateIds.length === 0) {
      toast.warning("Không có ứng viên nào!");
      return;
    }

    try {
      setLoading(true);

      // Chuẩn bị data cho bulk schedule
      const interviews = selectedCandidateIds.map((candidateId, index) => {
        // Mỗi ứng viên cách nhau 1 giờ (hoặc time dự định)
        const baseTime = new Date(time);
        const scheduledTime = new Date(baseTime.getTime() + index * 60 * 60 * 1000);

        return {
          candidateID: candidateId,
          jobID: "", // Nếu cần, lấy từ candidate.jobID hoặc để trống
          time: scheduledTime.toISOString(),
          address,
          durationMinutes: Number(durationMinutes),
          notes,
        };
      });

      // Lấy jobID từ first candidate nếu cần
      if (candidates.length > 0 && candidates[0].jobID) {
        interviews.forEach((int) => {
          int.jobID = candidates[0].jobID;
        });
      }

      const res = await interviewService.scheduleBulk({ interviews });

      if (res.success) {
        const { successCount, failureCount } = res;
        toast.success(
          `✅ Thành công: ${successCount} ứng viên. Lỗi: ${failureCount}`
        );

        // Clear sessionStorage
        sessionStorage.removeItem("selectedCandidates");

        // Redirect về candidates sau 1.5s
        setTimeout(() => {
          navigate("/candidates");
        }, 1500);
      } else {
        toast.error(res.message || "Lên lịch thất bại!");
      }
    } catch (error) {
      const msg = error?.response?.data?.message || "Lỗi khi lên lịch!";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return <div className="bsi-loading">Đang tải...</div>;
  }

  return (
    <div className="bulk-schedule-interview-page">
      <button className="bsi-back-btn" onClick={() => navigate(-1)}>
        ← Quay lại
      </button>

      <div className="bsi-container">
        {/* Left Side - Candidate List */}
        <div className="bsi-left">
          <div className="bsi-card bsi-candidates-list">
            <h2 className="bsi-card-title">
              👥 Danh Sách Ứng Viên ({candidates.length})
            </h2>
            <div className="bsi-candidates">
              {candidates.length === 0 ? (
                <p className="bsi-no-candidates">Không có ứng viên nào</p>
              ) : (
                candidates.map((candidate) => (
                  <div key={candidate.id} className="bsi-candidate-item">
                    <div className="bsi-candidate-info">
                      <span className="bsi-candidate-name">
                        {candidate.personal?.fullName || candidate.fullName || "—"}
                      </span>
                      <span className="bsi-candidate-email">
                        {candidate.personal?.email || candidate.email || "—"}
                      </span>
                    </div>
                    <span className="bsi-candidate-status">
                      {candidate.status || "—"}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bsi-card bsi-tips">
            <h3 className="bsi-card-title">💡 Gợi Ý</h3>
            <ul className="bsi-tips-list">
              <li>Các ứng viên sẽ được lên lịch cách nhau 1 giờ</li>
              <li>Mỗi ứng viên sẽ nhận email mời riêng</li>
              <li>Calendar event sẽ được gửi tự động</li>
              <li>Có thể edit chi tiết sau khi lên lịch</li>
            </ul>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="bsi-right">
          <div className="bsi-card bsi-form-card">
            <h1 className="bsi-form-title">
              📅 Lên Lịch Phỏng Vấn Hàng Loạt
            </h1>

            <form onSubmit={handleSubmit} className="bsi-form">
              {/* Thời gian */}
              <div className="bsi-form-group">
                <label htmlFor="time" className="bsi-form-label">
                  Thời gian bắt đầu <span className="bsi-required">*</span>
                </label>
                <div className="bsi-form-input-wrap">
                  <input
                    id="time"
                    type="datetime-local"
                    className="bsi-form-input"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  />
                  <span className="bsi-form-icon">📅</span>
                </div>
                <small className="bsi-form-hint">
                  Ứng viên tiếp theo sẽ cách 1 giờ
                </small>
              </div>

              {/* Thời lượng */}
              <div className="bsi-form-group">
                <label htmlFor="duration" className="bsi-form-label">
                  Thời lượng mỗi phỏng vấn
                </label>
                <div className="bsi-form-input-wrap">
                  <select
                    id="duration"
                    className="bsi-form-input"
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

              {/* Địa điểm / Link */}
              <div className="bsi-form-group">
                <label htmlFor="address" className="bsi-form-label">
                  Địa điểm / Link <span className="bsi-required">*</span>
                </label>
                <div className="bsi-form-input-wrap">
                  <input
                    id="address"
                    type="text"
                    className="bsi-form-input"
                    placeholder="https://meet.google.com/... hoặc địa chỉ"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                  <span className="bsi-form-icon">🔗</span>
                </div>
              </div>

              {/* Ghi chú */}
              <div className="bsi-form-group">
                <label htmlFor="notes" className="bsi-form-label">
                  Ghi chú (tuỳ chọn)
                </label>
                <div className="bsi-form-input-wrap">
                  <textarea
                    id="notes"
                    className="bsi-form-input bsi-form-textarea"
                    placeholder="VD: Vòng 1 - Technical, chuẩn bị laptop..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="bsi-form-actions">
                <button
                  type="button"
                  className="bsi-btn bsi-btn--cancel"
                  onClick={() => navigate(-1)}
                  disabled={loading}
                >
                  Huỷ
                </button>
                <button
                  type="submit"
                  className="bsi-btn bsi-btn--submit"
                  disabled={loading}
                >
                  {loading ? "Đang gửi..." : `✉️ Gửi cho ${candidates.length} ứng viên`}
                </button>
              </div>
            </form>

            <div className="bsi-form-note">
              <p>
                ✓ Mỗi ứng viên sẽ nhận email mời riêng với thời gian lịch cách
                nhau
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkScheduleInterview;
