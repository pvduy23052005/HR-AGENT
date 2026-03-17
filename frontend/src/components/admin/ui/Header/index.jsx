import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MdLogout, MdExpandMore } from "react-icons/md";
import authServiceAPI from "../../../../services/admin/authService";
import { AppContext } from "../../../../context/admin/app/AppContext";
import "../../../../styles/admin/ui/header.css";

function Header() {
  const navigate = useNavigate();
  const { logout } = useContext(AppContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    setShowDropdown(false);
    try {
      const res = await authServiceAPI.logout();
      if (res.success) {
        logout();
        navigate("/admin/auth/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

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

  return (
    <header className="header">
      <div className="header__actions">
        <div className="header__divider" />

        {/* User trigger + dropdown */}
        <div
          className={`header__user${showDropdown ? " header__user--open" : ""}`}
          ref={dropdownRef}
          onClick={() => setShowDropdown((prev) => !prev)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setShowDropdown((p) => !p)}
        >
          <div className="header__user-avatar">A</div>
          <div className="header__user-info">
            <span className="header__user-name">Admin</span>
            <span className="header__user-role">Quản trị viên</span>
          </div>
          <MdExpandMore
            className={`header__chevron${showDropdown ? " header__chevron--open" : ""}`}
            size={18}
          />

          {showDropdown && (
            <div className="header__dropdown" onClick={(e) => e.stopPropagation()}>
              <div
                className="header__dropdown-item header__dropdown-item--danger"
                onClick={handleLogout}
              >
                <MdLogout size={16} />
                Đăng xuất
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
