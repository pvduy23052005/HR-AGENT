import { useState, useEffect } from "react";
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
  const [resendCountdown, setResendCountdown] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState(() => {
    const saved = localStorage.getItem('otp_lockoutTime');
    return saved ? parseInt(saved) : null;
  });
  const [lockedEmail, setLockedEmail] = useState(() => {
    const saved = localStorage.getItem('otp_lockedEmail');
    return saved ? saved : null;
  });
  const MAX_OTP_ATTEMPTS = 5;
  const LOCKOUT_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

  // Persist lockout state to localStorage
  useEffect(() => {
    if (lockoutTime !== null) {
      localStorage.setItem('otp_lockoutTime', lockoutTime.toString());
    } else {
      localStorage.removeItem('otp_lockoutTime');
    }
  }, [lockoutTime]);

  useEffect(() => {
    if (lockedEmail !== null) {
      localStorage.setItem('otp_lockedEmail', lockedEmail);
    } else {
      localStorage.removeItem('otp_lockedEmail');
    }
  }, [lockedEmail]);

  // Check if lockout has expired on mount
  useEffect(() => {
    if (lockoutTime !== null) {
      const now = Date.now();
      const timeRemaining = lockoutTime + LOCKOUT_DURATION - now;
      
      if (timeRemaining <= 0) {
        setLockoutTime(null);
        setLockedEmail(null);
        setOtpAttempts(0);
      }
    }
  }, []);

  // Countdown timer for resend button
  useEffect(() => {
    let interval;
    if (resendCountdown > 0) {
      interval = setInterval(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCountdown]);

  // Lockout timer check
  useEffect(() => {
    if (lockoutTime) {
      const interval = setInterval(() => {
        const now = Date.now();
        const timeRemaining = lockoutTime + LOCKOUT_DURATION - now;
        
        if (timeRemaining <= 0) {
          setLockoutTime(null);
          setLockedEmail(null);
          setOtpAttempts(0);
          clearInterval(interval);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [lockoutTime]);

  
  const handleRequestForgotPassword = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!email) {
      setErrors({ email: "Vui lòng nhập email" });
      return;
    }

    // Check if email is locked
    if (lockedEmail === email && lockoutTime !== null) {
      const timeRemaining = lockoutTime + LOCKOUT_DURATION - Date.now();
      const minutesRemaining = Math.ceil(timeRemaining / 1000 / 60);
      toast.error(`Email này bị khóa. Vui lòng thử lại sau ${minutesRemaining} phút`);
      return;
    }

    setLoading(true);
    try {
      const res = await forgotPasswordService.requestForgotPassword(email);
      if (res.success) {
        toast.success("Mã OTP đã được gửi đến email của bạn!");
        setStep(2);
        setOtpAttempts(0);
        // Only reset lockout if it's a different email
        if (lockedEmail !== email) {
          setLockoutTime(null);
        }
        setResendCountdown(60);
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Handle resend OTP
  const handleResendOTP = async () => {
    setResendLoading(true);
    try {
      const res = await forgotPasswordService.requestForgotPassword(email);
      if (res.success) {
        toast.success("Mã OTP mới đã được gửi đến email của bạn!");
        setOtp("");
        setErrors({});
        setOtpAttempts(0);
        setResendCountdown(60);
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại";
      toast.error(message);
    } finally {
      setResendLoading(false);
    }
  };

  
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!otp) {
      setErrors({ otp: "Vui lòng nhập mã OTP" });
      return;
    }

    if (otpAttempts >= MAX_OTP_ATTEMPTS) {
      toast.error("Bạn đã nhập sai quá nhiều lần. Vui lòng thử lại sau 30 phút");
      return;
    }

    setLoading(true);
    try {
      const res = await forgotPasswordService.verifyOTP(email, otp);
      if (res.success) {
        toast.success("Xác nhận OTP thành công!");
        setOtpAttempts(0);
        setLockoutTime(null);
        setLockedEmail(null);
        setStep(3);
      }
    } catch (error) {
      const newAttempts = otpAttempts + 1;
      setOtpAttempts(newAttempts);

      if (newAttempts >= MAX_OTP_ATTEMPTS) {
        setLockoutTime(Date.now());
        setLockedEmail(email);
        toast.error("Bạn đã nhập sai quá nhiều lần. Vui lòng thử lại sau 30 phút");
      } else {
        const message =
          error.response?.data?.message || "Mã OTP không chính xác";
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrors({});

    let newErrors = {};

    if (!password) {
      newErrors.password = "Vui lòng nhập mật khẩu mới";
    } else if (password.length < 8) {
      newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";
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
        navigate("/");
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
      navigate("/");
    }
  };


  return (
    <>
         
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
                onClick={() => navigate("/")}
              >
                ← Quay lại đăng nhập
              </button>
            </form>
          )}

       
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
                  placeholder="Nhập 6 chữ số"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  maxLength="6"
                  disabled={lockoutTime !== null}
                />
                {errors.otp && (
                  <span className="client-auth__error">{errors.otp}</span>
                )}
                {lockoutTime !== null && (
                  <span className="client-auth__error">
                    Bạn đã nhập sai quá 5 lần. Vui lòng đợi để thử lại
                  </span>
                )}
              </div>

              <button
                type="submit"
                className={`client-auth__submit ${loading ? "client-auth__submit--loading" : ""
                  }`}
                disabled={loading || lockoutTime !== null}
              >
                {loading ? (
                  <span className="client-auth__spinner"></span>
                ) : (
                  "Xác nhận"
                )}
              </button>

              <button
                type="button"
                className={`client-auth__resend ${
                  resendCountdown > 0 || lockoutTime !== null ? "client-auth__resend--disabled" : ""
                }`}
                onClick={handleResendOTP}
                disabled={resendCountdown > 0 || lockoutTime !== null}
              >
                {resendCountdown > 0 && lockoutTime === null
                  ? `Gửi lại mã (${resendCountdown}s)`
                  : "Gửi lại mã OTP"}
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
    </>
  );
}

export default ClientForgotPassword;
