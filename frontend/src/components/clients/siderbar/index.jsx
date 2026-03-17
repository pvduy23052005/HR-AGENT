import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  MdDashboard,
  MdCloudUpload,
  MdPeople,
  MdBarChart,
  MdAccountTree,
  MdWork,
  MdLogout,
} from "react-icons/md";
import { toast } from "react-toastify";
import authService from "../../../services/client/authService";
import "../../../styles/client/ui/siderbar.css";

const menuItems = [
  { path: "/dashboard", icon: <MdDashboard />, label: "Tổng quan" },
  { path: "/jobs", icon: <MdWork />, label: "Quản lý Công việc" },
  { path: "/upload_cv", icon: <MdCloudUpload />, label: "Nộp CV" },
  { path: "/candidates", icon: <MdPeople />, label: "Quản lý ứng viên" },
  { path: "/reports", icon: <MdBarChart />, label: "Báo cáo & Thống kê" },
  { path: "/recruitment", icon: <MdAccountTree />, label: "Quy trình tuyển dụng" },
];

function ClientSidebar() {
  const navigate = useNavigate();

  // Read user from localStorage once on mount using lazy initialiser
  const [user] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    // eslint-disable-next-line no-unused-vars
    } catch (e) {
      return null;
    }
  });

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
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/auth/login");
    }
  };

  return (
    <aside className="client-sider">
      <div className="client-sider__logo">
        <div className="client-sider__logo-icon">N</div>
        <span className="client-sider__logo-text">Hr-agent</span>
      </div>

      <nav className="client-sider__menu">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `client-sider__menu-item${isActive ? " active" : ""}`
            }
          >
            <span className="client-sider__menu-item-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="client-sider__footer">
        <div className="client-sider__footer-user">
          <div className="client-sider__footer-avatar">{getInitial()}</div>
          <div className="client-sider__footer-info">
            <span className="client-sider__footer-name">
              {user?.fullName || "Người dùng"}
            </span>
            <span className="client-sider__footer-role">Ứng viên</span>
          </div>
          <button
            className="client-sider__footer-logout"
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

export default ClientSidebar;
