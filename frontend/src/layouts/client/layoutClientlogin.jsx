
import { Outlet } from "react-router-dom";
import "../../styles/client/pages/auth.css";

function LayoutClientlogin() {
  return (
    <div className="client-auth">
      <div className="client-auth__container">
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

        <div className="client-auth__form-wrapper">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default LayoutClientlogin;