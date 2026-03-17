import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MdNotifications, MdLogout, MdPerson, MdExpandMore } from "react-icons/md";
import { toast } from "react-toastify";
import authService from "../../../services/client/authService";
import "../../../styles/client/ui/header.css";

function ClientHeader() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  const getInitial = () => {
    if (!user?.fullName) return "U";
    return user.fullName.charAt(0).toUpperCase();
  };

  const handleLogout = async () => {
    setShowDropdown(false);
    try {
      await authService.logout();
    } catch {
      // ignore – always clear local state
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      toast.success("Đăng xuất thành công!");
      navigate("/auth/login");
    }
  };

  return (
    <header className="client-header">
      <div className="client-header__left">
        <h2 className="client-header__page-title">HR-Agent</h2>
      </div>

      <div className="client-header__right">
        {/* Notifications */}
        <button className="client-header__icon-btn" title="Thông báo">
          <MdNotifications />
          <span className="client-header__badge" />
        </button>

        <div className="client-header__divider" />

        {/* User Menu */}
        <div
          ref={dropdownRef}
          className={`client-header__user${showDropdown ? " client-header__user--open" : ""}`}
          onClick={() => setShowDropdown((prev) => !prev)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setShowDropdown((p) => !p)}
        >
          <div className="client-header__avatar">{getInitial()}</div>
          <div className="client-header__user-info">
            <span className="client-header__user-name">
              {user?.fullName || "Người dùng"}
            </span>
            <span className="client-header__user-role">Ứng viên</span>
          </div>
          <MdExpandMore
            className={`client-header__chevron${showDropdown ? " client-header__chevron--open" : ""}`}
          />

          {showDropdown && (
            <div
              className="client-header__dropdown"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Dropdown header – user summary */}
              <div className="client-header__dropdown-header">
                <div className="client-header__dropdown-avatar">{getInitial()}</div>
                <div>
                  <div className="client-header__dropdown-name">
                    {user?.fullName || "Người dùng"}
                  </div>
                  <div className="client-header__dropdown-email">
                    {user?.email || "Ứng viên"}
                  </div>
                </div>
              </div>

              <div className="client-header__dropdown-divider" />

              {/* Profile */}
              <div className="client-header__dropdown-item">
                <MdPerson size={16} />
                <span>Hồ sơ cá nhân</span>
              </div>

              <div className="client-header__dropdown-divider" />

              {/* Logout */}
              <div
                className="client-header__dropdown-item client-header__dropdown-item--danger"
                onClick={handleLogout}
              >
                <MdLogout size={16} />
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
