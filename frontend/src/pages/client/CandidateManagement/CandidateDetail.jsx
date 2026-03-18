import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdSearch } from "react-icons/md";
import { toast } from "react-toastify";
import candidateService from "../../../services/client/candidateService";
import jobService from "../../../services/client/jobService";
import verificationService from "../../../services/client/verificationService";
import "../../../styles/client/pages/candidateDetail.css";

const CandidateDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifyingLoading, setVerifyingLoading] = useState(false);
  const [jobs, setJobs] = useState([]);

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [tempVerificationData, setTempVerificationData] = useState(null);

  useEffect(() => {
    fetchDetail();
    fetchJobs();
    // Force refetch every time component mounts to get latest status
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

  const fetchJobs = async () => {
    try {
      const res = await jobService.getAll();
      setJobs(res.jobs || []);
    } catch (error) {
      console.error("Lỗi khi tải danh sách job:", error);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("vi-VN");
  };

  const getJobTitle = (jobID) => {
    if (!jobID) return "—";
    const job = jobs.find((j) => j.id === jobID || j._id === jobID);
    return job ? job.title : "—";
  };

  const handleVerify = async (githubLink, candidateID) => {
    if (!githubLink) {
      toast.warning("Ứng viên này chưa có link GitHub!");
      return;
    }

    try {
      setVerifyingLoading(true);

      try {
        const checkRes = await verificationService.getVerificationDetail(candidateID);
        if (checkRes.success && checkRes.verification) {
          toast.info("Ứng viên đã được kiểm chứng.");
          setTimeout(() => {
            navigate(`/candidates/${candidateID}/verify`);
          }, 800);
          return;
        }
      } catch (checkError) {
        if (checkError.response?.status !== 404) {
          throw checkError; 
        }
        console.log("Chưa có dữ liệu kiểm chứng, bắt đầu quét mới...");
      }

      const extensionId = "jjkplkmkajifbfgiafkfgogihdoellof";

      if (!window.chrome?.runtime?.sendMessage) {
        toast.error(
          "Không tìm thấy Chrome Extension. Hãy đảm bảo extension đã được cài đặt!",
        );
        setVerifyingLoading(false);
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
          if (response && response.success) {
            console.log("Đã nhận dữ liệu xịn từ Extension:", response.data);
            const dataJson = JSON.parse(response.data);
            setTempVerificationData(dataJson);
            setShowSaveModal(true);
            setVerifyingLoading(false);
          } else {
            toast.error(
              "Lỗi xác thực: " +
                (response?.error || "Không kết nối được Extension"),
            );
            setVerifyingLoading(false);
          }
        },
      );
    } catch (error) {
      console.error("Lỗi khi chuẩn bị kiểm chứng:", error);
      toast.error("Có lỗi xảy ra khi kiểm tra trạng thái xác minh!");
      setVerifyingLoading(false);
    }
  };

  const handleConfirmSave = async () => {
    try {
      toast.info("Đang lưu kết quả phân tích AI...");

      const response = await verificationService.verifyCandidate(
        id,
        tempVerificationData,
      );

      if (response.success) {
        toast.success("Đã lưu kết quả thành công!");
        setShowSaveModal(false);

        // Chuyển hướng đến trang chi tiết kiểm chứng
        setTimeout(() => {
          navigate(`/candidates/${id}/verify`);
        }, 800);
      } else {
        toast.error(response.message || "Không thể lưu kết quả kiểm chứng!");
      }
    } catch (error) {
      console.error("Lỗi khi lưu kết quả kiểm chứng:", error);
      toast.error("Có lỗi xảy ra khi gọi API lưu dữ liệu!");
    }
  };

  if (loading) {
    return (
      <div className="cd-page">
        <div className="cd-loading">
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
    unverified: "Chưa kiểm chứng",
    verified: "Đã kiểm chứng",
    scheduled: "Đã lên lịch",
    risky: "Rủi ro",
  };
  const statusClasses = {
    unverified: "status-unanalyzed",
    verified: "status-verified",
    scheduled: "status-scheduled",
    risky: "status-risk",
  };
  const statusLabel = statusLabels[status] || status || "—";
  const statusClass = statusClasses[status] || "";
  const firstEdu = educations[0];
  const firstExp = experiences[0];

  return (
    <div className="cd-page">
      <button className="cd-back" onClick={() => navigate("/candidates")}>
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
            <MdSearch className="cd-field__icon" />
            <span className="cd-field__value">{personal.fullName || "—"}</span>
          </div>
        </div>

        {/* Email */}
        <div className="cd-field">
          <div className="cd-field__label">Email</div>
          <div className="cd-field__row">
            <MdSearch className="cd-field__icon" />
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
            <MdSearch className="cd-field__icon" />
            <span className="cd-field__value">{personal.phone || "—"}</span>
          </div>
        </div>

        {/* GitHub */}
        <div className="cd-field">
          <div className="cd-field__label">GitHub</div>
          <div className="cd-field__row">
            <MdSearch className="cd-field__icon" />
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
          <div className="cd-field__row">
            <MdSearch className="cd-field__icon" />
            <span className="cd-field__value">
              {(allSkills || []).join(", ") || "—"}
            </span>
          </div>
        </div>

        {/* Chức danh (Chọn JD) */}
        <div className="cd-field">
          <div className="cd-field__label">Chức danh (Chọn JD)</div>
          <div className="cd-field__row">
            <MdSearch className="cd-field__icon" />
            <span className="cd-field__value">
              {getJobTitle(candidate.jobID)}
            </span>
          </div>
        </div>

        {/* Học vấn */}
        <div className="cd-field">
          <div className="cd-field__label">Học vấn</div>
          <div className="cd-field__row">
            <MdSearch className="cd-field__icon" />
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
            <MdSearch className="cd-field__icon" />
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
              <MdSearch className="cd-field__icon" />
              <span className="cd-field__value">{objective}</span>
            </div>
          </div>
        )}

        {/* Trạng thái */}
        <div className="cd-field">
          <div className="cd-field__label">Trạng thái</div>
          <div className="cd-field__row">
            <MdSearch className="cd-field__icon" />
            <span className={`cd-field__value ${statusClass}`}>
              {statusLabel}
            </span>
          </div>
        </div>

        {/* Ngày lưu */}
        <div className="cd-field">
          <div className="cd-field__label">Ngày lưu</div>
          <div className="cd-field__row">
            <MdSearch className="cd-field__icon" />
            <span className="cd-field__value">{formatDate(createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="cd-actions">
        <button
          className="cd-btn cd-btn--cancel"
          onClick={() => navigate("/candidates")}
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
          onClick={() => navigate(`/candidates/${id}/schedule`)}
        >
          Lên lịch phỏng vấn
        </button>
        <button
          className="cd-btn cd-btn--verify"
          onClick={() => handleVerify(personal.githubLink, id)}
          disabled={verifyingLoading}
          style={verifyingLoading ? { opacity: 0.6, cursor: "wait" } : {}}
        >
          {verifyingLoading ? "⏳ Đang kiểm chứng..." : "✅ Kiểm chứng GitHub"}
        </button>
        <button
          className="cd-btn cd-btn--ai"
          onClick={() => navigate(`/candidates/${id}/ai-analysis`)}
        >
          🤖 Phân tích AI
        </button>
      </div>

      {/* Confirmation Modal */}
      {showSaveModal && (
        <div className="cd-modal-overlay">
          <div className="cd-modal">
            <span className="cd-modal__icon">✨</span>
            <h3>Hoàn tất phân tích AI</h3>
            <p>
              AI đã phân tích xong profile GitHub của{" "}
              <b>{tempVerificationData?.name || "ứng viên"}</b>. Bạn có muốn lưu
              kết quả và kiểm tra chi tiết không?
            </p>
            <div className="cd-modal__actions">
              <button
                className="cd-modal__btn cd-modal__btn--cancel"
                onClick={() => setShowSaveModal(false)}
              >
                Huỷ bỏ
              </button>
              <button
                className="cd-modal__btn cd-modal__btn--save"
                onClick={handleConfirmSave}
              >
                Lưu & Kiểm tra
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateDetail;
