import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MdAdd, MdWork, MdDelete, MdCheckCircle, MdCancel, MdArrowBack, MdFormatBold, MdFormatItalic, MdFormatListBulleted, MdClose } from "react-icons/md";
import { toast } from "react-toastify";
import axios from "axios";
import jobService from "../../../services/client/jobService";
import "../../../styles/client/pages/jobManagement.css";

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("vi-VN");
};

// ─── SkillTag Input Component ────────────────────────────────────────────────
const TagInput = ({ tags, setTags }) => {
  const [inputVal, setInputVal] = useState("");

  const addTag = (e) => {
    if ((e.key === "Enter" || e.key === ",") && inputVal.trim()) {
      e.preventDefault();
      const newTag = inputVal.trim().replace(/,$/, "");
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setInputVal("");
    }
  };

  const removeTag = (tag) => setTags(tags.filter((t) => t !== tag));

  return (
    <div className="tag-input-wrap">
      {tags.map((tag) => (
        <span key={tag} className="tag-chip">
          {tag}
          <button type="button" onClick={() => removeTag(tag)}>
            <MdClose size={12} />
          </button>
        </span>
      ))}
      <input
        type="text"
        className="tag-input"
        placeholder={tags.length === 0 ? "VD: React, Node.js, Figma — nhấn Enter để thêm" : "Thêm kỹ năng..."}
        value={inputVal}
        onChange={(e) => setInputVal(e.target.value)}
        onKeyDown={addTag}
      />
    </div>
  );
};

// ─── Mock Rich Text Toolbar ──────────────────────────────────────────────────
const RichToolbar = ({ textareaRef }) => {
  const wrapSelection = (before, after = before) => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = el.value.slice(start, end);
    const newVal =
      el.value.slice(0, start) + before + selected + after + el.value.slice(end);
    const nativeInput = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype,
      "value"
    );
    nativeInput.set.call(el, newVal);
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.focus();
    el.selectionStart = start + before.length;
    el.selectionEnd = start + before.length + selected.length;
  };

  return (
    <div className="rte-toolbar">
      <button
        type="button"
        className="rte-btn"
        title="In đậm"
        onClick={() => wrapSelection("**")}
      >
        <MdFormatBold size={18} />
      </button>
      <button
        type="button"
        className="rte-btn"
        title="In nghiêng"
        onClick={() => wrapSelection("_")}
      >
        <MdFormatItalic size={18} />
      </button>
      <button
        type="button"
        className="rte-btn"
        title="Dấu gạch đầu dòng"
        onClick={() => wrapSelection("\n• ", "")}
      >
        <MdFormatListBulleted size={18} />
      </button>
      <div className="rte-divider" />
      <span className="rte-hint">Markdown supported</span>
    </div>
  );
};

// ─── Job List View ───────────────────────────────────────────────────────────
const JobListView = ({ onCreateClick, jobs, loading, search, setSearch, handleDelete, filteredJobs }) => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-column dashboard-column--left">
        <div className="job-page">
          {/* ── Header ── */}
          <div className="job-page__header">
            <div>
              <h1 className="job-page__title">Quản lý Công việc</h1>
              <p className="job-page__subtitle">
                Tạo và quản lý các vị trí tuyển dụng đang mở
              </p>
            </div>
            <button className="job-page__btn-create" onClick={onCreateClick}>
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
              <button className="job-page__btn-create" onClick={onCreateClick}>
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
      </div>
    </div>
  );
};

// ─── Job Create View ──────────────────────────────────────────────────────────
const JobCreateView = ({ onBackClick, onJobCreated }) => {
  const descRef = useRef(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: true,
  });
  const [tags, setTags] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error("Vui lòng nhập tiêu đề công việc!");
      return;
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      requirements: tags,
      status: form.status,
    };

    setSubmitting(true);
    try {
      const res = await jobService.create(payload);
      if (res.success) {
        toast.success("🎉 Tạo công việc thành công!");
        onJobCreated();
      } else {
        toast.error("❌ Tạo công việc thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi tạo Job:", error);
      toast.error("❌ Tạo công việc thất bại. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="job-create-page">
      {/* ── Back link ── */}
      <button type="button" className="job-create__back" onClick={onBackClick}>
        <MdArrowBack size={18} /> Quay lại danh sách
      </button>

      <div className="job-create__container">
        {/* ── Header ── */}
        <div className="job-create__head">
          <h1 className="job-create__title">✨ Tạo Công Việc Mới</h1>
          <p className="job-create__subtitle">
            Điền thông tin chi tiết để đăng vị trí tuyển dụng mới
          </p>
        </div>

        <form className="job-create__form" onSubmit={handleSubmit}>
          {/* ── Job Title ── */}
          <div className="form-field">
            <label className="form-label" htmlFor="title">
              Tên vị trí công việc <span className="required">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              className="form-input form-input--lg"
              placeholder="VD: Senior Frontend Developer"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* ── Job Description ── */}
          <div className="form-field">
            <label className="form-label" htmlFor="description">
              Mô tả công việc
            </label>
            <div className="rte-wrap">
              <RichToolbar textareaRef={descRef} />
              <textarea
                id="description"
                name="description"
                ref={descRef}
                className="form-textarea"
                placeholder="Mô tả chi tiết về công việc, trách nhiệm, môi trường làm việc..."
                value={form.description}
                onChange={handleChange}
                rows={10}
              />
            </div>
          </div>

          {/* ── Skills / Requirements ── */}
          <div className="form-field">
            <label className="form-label">
              Kỹ năng yêu cầu
            </label>
            <p className="form-hint">
              Nhập kỹ năng và nhấn <kbd>Enter</kbd> hoặc <kbd>,</kbd> để thêm tag
            </p>
            <TagInput tags={tags} setTags={setTags} />
          </div>

          {/* ── Status Toggle ── */}
          <div className="form-field form-field--row">
            <label className="form-label">Trạng thái tuyển dụng</label>
            <div className="status-toggle">
              <button
                type="button"
                className={`status-btn ${form.status ? "status-btn--active" : ""}`}
                onClick={() => setForm((p) => ({ ...p, status: true }))}
              >
                ✅ Đang mở
              </button>
              <button
                type="button"
                className={`status-btn ${!form.status ? "status-btn--inactive" : ""}`}
                onClick={() => setForm((p) => ({ ...p, status: false }))}
              >
                🔒 Đóng
              </button>
            </div>
          </div>

          {/* ── Action Buttons ── */}
          <div className="job-create__actions">
            <button type="button" className="btn-cancel" onClick={onBackClick}>
              Hủy
            </button>
            <button
              type="submit"
              className={`btn-submit ${submitting ? "btn-submit--loading" : ""}`}
              disabled={submitting}
            >
              {submitting ? "Đang tạo..." : "🚀 Tạo Công việc"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Main Dashboard Component ─────────────────────────────────────────────────
const Dashbroad = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [view, setView] = useState("list"); // "list" or "create"

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

  const handleJobCreated = () => {
    // Reset form and reload jobs
    setView("list");
    const fetchJobs = async () => {
      const response = await jobService.getAll();
      if (response.success && response.jobs) {
        setJobs(response.jobs);
      }
    };
    fetchJobs();
  };

  return view === "create" ? (
    <JobCreateView
      onBackClick={() => setView("list")}
      onJobCreated={handleJobCreated}
    />
  ) : (
    <JobListView
      onCreateClick={() => setView("create")}
      jobs={jobs}
      loading={loading}
      search={search}
      setSearch={setSearch}
      handleDelete={handleDelete}
      filteredJobs={filteredJobs}
    />
  );
};

export default Dashbroad;