import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdAdd, MdWork, MdDelete, MdCheckCircle, MdCancel } from "react-icons/md";
import { toast } from "react-toastify";
import jobService from "../../../services/client/jobService";
import "../../../styles/client/pages/jobManagement.css";

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
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await jobService.getAll();
        if (response.success && response.jobs) {
          setJobs(response.jobs);
        } else {
          setJobs([]);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách công việc:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // ── Delete Handler ────────────────────────────────────────────────────────
  const handleDelete = async (jobId) => {
    const confirmed = window.confirm(
      "Bạn có chắc chắn muốn xóa công việc này không?"
    );
    if (!confirmed) return;

    try {
      const res = await jobService.delete(jobId);
      if (res.success) {
        setJobs((prev) => prev.filter((j) => (j._id || j.id) !== jobId));
        toast.success("Xóa công việc thành công!");
      } else {
        toast.error("Xóa công việc thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi khi xóa công việc:", error);
      toast.error("Xóa công việc thất bại. Vui lòng thử lại.");
    }
  };

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
            <div key={job.id || job._id} className="job-card">
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
                  <button
                    className="job-card__action-btn job-card__action-btn--delete"
                    title="Xóa công việc"
                    onClick={() => handleDelete(job._id || job.id)}
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
