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
      });

      if (res.success) {
        toast.success("Đặt lịch và gửi lời mời phỏng vấn thành công!");
        setTimeout(() => {
          navigate(`/candidates/${id}`);
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

      <div className="sip-header">
        <h1 className="sip-header__title">Tạo lịch phỏng vấn</h1>
      </div>

      <div className="sip-container">
        <div className="sip-card sip-form-card">
          <h1 className="sip-form-title">
            Phỏng vấn: {candidate?.personal?.fullName}
          </h1>

          <form onSubmit={handleSubmit} className="sip-form">
            {/* Thời gian */}
            <div className="sip-form-group">
              <label htmlFor="time" className="sip-form-label">
                Thời gian đề xuất:
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
              </div>
            </div>

            {/* Người tham gia */}
            <div className="sip-form-group">
              <label className="sip-form-label">Người tham gia:</label>
              <div className="sip-form-input-wrap sip-form-input-wrap--readonly">
                <span className="sip-form-readonly">
                  {candidate?.personal?.email || "—"}
                </span>
              </div>
            </div>

            {/* Địa điểm / Link */}
            <div className="sip-form-group">
              <label htmlFor="address" className="sip-form-label">
                Địa điểm/ Link:
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
                {loading ? "Đang gửi..." : "Gửi lời mời"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ScheduleInterviewPage;
