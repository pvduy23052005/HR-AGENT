import { Outlet } from "react-router-dom";
import ClientSidebar from "../../components/clients/siderbar";
import ClientHeader from "../../components/clients/header";
import "../../styles/client/layout.css";

function LayoutClientDefault() {
  return (
    <div className="client-layout">
      <ClientSidebar />
      <div className="client-layout__main">
        <ClientHeader />
        <main className="client-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default LayoutClientDefault;
