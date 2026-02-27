import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { toast } from "react-toastify";
import forgotPasswordService from "../../../services/client/forgotPasswordService";
import "../../../styles/client/pages/auth.css";

function ClientForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Bước 1: Gửi email yêu cầu OTP
  const handleRequestForgotPassword = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!email) {
      setErrors({ email: "Vui lòng nhập email" });
      return;
    }

    setLoading(true);
    try {
      const res = await forgotPasswordService.requestForgotPassword(email);
      if (res.success) {
        toast.success("Mã OTP đã được gửi đến email của bạn!");
        setStep(2);
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Bước 2: Xác nhận OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!otp) {
      setErrors({ otp: "Vui lòng nhập mã OTP" });
      return;
    }

    setLoading(true);
    try {
      const res = await forgotPasswordService.verifyOTP(email, otp);
      if (res.success) {
        toast.success("Xác nhận OTP thành công!");
        setStep(3);
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Mã OTP không chính xác";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Bước 3: Reset mật khẩu
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrors({});

    let newErrors = {};

    if (!password) {
      newErrors.password = "Vui lòng nhập mật khẩu mới";
    } else if (password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await forgotPasswordService.resetPassword(
        email,
        password,
        confirmPassword
      );
      if (res.success) {
        toast.success("Đặt lại mật khẩu thành công!");
        navigate("/auth/login");
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setErrors({});
    } else {
      navigate("/auth/login");
    }
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

        {/* Right - Form */}
        <div className="client-auth__form-wrapper">
          {/* Step 1: Enter Email */}
          {step === 1 && (
            <form
              className="client-auth__form"
              onSubmit={handleRequestForgotPassword}
              noValidate
            >
              <div className="client-auth__form-header">
                <h1 className="client-auth__form-title">Quên mật khẩu?</h1>
                <p className="client-auth__form-subtitle">
                  Vui lòng nhập email để nhận mã xác nhận
                </p>
              </div>

              {/* Email Field */}
              <div
                className={`client-auth__field ${errors.email ? "client-auth__field--error" : ""
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
                className={`client-auth__submit ${loading ? "client-auth__submit--loading" : ""
                  }`}
                disabled={loading}
              >
                {loading ? (
                  <span className="client-auth__spinner"></span>
                ) : (
                  "Tiếp tục"
                )}
              </button>

              <button
                type="button"
                className="client-auth__back-link"
                onClick={() => navigate("/auth/login")}
              >
                ← Quay lại đăng nhập
              </button>
            </form>
          )}

          {/* Step 2: Verify OTP */}
          {step === 2 && (
            <form
              className="client-auth__form"
              onSubmit={handleVerifyOTP}
              noValidate
            >
              <div className="client-auth__form-header">
                <h1 className="client-auth__form-title">Xác nhận OTP</h1>
                <p className="client-auth__form-subtitle">
                  Nhập mã OTP được gửi đến {email}
                </p>
              </div>

              {/* OTP Field */}
              <div
                className={`client-auth__field ${errors.otp ? "client-auth__field--error" : ""
                  }`}
              >
                <label className="client-auth__label" htmlFor="otp">
                  Mã OTP
                </label>

                <input
                  id="otp"
                  type="text"
                  name="otp"
                  className="client-auth__input"
                  placeholder="Nhập 8 chữ số"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  maxLength="8"
                />
                {errors.otp && (
                  <span className="client-auth__error">{errors.otp}</span>
                )}
              </div>

              <button
                type="submit"
                className={`client-auth__submit ${loading ? "client-auth__submit--loading" : ""
                  }`}
                disabled={loading}
              >
                {loading ? (
                  <span className="client-auth__spinner"></span>
                ) : (
                  "Xác nhận"
                )}
              </button>

              <button
                type="button"
                className="client-auth__back-link"
                onClick={goBack}
              >
                ← Quay lại
              </button>
            </form>
          )}

          {/* Step 3: Reset Password */}
          {step === 3 && (
            <form
              className="client-auth__form"
              onSubmit={handleResetPassword}
              noValidate
            >
              <div className="client-auth__form-header">
                <h1 className="client-auth__form-title">Đặt mật khẩu mới</h1>
                <p className="client-auth__form-subtitle">
                  Nhập mật khẩu mới của bạn
                </p>
              </div>

              {/* Password Field */}
              <div
                className={`client-auth__field ${errors.password ? "client-auth__field--error" : ""
                  }`}
              >
                <label className="client-auth__label" htmlFor="password">
                  Mật khẩu mới
                </label>
                <div className="client-auth__input-wrapper">
                  <MdLock className="client-auth__input-icon" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="client-auth__input"
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                  <span className="client-auth__error">
                    {errors.password}
                  </span>
                )}
              </div>

              {/* Confirm Password Field */}
              <div
                className={`client-auth__field ${errors.confirmPassword ? "client-auth__field--error" : ""
                  }`}
              >
                <label
                  className="client-auth__label"
                  htmlFor="confirmPassword"
                >
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
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="client-auth__toggle-pw"
                    onClick={() =>
                      setShowConfirmPassword((prev) => !prev)
                    }
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <MdVisibilityOff />
                    ) : (
                      <MdVisibility />
                    )}
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
                className={`client-auth__submit ${loading ? "client-auth__submit--loading" : ""
                  }`}
                disabled={loading}
              >
                {loading ? (
                  <span className="client-auth__spinner"></span>
                ) : (
                  "Đặt mật khẩu mới"
                )}
              </button>

              <button
                type="button"
                className="client-auth__back-link"
                onClick={goBack}
              >
                ← Quay lại
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ClientForgotPassword;
