import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import candidateService from "../../../services/client/candidateService";
import "../../../styles/client/pages/candidateDetail.css";

const CandidateDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await candidateService.getById(id);
      setCandidate(res.candidate || null);
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải thông tin ứng viên!");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("vi-VN");
  };

  const handleVerify = (githubLink, candidateID) => {
    if (!githubLink) {
      toast.warning("Ứng viên này chưa có link GitHub!");
      return;
    }

    const extensionId = import.meta.env.VITE_EXTENSION_ID;
    if (!extensionId) {
      toast.error("Chưa cấu hình VITE_EXTENSION_ID trong file .env!");
      return;
    }

    if (!window.chrome?.runtime?.sendMessage) {
      toast.error(
        "Không tìm thấy Chrome Extension. Hãy đảm bảo extension đã được cài đặt!",
      );
      return;
    }

    chrome.runtime.sendMessage(
      extensionId,
      {
        action: "NANO_START_TASK",
        url: githubLink,
        candidateID: candidateID,
      },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error("Extension error:", chrome.runtime.lastError.message);
          toast.error(
            "Không thể kết nối extension: " + chrome.runtime.lastError.message,
          );
          return;
        }
        if (response?.status === "processing") {
          toast.success("Đang kiểm chứng GitHub... Vui lòng chờ!");
        }
      },
    );

    // Note: tab management handled by extension
  };

  if (loading) {
    return (
      <div className="cd-page">
        <div className="cd-loading">
          <span style={{ fontSize: 28 }}>⏳</span>
          <span>Đang tải thông tin ứng viên...</span>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="cd-page">
        <div className="cd-error">
          <span style={{ fontSize: 28 }}>⚠️</span>
          <span>Không tìm thấy ứng viên!</span>
        </div>
      </div>
    );
  }

  const {
    personal = {},
    educations = [],
    experiences = [],
    allSkills = [],
    status,
    objective,
    createdAt,
  } = candidate;

  const statusLabels = {
    unanalyzed: "Chưa phân tích",
    analyzed: "Đã phân tích",
    scheduled: "Đã lên lịch",
    risky: "Rủi ro",
  };
  const statusClasses = {
    unanalyzed: "status-unanalyzed",
    analyzed: "status-verified",
    scheduled: "status-scheduled",
    risky: "status-risk",
  };
  const statusLabel = statusLabels[status] || status || "—";
  const statusClass = statusClasses[status] || "";
  const firstEdu = educations[0];
  const firstExp = experiences[0];

  return (
    <div className="cd-page">
      <button className="cd-back" onClick={() => navigate("/applications")}>
        ← Quay lại
      </button>

      <div className="cd-header">
        <h1>Chi tiết ứng viên</h1>
        <p>Thông tin chi tiết của ứng viên</p>
      </div>

      <div className="cd-card">
        {/* Họ tên */}
        <div className="cd-field">
          <div className="cd-field__label">Họ tên</div>
          <div className="cd-field__row">
            <span className="cd-field__icon">🔍</span>
            <span className="cd-field__value">{personal.fullName || "—"}</span>
          </div>
        </div>

        {/* Email */}
        <div className="cd-field">
          <div className="cd-field__label">Email</div>
          <div className="cd-field__row">
            <span className="cd-field__icon">🔍</span>
            <span className="cd-field__value">
              {personal.email ? (
                <a href={`mailto:${personal.email}`}>{personal.email}</a>
              ) : (
                "—"
              )}
            </span>
          </div>
        </div>

        {/* SĐT */}
        <div className="cd-field">
          <div className="cd-field__label">SĐT</div>
          <div className="cd-field__row">
            <span className="cd-field__icon">🔍</span>
            <span className="cd-field__value">{personal.phone || "—"}</span>
          </div>
        </div>

        {/* GitHub */}
        <div className="cd-field">
          <div className="cd-field__label">GitHub</div>
          <div className="cd-field__row">
            <span className="cd-field__icon">🔍</span>
            <span className="cd-field__value">
              {personal.githubLink ? (
                <a href={personal.githubLink} target="_blank" rel="noreferrer">
                  {personal.githubLink}
                </a>
              ) : (
                "—"
              )}
            </span>
          </div>
        </div>

        {/* Kỹ năng */}
        <div className="cd-field">
          <div className="cd-field__label">Kỹ năng</div>
          <div className="cd-field__row cd-field__row--skills">
            <span className="cd-field__icon">🔍</span>
            {allSkills.length > 0 ? (
              allSkills.map((s, i) => (
                <span className="cd-skill-badge" key={i}>
                  {s}
                </span>
              ))
            ) : (
              <span className="cd-field__value cd-field__value--empty">
                Chưa có
              </span>
            )}
          </div>
        </div>

        {/* Học vấn */}
        <div className="cd-field">
          <div className="cd-field__label">Học vấn</div>
          <div className="cd-field__row">
            <span className="cd-field__icon">🔍</span>
            <span className="cd-field__value">
              {firstEdu
                ? `${firstEdu.school || ""}${firstEdu.major ? ` — ${firstEdu.major}` : ""}${firstEdu.gpa ? ` (GPA: ${firstEdu.gpa})` : ""}`
                : "—"}
            </span>
          </div>
        </div>

        {/* Kinh nghiệm */}
        <div className="cd-field">
          <div className="cd-field__label">Kinh nghiệm</div>
          <div className="cd-field__row">
            <span className="cd-field__icon">🔍</span>
            <span className="cd-field__value">
              {firstExp
                ? `${firstExp.position || ""}${firstExp.company ? ` tại ${firstExp.company}` : ""}${firstExp.duration ? ` (${firstExp.duration})` : ""}`
                : "—"}
            </span>
          </div>
        </div>

        {/* Mục tiêu */}
        {objective && (
          <div className="cd-field">
            <div className="cd-field__label">Mục tiêu nghề nghiệp</div>
            <div className="cd-field__row">
              <span className="cd-field__icon">🔍</span>
              <span className="cd-field__value">{objective}</span>
            </div>
          </div>
        )}

        {/* Trạng thái */}
        <div className="cd-field">
          <div className="cd-field__label">Trạng thái</div>
          <div className="cd-field__row">
            <span className="cd-field__icon">🔍</span>
            <span className={`cd-field__value ${statusClass}`}>
              {statusLabel}
            </span>
          </div>
        </div>

        {/* Ngày lưu */}
        <div className="cd-field">
          <div className="cd-field__label">Ngày lưu</div>
          <div className="cd-field__row">
            <span className="cd-field__icon">🔍</span>
            <span className="cd-field__value">{formatDate(createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="cd-actions">
        <button
          className="cd-btn cd-btn--cancel"
          onClick={() => navigate("/applications")}
        >
          Huỷ
        </button>
        {personal.cvLink ? (
          <a
            href={personal.cvLink}
            target="_blank"
            rel="noreferrer"
            className="cd-btn cd-btn--cv"
          >
            Tải CV
          </a>
        ) : (
          <button
            className="cd-btn cd-btn--cv"
            disabled
            style={{ opacity: 0.5, cursor: "not-allowed" }}
          >
            Tải CV
          </button>
        )}
        <button
          className="cd-btn cd-btn--schedule"
          onClick={() => navigate(`/applications/${id}/lên lịch`)}
        >
          Lên lịch phỏng vấn
        </button>
        <button
          className="cd-btn cd-btn--verify"
          onClick={() => handleVerify(personal.githubLink, id)}
        >
          Kiểm chứng
        </button>
        <button
          className="cd-btn cd-btn--ai"
          onClick={() => navigate(`/applications/${id}/ai-analysis`)}
        >
          🤖 Phân tích AI
        </button>
      </div>
    </div>
  );
};

export default CandidateDetail;
