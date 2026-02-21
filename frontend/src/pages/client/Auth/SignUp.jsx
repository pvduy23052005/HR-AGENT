import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdEmail,
  MdLock,
  MdVisibility,
  MdVisibilityOff,
  MdPerson,
} from "react-icons/md";
import { toast } from "react-toastify";
import "../../../styles/client/pages/auth.css";

function ClientSignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validate
    let newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Vui lòng nhập họ tên";
    }

    if (!formData.email) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    // TODO: Gọi API signup ở đây
    // const res = await authServiceAPI.signup(formData);

    setTimeout(() => {
      toast.success("Đăng kí thành công! Vui lòng đăng nhập.");
      setLoading(false);
      navigate("/auth/login");
    }, 1000);
  };

  return (
    <div className="client-auth">
      <div className="client-auth__container">
        {/* Left - Branding */}
        <div className="client-auth__branding">
          <div className="client-auth__branding-content">
            <div className="client-auth__branding-logo">
              <div className="client-auth__branding-logo-icon">N</div>
              <span className="client-auth__branding-logo-text">Hr-agent</span>
            </div>
            <h2 className="client-auth__branding-title">
              Nền tảng tuyển dụng <br /> thông minh
            </h2>
            <div className="client-auth__branding-features">
              <div className="client-auth__branding-feature">
                <span className="client-auth__branding-feature-dot"></span>
                Tìm kiếm công việc phù hợp
              </div>
              <div className="client-auth__branding-feature">
                <span className="client-auth__branding-feature-dot"></span>
                Quản lý hồ sơ ứng tuyển
              </div>
              <div className="client-auth__branding-feature">
                <span className="client-auth__branding-feature-dot"></span>
                Nhận thông báo mới nhất
              </div>
            </div>
          </div>
        </div>

        {/* Right - SignUp Form */}
        <div className="client-auth__form-wrapper">
          <form className="client-auth__form" onSubmit={handleSubmit} noValidate>
            <div className="client-auth__form-header">
              <h1 className="client-auth__form-title">Đăng kí</h1>
              <p className="client-auth__form-subtitle">
                Tạo tài khoản để bắt đầu tìm kiếm công việc
              </p>
            </div>

            {/* Full Name */}
            <div
              className={`client-auth__field ${
                errors.fullName ? "client-auth__field--error" : ""
              }`}
            >
              <label className="client-auth__label" htmlFor="fullName">
                Họ tên
              </label>
              <div className="client-auth__input-wrapper">
                <MdPerson className="client-auth__input-icon" />
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  className="client-auth__input"
                  placeholder="Nhập họ tên đầy đủ"
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
              </div>
              {errors.fullName && (
                <span className="client-auth__error">{errors.fullName}</span>
              )}
            </div>

            {/* Email */}
            <div
              className={`client-auth__field ${
                errors.email ? "client-auth__field--error" : ""
              }`}
            >
              <label className="client-auth__label" htmlFor="email">
                Email
              </label>
              <div className="client-auth__input-wrapper">
                <MdEmail className="client-auth__input-icon" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  className="client-auth__input"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <span className="client-auth__error">{errors.email}</span>
              )}
            </div>

            {/* Password */}
            <div
              className={`client-auth__field ${
                errors.password ? "client-auth__field--error" : ""
              }`}
            >
              <label className="client-auth__label" htmlFor="password">
                Mật khẩu
              </label>
              <div className="client-auth__input-wrapper">
                <MdLock className="client-auth__input-icon" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="client-auth__input"
                  placeholder="Nhập mật khẩu"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="client-auth__toggle-pw"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                >
                  {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                </button>
              </div>
              {errors.password && (
                <span className="client-auth__error">{errors.password}</span>
              )}
            </div>

            {/* Confirm Password */}
            <div
              className={`client-auth__field ${
                errors.confirmPassword ? "client-auth__field--error" : ""
              }`}
            >
              <label className="client-auth__label" htmlFor="confirmPassword">
                Xác nhận mật khẩu
              </label>
              <div className="client-auth__input-wrapper">
                <MdLock className="client-auth__input-icon" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  className="client-auth__input"
                  placeholder="Nhập lại mật khẩu"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="client-auth__toggle-pw"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <MdVisibilityOff /> : <MdVisibility />}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="client-auth__error">
                  {errors.confirmPassword}
                </span>
              )}
            </div>

            <button
              type="submit"
              className={`client-auth__submit ${
                loading ? "client-auth__submit--loading" : ""
              }`}
              disabled={loading}
            >
              {loading ? (
                <span className="client-auth__spinner"></span>
              ) : (
                "Đăng kí"
              )}
            </button>

            <div className="client-auth__divider">
              <span>hoặc</span>
            </div>

            <button
              type="button"
              className="client-auth__social-btn"
              onClick={() => navigate("/auth/login")}
            >
              Đã có tài khoản? Đăng nhập
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ClientSignUp;
