import { NavLink, useNavigate } from "react-router-dom";
import {
  MdDashboard,
  MdPeople,
  MdSmartToy,
  MdBarChart,
  MdLogout,
} from "react-icons/md";
import { useContext } from "react";
import "../../../../styles/admin/ui/sider.css";
import authServiceAPI from "../../../../services/admin/authService";
import { AppContext } from "../../../../context/admin/app/AppContext";

const menuItems = [
  { path: "/admin/dashboard", icon: <MdDashboard />, label: "Tổng quan" },
  { path: "/admin/users", icon: <MdPeople />, label: "Quản lý người dùng" },
  { path: "/admin/ai-config", icon: <MdSmartToy />, label: "Cấu hình AI" },
  { path: "/admin/statistics", icon: <MdBarChart />, label: "Thống kê" },
];

function Sider() {
  const navigate = useNavigate();
  const { logout } = useContext(AppContext);

  const handleLogout = async () => {
    try {
      const res = await authServiceAPI.logout();
      console.log(res);
      if (res.success) {
        logout();
        navigate("/admin/auth/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <aside className="sider">
      <div className="sider__logo">
        <div className="sider__logo-icon">N</div>
        <span className="sider__logo-text">Hr-agent</span>
      </div>

      <nav className="sider__menu">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sider__menu-item${isActive ? " active" : ""}`
            }
          >
            <span className="sider__menu-item-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sider__footer">
        <div className="sider__footer-user">
          <div className="sider__footer-avatar">A</div>
          <div className="sider__footer-info">
            <span className="sider__footer-name">Admin</span>
            <span className="sider__footer-role">Quản trị viên</span>
          </div>
          <button
            className="sider__footer-logout"
            onClick={handleLogout}
            title="Đăng xuất"
          >
            <MdLogout />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sider;
