import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdAdd, MdWork, MdDelete, MdEdit, MdCheckCircle, MdCancel } from "react-icons/md";
import "../../../styles/client/pages/jobManagement.css";

// ─── Mock data – replace with API call ──────────────────────────────────────
const MOCK_JOBS = [
  {
    id: "job_001",
    title: "Senior Frontend Developer",
    description: "Phát triển giao diện người dùng hiện đại bằng React.",
    requirements: ["React", "TypeScript", "CSS", "Figma"],
    status: true,
    createdAt: "2026-03-10T08:00:00Z",
  },
  {
    id: "job_002",
    title: "Backend Engineer (Node.js)",
    description: "Xây dựng RESTful API và microservices cho hệ thống HR.",
    requirements: ["Node.js", "MongoDB", "Express", "Docker"],
    status: true,
    createdAt: "2026-03-11T09:30:00Z",
  },
  {
    id: "job_003",
    title: "UI/UX Designer",
    description: "Thiết kế trải nghiệm người dùng trực quan và thẩm mỹ cao.",
    requirements: ["Figma", "Adobe XD", "User Research"],
    status: false,
    createdAt: "2026-03-12T14:00:00Z",
  },
];

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("vi-VN");
};

const JobManagement = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // TODO: Replace with real API call — jobService.getAll()
    // For now: merge built-in mock data with user-created jobs from localStorage
    setTimeout(() => {
      const saved = JSON.parse(localStorage.getItem("mock_jobs") || "[]");
      setJobs([...MOCK_JOBS, ...saved]);
      setLoading(false);
    }, 400);
  }, []);

  const filteredJobs = jobs.filter((j) =>
    j.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="job-page">
      {/* ── Header ── */}
      <div className="job-page__header">
        <div>
          <h1 className="job-page__title">Quản lý Công việc</h1>
          <p className="job-page__subtitle">
            Tạo và quản lý các vị trí tuyển dụng đang mở
          </p>
        </div>

        <button
          className="job-page__btn-create"
          onClick={() => navigate("/jobs/create")}
        >
          <MdAdd size={20} />
          Tạo Job mới
        </button>
      </div>

      {/* ── Search Bar ── */}
      <div className="job-page__search-wrap">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên công việc..."
          className="job-page__search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ── Job Cards ── */}
      {loading ? (
        <div className="job-page__loading">
          <div className="job-page__spinner" />
          Đang tải danh sách công việc...
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="job-page__empty">
          <MdWork size={48} />
          <p>Chưa có công việc nào. Hãy tạo Job đầu tiên!</p>
          <button
            className="job-page__btn-create"
            onClick={() => navigate("/jobs/create")}
          >
            <MdAdd size={18} /> Tạo Job mới
          </button>
        </div>
      ) : (
        <div className="job-page__grid">
          {filteredJobs.map((job) => (
            <div key={job.id} className="job-card">
              <div className="job-card__header">
                <div className="job-card__icon-wrap">
                  <MdWork size={22} />
                </div>
                <span
                  className={`job-card__badge ${
                    job.status ? "badge--open" : "badge--closed"
                  }`}
                >
                  {job.status ? (
                    <>
                      <MdCheckCircle size={13} /> Đang mở
                    </>
                  ) : (
                    <>
                      <MdCancel size={13} /> Đã đóng
                    </>
                  )}
                </span>
              </div>

              <h3 className="job-card__title">{job.title}</h3>
              <p className="job-card__desc">{job.description}</p>

              <div className="job-card__tags">
                {(job.requirements || []).map((tag) => (
                  <span key={tag} className="job-card__tag">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="job-card__footer">
                <span className="job-card__date">📅 {formatDate(job.createdAt)}</span>
                <div className="job-card__actions">
                  {/* Copy Job ID for use in Upload CV */}
                  <button
                    className="job-card__action-btn"
                    title="Copy Job ID"
                    onClick={() => {
                      navigator.clipboard.writeText(job.id);
                    }}
                  >
                    🔗 Copy ID
                  </button>
                  <button className="job-card__action-btn" title="Chỉnh sửa">
                    <MdEdit size={16} />
                  </button>
                  <button
                    className="job-card__action-btn job-card__action-btn--danger"
                    title="Xóa"
                  >
                    <MdDelete size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobManagement;
