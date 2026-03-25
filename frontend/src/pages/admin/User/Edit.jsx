import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  MdArrowBack,
  MdPerson,
  MdEmail,
  MdLock,
  MdSave,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";
import { toast } from "react-toastify";
import * as userService from "../../../services/admin/userService";
import "../../../styles/admin/pages/user-create.css";

function EditUser() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    status: "active",
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, [id]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      // Get all users and find by ID since single user endpoint may not exist
      const res = await userService.getUsers();
      const user = (res.users || []).find((u) => u.id === id);
      if (user) {
        if (user.status !== "active") {
          toast.error("Không thể chỉnh sửa tài khoản đã bị khóa!");
          navigate("/admin/users");
          return;
        }
        setFormData({
          fullName: user.fullName || "",
          email: user.email || "",
          password: "",
          status: user.status || "active",
        });
      } else {
        toast.error("Không tìm thấy người dùng!");
        navigate("/admin/users");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      toast.error("Lỗi tải thông tin người dùng!");
      navigate("/admin/users");
    } finally {
      setLoading(false);
    }
  };

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

    if (formData.password && formData.password.length < 6) {
      toast.warning("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    try {
      setSaving(true);
      // Prepare data - only include password if it was changed
      const updateData = {
        fullName: formData.fullName,
        email: formData.email,
        status: formData.status,
      };
      if (formData.password.trim()) {
        updateData.password = formData.password;
      }

      await userService.updateUser(id, updateData);
      toast.success("Cập nhật tài khoản thành công!");
      navigate("/admin/users");
    } catch (error) {
      const msg =
        error.response?.data?.message || "Lỗi cập nhật tài khoản, vui lòng thử lại!";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="user-create">
        <div className="user-create__header">
          <button
            className="user-create__back"
            onClick={() => navigate("/admin/users")}
          >
            <MdArrowBack size={20} />
            <span>Quay lại</span>
          </button>
        </div>
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }

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
          <h1 className="user-create__title">Sửa người dùng</h1>
          <p className="user-create__subtitle">
            Cập nhật thông tin tài khoản người dùng.
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

          {/* Password */}
          <div className="user-create__field">
            <label className="user-create__label">
              <MdLock className="user-create__label-icon" />
              Mật khẩu
            </label>
            <div className="user-create__input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                className="user-create__input"
                name="password"
                placeholder="Để trống nếu không muốn đổi mật khẩu"
                value={formData.password}
                onChange={handleInputChange}
              />
              <button
                type="button"
                className="user-create__eye-btn"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <MdVisibilityOff size={18} />
                ) : (
                  <MdVisibility size={18} />
                )}
              </button>
            </div>
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
              {saving ? "Đang lưu..." : "Cập nhật"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditUser;
