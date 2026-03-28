import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import jobService from "../../../services/client/jobService";
import "../../../styles/client/pages/jobCandidates.css";

const JobCandidates = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        const res = await jobService.getCandidatesByJob(id);
        if (res.candidates) {
          setCandidates(res.candidates);
        } else if (res.success && res.data?.candidates) {
          setCandidates(res.data.candidates);
        } else if (res.success && res.candidates) {
          setCandidates(res.candidates);
        } else {
          setCandidates(res.data || []);
        }
      } catch (error) {
        console.error("Lỗi tải danh sách ứng viên:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchCandidates();
  }, [id]);

  const getScoreColor = (score) => {
    if (score == null) return "score--gray";
    if (score >= 80) return "score--high";
    if (score >= 50) return "score--medium";
    return "score--low";
  };

  return (
    <div className="jc-page">
      <div className="jc-header">
        <button className="jc-back-btn" onClick={() => navigate("/jobs")}>
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Quay lại danh sách công việc
        </button>
        <h1 className="jc-title">Danh sách ứng viên</h1>
        <p className="jc-subtitle">Ứng viên đã nộp hồ sơ cho vị trí này</p>
      </div>

      <div className="jc-content">
        {loading ? (
          <div className="jc-loading">
            <div className="jc-spinner"></div>
            <span>Đang tải thông tin ứng viên...</span>
          </div>
        ) : candidates.length > 0 ? (
          <div className="jc-grid">
            {candidates.map((cand) => (
              <div key={cand.id || cand._id} className="jc-card">
                <div className="jc-card__top">
                  <div className="jc-card__avatar">
                    {cand.personal?.avatar ? (
                      <img src={cand.personal.avatar} alt="Avatar" />
                    ) : (
                      <span>{cand.personal?.fullName?.charAt(0) || "U"}</span>
                    )}
                  </div>
                  <div className="jc-card__info">
                    <h3 className="jc-card__name">
                      {cand.personal?.fullName || "Chưa cập nhật tên"}
                    </h3>
                    <div className="jc-card__contact">
                      <span title="Email">{cand.personal?.email || "--"}</span>
                      <span title="Phone">{cand.personal?.phone || "--"}</span>
                    </div>
                  </div>
                  <div
                    className={`jc-card__score ${getScoreColor(cand.matchingScore)}`}
                  >
                    {cand.matchingScore != null ? (
                      <>
                        <span className="score-value">
                          {cand.matchingScore}
                        </span>
                        <span className="score-label">Phù hợp</span>
                      </>
                    ) : (
                      <span className="score-value" style={{ fontSize: '0.9rem', marginBottom: 0, padding: '0 4px', textAlign: 'center' }}>
                        Chưa phân tích
                      </span>
                    )}
                  </div>
                </div>

                <div className="jc-card__actions">
                  <button
                    onClick={() =>
                      navigate(`/candidates/${cand.id || cand._id}`)
                    }
                    className="jc-btn jc-btn--primary"
                  >
                    Xem chi tiết
                  </button>
                  {cand.personal?.githubLink ? (
                    <a
                      href={cand.personal.githubLink}
                      target="_blank"
                      rel="noreferrer"
                      className="jc-btn jc-btn--secondary"
                    >
                      GitHub
                    </a>
                  ) : (
                    <button className="jc-btn jc-btn--disabled" disabled>
                      Không GitHub
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="jc-empty">
            <h3>Chưa có ứng viên nào</h3>
            <p>Vị trí này hiện tại chưa có hồ sơ ứng tuyển.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobCandidates;
