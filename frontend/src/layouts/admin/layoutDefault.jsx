import { Outlet } from "react-router-dom";
import Sider from "../../components/admin/ui/sider";
import Header from "../../components/admin/ui/Header";
import "../../styles/admin/layout.css";

function LayoutDefault() {
  return (
    <div className="admin-layout">
      <Sider />
      <div className="admin-layout__main">
        <Header />
        <main className="admin-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default LayoutDefault;
