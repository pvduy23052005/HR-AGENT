import {
  MdMailOutline,
  MdChevronRight,
} from "react-icons/md";
import "../../../../styles/admin/ui/header.css";


function Header() {
  return (
    <header className="header">

      <div className="header__actions">
        <button className="header__action-btn" title="Tin nhắn">
          <MdMailOutline />
        </button>

        <div className="header__divider"></div>

        <div className="header__user">
          <div className="header__user-avatar">A</div>
          <div className="header__user-info">
            <span className="header__user-name">Admin</span>
            <span className="header__user-role">Quản trị viên</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
