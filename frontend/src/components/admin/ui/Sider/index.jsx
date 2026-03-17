import { NavLink } from "react-router-dom";
import {
  MdDashboard,
  MdPeople,
  MdSmartToy,
  MdBarChart,
  MdSchedule,
} from "react-icons/md";
import "../../../../styles/admin/ui/sider.css";

const menuItems = [
  { path: "/admin/dashboard", icon: <MdDashboard />, label: "Tổng quan" },
  { path: "/admin/users", icon: <MdPeople />, label: "Quản lý người dùng" },
  { path: "/admin/interview-schedule", icon: <MdSchedule />, label: "Lịch phỏng vấn" },
  { path: "/admin/ai-config", icon: <MdSmartToy />, label: "Cấu hình AI" },
  { path: "/admin/statistics", icon: <MdBarChart />, label: "Thống kê" },
];

function Sider() {
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
    </aside>
  );
}

export default Sider;
