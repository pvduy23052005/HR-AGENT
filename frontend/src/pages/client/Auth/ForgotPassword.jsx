import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdEmail, MdArrowBack } from "react-icons/md";
import { toast } from "react-toastify";
import "../../../styles/client/pages/auth.css";

function ClientForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validate
    let newErrors = {};
    if (!email) newErrors.email = "Vui lòng nhập email";
    if (email && !email.includes("@")) newErrors.email = "Email không hợp lệ";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    // TODO: Gọi API quên mật khẩu ở đây
    // const res = await authServiceAPI.forgotPassword({ email });

    setTimeout(() => {
      toast.success("Kiểm tra email để đặt lại mật khẩu!");
      setSent(true);
      setLoading(false);
      // Redirect sau 2s
      setTimeout(() => {
        navigate("/auth/login");
      }, 2000);
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

        {/* Right - Forgot Password Form */}
        <div className="client-auth__form-wrapper">
          {!sent ? (
            <form
              className="client-auth__form"
              onSubmit={handleSubmit}
              noValidate
            >
              <div className="client-auth__form-header">
                <h1 className="client-auth__form-title">Quên mật khẩu?</h1>
                <p className="client-auth__form-subtitle">
                  Không lo, chúng tôi sẽ giúp bạn khôi phục mật khẩu. Vui lòng
                  nhập địa chỉ email của bạn.
                </p>
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
                {errors.email && (
                  <span className="client-auth__error">{errors.email}</span>
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
                  "Gửi liên kết khôi phục"
                )}
              </button>

              <button
                type="button"
                className="client-auth__back-btn"
                onClick={() => navigate("/auth/login")}
              >
                <MdArrowBack /> Quay lại đăng nhập
              </button>
            </form>
          ) : (
            <div className="client-auth__success-message">
              <div className="client-auth__success-icon">✓</div>
              <h2 className="client-auth__success-title">Kiểm tra email</h2>
              <p className="client-auth__success-text">
                Chúng tôi đã gửi liên kết khôi phục mật khẩu đến <strong>{email}</strong>
              </p>
              <p className="client-auth__success-hint">
                Đang chuyển hướng...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ClientForgotPassword;
