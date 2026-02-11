import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff } from "react-icons/md";
import authServiceAPI from "../../../services/admin/authService";
import { toast } from "react-toastify";
import "../../../styles/admin/pages/auth.css";

function Auth() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await authServiceAPI.login({ email, password });
      if (res.success) {
        toast.success("Đăng nhập thành công!");
        navigate("/admin/dashboard");
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth">
      <div className="auth__container">
        {/* Left - Branding */}
        <div className="auth__branding">
          <div className="auth__branding-content">
            <div className="auth__branding-logo">
              <div className="auth__branding-logo-icon">N</div>
              <span className="auth__branding-logo-text">Hr-agent</span>
            </div>
            <h2 className="auth__branding-title">
              Hệ thống quản trị <br />
            </h2>
            <div className="auth__branding-features">
              <div className="auth__branding-feature">
                <span className="auth__branding-feature-dot"></span>
                Phân tích CV tự động bằng AI
              </div>
              <div className="auth__branding-feature">
                <span className="auth__branding-feature-dot"></span>
                Quản lý ứng viên thông minh
              </div>
              <div className="auth__branding-feature">
                <span className="auth__branding-feature-dot"></span>
                Dashboard thống kê
              </div>
            </div>
          </div>
        </div>

        {/* Right - Login Form */}
        <div className="auth__form-wrapper">
          <form className="auth__form" onSubmit={handleSubmit} noValidate>
            <div className="auth__form-header">
              <h1 className="auth__form-title">Đăng nhập</h1>
              <p className="auth__form-subtitle">
                Chào mừng trở lại! Vui lòng đăng nhập để tiếp tục.
              </p>
            </div>

            {/* Email */}
            <div
              className={`auth__field ${errors.email ? "auth__field--error" : ""}`}
            >
              <label className="auth__label" htmlFor="email">
                Email
              </label>
              <div className="auth__input-wrapper">
                <MdEmail className="auth__input-icon" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  className="auth__input"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <span className="auth__error">{errors.email}</span>
              )}
            </div>

            {/* Password */}
            <div
              className={`auth__field ${errors.password ? "auth__field--error" : ""}`}
            >
              <label className="auth__label" htmlFor="password">
                Mật khẩu
              </label>
              <div className="auth__input-wrapper">
                <MdLock className="auth__input-icon" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="auth__input"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="auth__toggle-pw"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                >
                  {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                </button>
              </div>
              {errors.password && (
                <span className="auth__error">{errors.password}</span>
              )}
            </div>

            <div className="auth__options">
              <a href="/forgot-password" className="auth__forgot-link">
                Quên mật khẩu?
              </a>
            </div>

            <button
              type="submit"
              className={`auth__submit ${loading ? "auth__submit--loading" : ""}`}
              disabled={loading}
            >
              {loading ? <span className="auth__spinner"></span> : "Đăng nhập"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Auth;
