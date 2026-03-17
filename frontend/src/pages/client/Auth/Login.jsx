import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { toast } from "react-toastify";
import authService from "../../../services/client/authService";
import "../../../styles/client/pages/auth.css";

function ClientLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

   
    let newErrors = {};
    if (!email) newErrors.email = "Vui lòng nhập email";
    if (!password) newErrors.password = "Vui lòng nhập mật khẩu";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await authService.login(email, password);

      if (res.code === 200) {
        toast.success("Đăng nhập thành công!");
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));
        navigate("/dashboard");
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
    <form
      className="client-auth__form"
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="client-auth__form-header">
        <h1 className="client-auth__form-title">Đăng nhập</h1>
        <p className="client-auth__form-subtitle">
          Chào mừng bạn! Vui lòng đăng nhập để tiếp tục.
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
            placeholder="nguyenvana@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>
        {errors.email && (
          <span className="client-auth__error">{errors.email}</span>
        )}
      </div>

      <div
        className={`client-auth__field ${errors.password ? "client-auth__field--error" : ""
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
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

      <div className="client-auth__options">
        <Link
          to="/auth/forgot-password"
          className="client-auth__forgot-link"
        >
          Quên mật khẩu?
        </Link>
      </div>

      <button
        type="submit"
        className={`client-auth__submit ${loading ? "client-auth__submit--loading" : "" }`}
        disabled={loading}
      >
        {loading ? (
          <span className="client-auth__spinner"></span>
        ) : (
          "Đăng nhập"
        )}
      </button>
    </form>
  );
}

export default ClientLogin;
