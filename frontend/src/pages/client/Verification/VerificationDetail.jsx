import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import verificationService from "../../../services/client/verificationService";
import candidateService from "../../../services/client/candidateService";
import "../../../styles/client/pages/verificationDetail.css";

const VerificationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [verification, setVerification] = useState(null);
  const [candidateStatus, setCandidateStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);

  useEffect(() => {
    fetchVerification();
    fetchCandidate();
  }, [id]);

  const fetchCandidate = async () => {
    try {
      const res = await candidateService.getById(id);
      if (res.candidate) {
        setCandidateStatus(res.candidate.status);
      }
    } catch (error) {
      console.error("Error fetching candidate:", error);
    }
  };

  const fetchVerification = async () => {
    try {
      setLoading(true);
      const response = await verificationService.getVerificationDetail(id);
      if (response.success) {
        setVerification(response.verification);
      } else {
        toast.error(response.message || "Không thể tải dữ liệu kiểm chứng!");
        navigate(`/candidates/${id}`);
      }
    } catch (error) {
      console.error("Error fetching verification:", error);
      toast.error("Không thể tải dữ liệu kiểm chứng!");
      navigate(`/candidates/${id}`);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (status) => {
    // Allow verification at both APPLIED and SCREENING stages
    if (candidateStatus !== "screening" && candidateStatus !== "applied") {
      toast.warning("Ứng viên chỉ có thể kiểm chứng ở giai đoạn Ứng tuyển hoặc Sàng lọc!");
      return;
    }

    setSelectedStatus(status);
    setConfirming(true);
    
    try {
      const message = status === "verified" ? "Kiểm chứng ứng viên..." : "Gắn cờ rủi ro...";
      toast.info(message);

     
      const response = await verificationService.confirmVerification(id, {
        status: status,
      });

      if (response.success) {
        if (status === "verified") {
          toast.success("Kiểm chứng thành công!");
        } else {
          toast.warning("Đã gắn cờ rủi ro cho ứng viên này!");
        }

        setTimeout(() => {
          navigate(`/candidates/${id}`);
        }, 1500);
      } else {
        toast.error(response.message || "Có lỗi xảy ra!");
      }
    } catch (error) {
      console.error("Error confirming verification:", error);
      toast.error(error.message || "Có lỗi xảy ra khi kiểm chứng!");
    } finally {
      setConfirming(false);
      setSelectedStatus(null);
    }
  };

  if (loading) {
    return (
      <div className="vd-page">
        <div className="vd-loading">
          <span>Đang tải dữ liệu kiểm chứng...</span>
        </div>
      </div>
    );
  }

  if (!verification) {
    return (
      <div className="vd-page">
        <div className="vd-error">
          <span>Không tìm thấy dữ liệu kiểm chứng!</span>
        </div>
      </div>
    );
  }

  const calculateTrustScore = (stars) => {
    if (stars > 100) return 90;
    if (stars > 50) return 75;
    if (stars > 10) return 60;
    if (stars > 0) return 40;
    return 20;
  };

  const trustScore = calculateTrustScore(verification.githubStars);

  return (
    <div className="vd-page">
      <button
        className="vd-back"
        onClick={() => navigate(`/candidates/${id}`)}
      >
        ← Quay lại
      </button>

      <div className="vd-header">
        <h1>Kiểm chứng ứng viên</h1>
        <p>Xem chi tiết kiểm chứng từ GitHub</p>
      </div>

      <div className="vd-card">
     
        <div className="vd-field">
          <label className="vd-label">Họ tên</label>
          <div className="vd-value">{verification.name || "—"}</div>
        </div>

        <div className="vd-field">
          <label className="vd-label">Email</label>
          <div className="vd-value">{verification.email || "—"}</div>
        </div>

       
        <div className="vd-field">
          <label className="vd-label">Độ tin cậy</label>
          <div className="vd-value">
            {trustScore}%
            <span style={{ marginLeft: "12px", fontSize: "14px", color: "#666" }}>
              {trustScore >= 75
                ? "(Ứng viên có kỹ năng solid)"
                : trustScore >= 50
                  ? "(Ứng viên có kinh nghiệm nhưng chưa đủ nổi bật)"
                  : "(Ứng viên chưa có nhiều kinh nghiệm công khai)"}
            </span>
          </div>
        </div>

    
        <div className="vd-field">
          <label className="vd-label">Chi tiết phân tích</label>
          <div className="vd-value">{verification.aiReasoning || "—"}</div>
        </div>

    
        <div className="vd-field">
          <label className="vd-label">GitHub</label>
          <div className="vd-links">
            <a
              href={`https://github.com/${verification.name}`}
              target="_blank"
              rel="noreferrer"
            >
              github.com/{verification.name}
            </a>
            <span className="vd-stats">
              Stars: {verification.githubStars} | Languages: {verification.topLanguages?.length || 0}
            </span>
          </div>
        </div>

        {verification.topLanguages && verification.topLanguages.length > 0 && (
          <div className="vd-field">
            <label className="vd-label">Ngôn ngữ chính</label>
            <div className="vd-langs">
              {verification.topLanguages.map((lang, i) => (
                <span key={i} className="vd-lang-badge">
                  {lang}
                </span>
              ))}
            </div>
          </div>
        )}

        {verification.probedProjects &&
          verification.probedProjects.length > 0 && (
            <div className="vd-field">
              <label className="vd-label">Dự án nổi bật</label>
              <div className="vd-projects">
                {verification.probedProjects.slice(0, 5).map((project, i) => (
                  <div key={i} className="vd-project-item">
                    <a href={project.url} target="_blank" rel="noreferrer">
                      {project.name}
                    </a>
                    <span className="vd-project-meta">
                      {project.language && (
                        <span className="vd-lang">{project.language}</span>
                      )}
                      {project.stars > 0 && (
                        <span className="vd-stars">Stars: {project.stars}</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

      </div>

      <div className="vd-actions">
        <button
          className="vd-btn vd-btn--cancel"
          onClick={() => navigate(`/candidates/${id}`)}
          disabled={confirming}
        >
          Huỷ
        </button>
        <button
          className="vd-btn vd-btn--risky"
          onClick={() => handleConfirm("risky")}
          disabled={confirming || selectedStatus === "risky"}
          style={
            selectedStatus === "risky" ? { opacity: 0.6, cursor: "wait" } : {}
          }
        >
          {selectedStatus === "risky" ? "Đang xử lý..." : "Gắn cờ rủi ro"}
        </button>
        <button
          className="vd-btn vd-btn--trusted"
          onClick={() => handleConfirm("verified")}
          disabled={confirming || selectedStatus === "verified"}
          style={
            selectedStatus === "verified" ? { opacity: 0.6, cursor: "wait" } : {}
          }
        >
          {selectedStatus === "verified"
            ? "Đang xử lý..."
            : "Đã kiểm chứng"}
        </button>
      </div>
    </div>
  );
};

export default VerificationDetail;
