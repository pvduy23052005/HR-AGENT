import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdArrowBack, MdPerson, MdEmail, MdLock, MdSave } from "react-icons/md";
import { toast } from "react-toastify";
import * as userService from "../../../services/admin/userService";
import "../../../styles/admin/pages/user-create.css";

function CreateUser() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    status: "active",
  });
  const [saving, setSaving] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      toast.warning("Vui lòng nhập Họ tên!");
      return;
    }
    if (!formData.email.trim()) {
      toast.warning("Vui lòng nhập Email!");
      return;
    }
    if (!formData.password) {
      toast.warning("Vui lòng nhập Mật khẩu!");
      return;
    }
    if (formData.password.length < 6) {
      toast.warning("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    try {
      setSaving(true);
      await userService.createUser(formData);
      toast.success("Tạo tài khoản thành công!");
      navigate("/admin/users");
    } catch (error) {
      const msg =
        error.response?.data?.message || "Lỗi tạo tài khoản, vui lòng thử lại!";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="user-create">
      {/* Header */}
      <div className="user-create__header">
        <button
          className="user-create__back"
          onClick={() => navigate("/admin/users")}
        >
          <MdArrowBack size={20} />
          <span>Quay lại</span>
        </button>
        <div>
          <h1 className="user-create__title">Thêm người dùng mới</h1>
          <p className="user-create__subtitle">
            Điền thông tin bên dưới để tạo tài khoản mới cho hệ thống.
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="user-create__card">
        <form onSubmit={handleSubmit} className="user-create__form">
          {/* Full Name */}
          <div className="user-create__field">
            <label className="user-create__label">
              <MdPerson className="user-create__label-icon" />
              Họ tên <span className="user-create__required">*</span>
            </label>
            <input
              type="text"
              className="user-create__input"
              name="fullName"
              placeholder="Nhập họ và tên đầy đủ"
              value={formData.fullName}
              onChange={handleInputChange}
              autoFocus
            />
          </div>

          {/* Email */}
          <div className="user-create__field">
            <label className="user-create__label">
              <MdEmail className="user-create__label-icon" />
              Email <span className="user-create__required">*</span>
            </label>
            <input
              type="email"
              className="user-create__input"
              name="email"
              placeholder="example@company.com"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          {/* Password */}
          <div className="user-create__field">
            <label className="user-create__label">
              <MdLock className="user-create__label-icon" />
              Mật khẩu <span className="user-create__required">*</span>
            </label>
            <input
              type="password"
              className="user-create__input"
              name="password"
              placeholder="Tối thiểu 6 ký tự"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>

          {/* Status */}
          <div className="user-create__field">
            <label className="user-create__label">Trạng thái</label>
            <select
              className="user-create__select"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value="active">Hoạt động</option>
              <option value="inactive">Đã khóa</option>
            </select>
          </div>

          {/* Divider */}
          <div className="user-create__divider" />

          {/* Actions */}
          <div className="user-create__actions">
            <button
              type="button"
              className="user-create__btn user-create__btn--cancel"
              onClick={() => navigate("/admin/users")}
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="user-create__btn user-create__btn--save"
              disabled={saving}
            >
              <MdSave size={18} />
              {saving ? "Đang lưu..." : "Tạo tài khoản"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateUser;
