import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  MdFormatBold,
  MdFormatItalic,
  MdFormatListBulleted,
  MdClose,
  MdArrowBack,
} from "react-icons/md";
import jobService from "../../../services/client/jobService";
import "../../../styles/client/pages/jobManagement.css";

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
    // React controlled workaround: dispatch native input event
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

// ─── Main JobCreate Component ────────────────────────────────────────────────
const JobCreate = () => {
  const navigate = useNavigate();
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

  // ─── Submit Handler ──────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error("Vui lòng nhập tiêu đề công việc!");
      return;
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      requirements: tags,          // array of strings
      status: form.status,
    };

    setSubmitting(true);
    try {
      const res = await jobService.create(payload);
      if (res.success) {
        toast.success("🎉 Tạo công việc thành công!");
        navigate("/jobs");
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
      <button
        type="button"
        className="job-create__back"
        onClick={() => navigate("/jobs")}
      >
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
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate("/jobs")}
            >
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

export default JobCreate;
