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
  const [selectedJobId, setSelectedJobId] = useState("");

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [tempVerificationData, setTempVerificationData] = useState(null);

  useEffect(() => {
    fetchDetail();
    fetchJobs();
  }, [id]);

  useEffect(() => {
    if (candidate?.jobID) {
      setSelectedJobId(candidate.jobID);
    }
  }, [candidate]);

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

  const handleJobChange = (e) => {
    const jobId = e.target.value;
    setSelectedJobId(jobId);
    console.log("Job được chọn:", jobId, jobs.find((j) => (j.id === jobId || j._id === jobId)));
    // TODO: Sẽ gửi API cùng với phân tích AI sau
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

      const extensionId = "bbebdnbhjphhndgmipcaljcpeoppmaik";

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
            const dataJson = JSON.parse(response.data);
            console.log(dataJson);
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
      toast.info("Đang lưu kết quả kiểm chứng GitHub...");

      // Bước 1: Lưu dữ liệu xác minh từ GitHub
      const response = await verificationService.verifyCandidate(
        id,
        tempVerificationData,
      );

      if (response.success) {
        toast.success("Đã lưu kết quả kiểm chứng!");
        setShowSaveModal(false);

        // Bước 2: Xác nhận và chuyển trường từ Ứng tuyển → Sàng lọc
        try {
          const confirmRes = await verificationService.confirmVerification(id, {
            status: 'verified', // Kiểm chứng thành công
          });
          
          if (confirmRes.success) {
            toast.success("Ứng viên đã kiểm chứng thành công!");
            // Reload dữ liệu candidate để cập nhật status
            await fetchDetail();
            setTimeout(() => {
              navigate(`/candidates/${id}/verify`);
            }, 800);
          }
        } catch (confirmError) {
          console.error("Lỗi khi xác nhận verification:", confirmError);
          toast.warning("Đã lưu kiểm chứng nhưng chưa cập nhật trường. Vui lòng tải lại!");
          await fetchDetail();
          setTimeout(() => {
            navigate(`/candidates/${id}/verify`);
          }, 1000);
        }
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

  // Recruitment Status Labels
  const recruitmentStatusLabels = {
    applied: "Ứng tuyển",
    screening: "Sàng lọc",
    interview: "Phỏng vấn",
    offer: "Đề nghị",
  };
  const recruitmentStatusClasses = {
    applied: "status-applied",
    screening: "status-screening",
    interview: "status-interview",
    offer: "status-offer",
  };

  // Verification Status Labels
  const verificationStatusLabels = {
    unverified: "Chưa kiểm chứng",
    verified: "Đã kiểm chứng ✅",
    risky: "Rủi ro ⚠️",
  };
  const verificationStatusClasses = {
    unverified: "status-unanalyzed",
    verified: "status-verified",
    risky: "status-risk",
  };

  const recruitmentLabel = recruitmentStatusLabels[status] || status || "—";
  const recruitmentClass = recruitmentStatusClasses[status] || "";
  const verificationLabel = verificationStatusLabels[candidate.verificationStatus] || candidate.verificationStatus || "—";
  const verificationClass = verificationStatusClasses[candidate.verificationStatus] || "";
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
       
        <div className="cd-field">
          <div className="cd-field__label">Họ tên</div>
          <div className="cd-field__row">
            <MdSearch className="cd-field__icon" />
            <span className="cd-field__value">{personal.fullName || "—"}</span>
          </div>
        </div>

   
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

     
        <div className="cd-field">
          <div className="cd-field__label">SĐT</div>
          <div className="cd-field__row">
            <MdSearch className="cd-field__icon" />
            <span className="cd-field__value">{personal.phone || "—"}</span>
          </div>
        </div>

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

    
        <div className="cd-field">
          <div className="cd-field__label">Kỹ năng</div>
          <div className="cd-field__row">
            <MdSearch className="cd-field__icon" />
            <span className="cd-field__value">
              {(allSkills || []).join(", ") || "—"}
            </span>
          </div>
        </div>

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

        {objective && (
          <div className="cd-field">
            <div className="cd-field__label">Mục tiêu nghề nghiệp</div>
            <div className="cd-field__row">
              <MdSearch className="cd-field__icon" />
              <span className="cd-field__value">{objective}</span>
            </div>
          </div>
        )}

  
        <div className="cd-field">
          <div className="cd-field__label">Quy Trình Tuyển Dụng</div>
          <div className="cd-field__row">
            <MdSearch className="cd-field__icon" />
            <span className={`cd-field__value ${recruitmentClass}`}>
              {recruitmentLabel}
            </span>
          </div>
        </div>

        <div className="cd-field">
          <div className="cd-field__label">Kiểm Chứng GitHub</div>
          <div className="cd-field__row">
            <MdSearch className="cd-field__icon" />
            <span className={`cd-field__value ${verificationClass}`}>
              {verificationLabel}
            </span>
          </div>
        </div>

        {/* Side by side: Date saved and Job selection */}
        <div className="cd-fields-row">
          <div className="cd-field">
            <div className="cd-field__label">Ngày lưu</div>
            <div className="cd-field__row">
              <MdSearch className="cd-field__icon" />
              <span className="cd-field__value">{formatDate(createdAt)}</span>
            </div>
          </div>

          <div className="cd-field">
            <div className="cd-field__label">Chức danh (Chọn JD)</div>
            <div className="cd-field__row">
              <select
                value={selectedJobId}
                onChange={handleJobChange}
                style={{
                  padding: "8px 12px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px",
                  fontFamily: "inherit",
                  backgroundColor: "#fff",
                  cursor: "pointer",
                  width: "100%"
                }}
              >
                <option value="">-- Chọn vị trí công việc --</option>
                {jobs.map((job) => (
                  <option key={job.id || job._id} value={job.id || job._id}>
                    {job.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

   
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
          {verifyingLoading ? "Đang kiểm chứng..." : "Kiểm chứng "}
        </button>
        <button
          className="cd-btn cd-btn--ai"
          onClick={() => {
            if (!selectedJobId) {
              toast.warning("Vui lòng chọn vị trí công việc trước khi phân tích!");
              return;
            }
            navigate(`/candidates/${id}/ai-analysis?jobId=${selectedJobId}`);
          }}
        >
          Phân tích AI
        </button>
      </div>

     
      {showSaveModal && (
        <div className="cd-modal-overlay">
          <div className="cd-modal">
            <h3>Hoàn tất phân tích AI</h3>
            <p>
              AI đã phân tích xong profile của{" "}
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
