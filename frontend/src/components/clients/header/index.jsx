
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MdNotifications, MdLogout, MdPerson, MdExpandMore } from "react-icons/md";
import { toast } from "react-toastify";
import authService from "../../../services/client/authService";

import "../../../styles/client/ui/header.css";

function ClientHeader() {
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
