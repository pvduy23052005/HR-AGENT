import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdNotifications, MdLogout, MdPerson } from "react-icons/md";
import { toast } from "react-toastify";
import authService from "../../../services/client/authService";
import "../../../styles/client/ui/header.css";

function ClientHeader() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {
        setUser(null);
      }
    }
  }, []);

  const getInitial = () => {
    if (!user?.fullName) return "U";
    return user.fullName.charAt(0).toUpperCase();
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      toast.success("Đăng xuất thành công!");
      navigate("/auth/login");
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/auth/login");
    }
  };

  return (
    <header className="client-header">
      <div className="client-header__left">
        <dir></dir>
        <h2 className="client-header__page-title">HR-Agent</h2>
      </div>

      <div className="client-header__right">
        {/* Notifications */}
        <button className="client-header__icon-btn" title="Thông báo">
          <MdNotifications />
          <span className="client-header__badge"></span>
        </button>

        <div className="client-header__divider"></div>

        {/* User Menu */}
        <div
          className="client-header__user"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <div className="client-header__avatar">{getInitial()}</div>
          <div className="client-header__user-info">
            <span className="client-header__user-name">
              {user?.fullName || "Người dùng"}
            </span>
            <span className="client-header__user-role">Ứng viên</span>
          </div>

          {showDropdown && (
            <div className="client-header__dropdown">
              <div className="client-header__dropdown-item">
                <MdPerson />
                <span>Hồ sơ cá nhân</span>
              </div>
              <div
                className="client-header__dropdown-item client-header__dropdown-item--danger"
                onClick={handleLogout}
              >
                <MdLogout />
                <span>Đăng xuất</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default ClientHeader;
