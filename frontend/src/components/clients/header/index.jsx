import { useState, useEffect } from "react";
import "../../../styles/client/ui/header.css";

function ClientHeader() {
  const [user, setUser] = useState(null);

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

  return (
    <header className="client-header">
      <div className="client-header__user">
        <div className="client-header__avatar">{getInitial()}</div>
        <div className="client-header__user-info">
          <span className="client-header__user-name">
            {user?.fullName || "Người dùng"}
          </span>
          <span className="client-header__user-role">Ứng viên</span>
        </div>
      </div>
    </header>
  );
}

export default ClientHeader;
