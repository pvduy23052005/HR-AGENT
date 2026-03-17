import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import verificationService from "../../services/client/verificationService";
import "../../styles/client/pages/verificationDetail.css";

const VerificationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [verification, setVerification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);

  useEffect(() => {
    fetchVerification();
  }, [id]);

  const fetchVerification = async () => {
    try {
      setLoading(true);
      const response = await verificationService.getVerificationDetail(id);
      if (response.success) {
        setVerification(response.verification);
      } else {
        toast.error(response.message || "Không thể tải dữ liệu kiểm chứng!");
        navigate(`/applications/${id}`);
      }
    } catch (error) {
      console.error("Error fetching verification:", error);
      toast.error("Không thể tải dữ liệu kiểm chứng!");
      navigate(`/applications/${id}`);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (status) => {
    setSelectedStatus(status);
    setConfirming(true);
    
    try {
      toast.info(
        `Đang xử lý: ${status === "trusted" ? "Xác nhận uy tín" : "Gắn cờ rủi ro"}...`,
      );

      // Gọi API để xác nhận status (trusted/risky)
      const response = await verificationService.confirmVerification(id, {
        status: status,
        verification: verification,
      });

      if (response.success) {
        if (status === "trusted") {
          toast.success("✅ Xác nhận uy tín thành công!");
        } else {
          toast.warning("⚠️ Đã gắn cờ rủi ro cho ứng viên này!");
        }

        setTimeout(() => {
          navigate(`/applications/${id}`);
        }, 1500);
      } else {
        toast.error(response.message || "Có lỗi xảy ra!");
      }
    } catch (error) {
      console.error("Error confirming verification:", error);
      toast.error(error.message || "Có lỗi xảy ra khi xác nhận!");
    } finally {
      setConfirming(false);
      setSelectedStatus(null);
    }
  };

  if (loading) {
    return (
      <div className="vd-page">
        <div className="vd-loading">
          <span style={{ fontSize: 28 }}>⏳</span>
          <span>Đang tải dữ liệu kiểm chứng...</span>
        </div>
      </div>
    );
  }

  if (!verification) {
    return (
      <div className="vd-page">
        <div className="vd-error">
          <span style={{ fontSize: 28 }}>⚠️</span>
          <span>Không tìm thấy dữ liệu kiểm chứng!</span>
        </div>
      </div>
    );
  }

  // Tính độ tin cây dựa trên GitHub stars
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
        onClick={() => navigate(`/applications/${id}`)}
      >
        ← Quay lại
      </button>

      <div className="vd-header">
        <h1>Kiểm chứng hộ số ứng viên</h1>
        <p>Xác nhận uy tín hoặc gắn cờ rủi ro dựa trên GitHub profile</p>
      </div>

      <div className="vd-card">
        {/* Họ tên */}
        <div className="vd-field">
          <label className="vd-label">Họ tên</label>
          <div className="vd-value">{verification.name || "—"}</div>
        </div>

        {/* Email */}
        <div className="vd-field">
          <label className="vd-label">Email</label>
          <div className="vd-value">{verification.email || "—"}</div>
        </div>

        {/* Độ tin cậy */}
        <div className="vd-field">
          <label className="vd-label">Độ tin cậy</label>
          <div className="vd-trust-score">
            <div className="vd-score-bar">
              <div
                className="vd-score-fill"
                style={{
                  width: `${trustScore}%`,
                  backgroundColor:
                    trustScore >= 75
                      ? "#10b981"
                      : trustScore >= 50
                        ? "#f59e0b"
                        : "#ef4444",
                }}
              ></div>
            </div>
            <span className="vd-score-text">{trustScore}%</span>
          </div>
          <p className="vd-score-reason">
            {trustScore >= 75
              ? "✅ Ứng viên có kỹ năng solid"
              : trustScore >= 50
                ? "⚠️ Ứng viên có kinh nghiệm nhưng chưa đủ nổi bật"
                : "❌ Ứng viên chưa có nhiều kinh nghiệm công khai"}
          </p>
        </div>

        {/* Chi tiết sai lịch */}
        <div className="vd-field">
          <label className="vd-label">Chi tiết sai lịch</label>
          <div className="vd-value">{verification.aiReasoning || "—"}</div>
        </div>

        {/* GitHub */}
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
              ⭐ {verification.githubStars} stars | 📚{" "}
              {verification.topLanguages?.length || 0} languages
            </span>
          </div>
        </div>

        {/* Ngôn ngữ chính */}
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

        {/* Top Projects */}
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
                        <span className="vd-stars">⭐ {project.stars}</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* LinkedIn */}
        {/* Placeholder nếu cần thêm LinkedIn sau */}
      </div>

      {/* Action buttons */}
      <div className="vd-actions">
        <button
          className="vd-btn vd-btn--cancel"
          onClick={() => navigate(`/applications/${id}`)}
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
          {selectedStatus === "risky" ? "⏳ Đang xử lý..." : "🚩 Gắn cờ rủi ro"}
        </button>
        <button
          className="vd-btn vd-btn--trusted"
          onClick={() => handleConfirm("trusted")}
          disabled={confirming || selectedStatus === "trusted"}
          style={
            selectedStatus === "trusted" ? { opacity: 0.6, cursor: "wait" } : {}
          }
        >
          {selectedStatus === "trusted"
            ? "⏳ Đang xử lý..."
            : "✅ Xác nhận uy tín"}
        </button>
      </div>
    </div>
  );
};

export default VerificationDetail;
