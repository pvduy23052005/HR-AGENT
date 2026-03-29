import React, { useState, useRef } from "react";
import { toast } from "react-toastify";
import jobService from "../../../services/client/jobService";
import TagInput from "./TagInput";
import RichToolbar from "./RichToolbar";

/**
 * JobCreateModal Component
 * Modal form to create a new job position.
 */
const JobCreateModal = ({ onClose, onJobCreated }) => {
  const descRef = useRef(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: true,
  });
  const [tags, setTags] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
      if (res.success || res.data) {
        toast.success("Tạo công việc mới thành công!");
        onJobCreated();
        onClose();
      } else {
        toast.error("Không thể tạo công việc. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi tạo Job:", error);
      toast.error("Đã xảy ra lỗi khi tạo công việc.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="job-modal-overlay">
      <div className="job-modal job-modal--create">
        <div className="job-modal__header">
          <h2>Tạo Công Việc Mới</h2>
          <button className="job-modal__close" onClick={onClose} title="Đóng">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form className="job-modal__body custom-scrollbar" onSubmit={handleSubmit}>
          {/* Job Title */}
          <div className="form-field">
            <label className="form-label" htmlFor="title">
              Tiêu đề công việc <span className="required">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              className="form-input form-input--lg"
              placeholder="VD: Senior Frontend Developer (React)"
              value={form.title}
              onChange={handleChange}
              required
              autoFocus
            />
          </div>

          {/* Job Description */}
          <div className="form-field">
            <label className="form-label" htmlFor="description">
              Mô tả chi tiết
            </label>
            <div className="rte-wrap">
              <RichToolbar textareaRef={descRef} />
              <textarea
                id="description"
                name="description"
                ref={descRef}
                className="form-textarea"
                placeholder="Mô tả trách nhiệm, quyền lợi và môi trường làm việc..."
                value={form.description}
                onChange={handleChange}
                rows={8}
              />
            </div>
          </div>

          {/* Skills / Requirements */}
          <div className="form-field">
            <label className="form-label">Yêu cầu kỹ năng</label>
            <p className="form-hint">Nhấn Enter hoặc dấu phẩy để thêm kỹ năng</p>
            <TagInput tags={tags} setTags={setTags} />
          </div>

          {/* Status Toggle */}
          <div className="form-field form-field--row">
            <label className="form-label">Trạng thái ban đầu</label>
            <div className="status-toggle">
              <button
                type="button"
                className={`status-btn ${form.status ? "status-btn--active" : ""}`}
                onClick={() => setForm((p) => ({ ...p, status: true }))}
              >
                Đang mở
              </button>
              <button
                type="button"
                className={`status-btn ${!form.status ? "status-btn--inactive" : ""}`}
                onClick={() => setForm((p) => ({ ...p, status: false }))}
              >
                Đóng
              </button>
            </div>
          </div>
        </form>

        <div className="job-modal__footer">
          <button type="button" className="btn-cancel" onClick={onClose} disabled={submitting}>
            Hủy bỏ
          </button>
          <button
            type="submit"
            className={`job-modal__btn-close ${submitting ? "loading" : ""}`}
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Đang tạo..." : "Tạo Công việc"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCreateModal;
