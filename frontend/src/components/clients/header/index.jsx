
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MdNotifications, MdLogout, MdPerson, MdExpandMore } from "react-icons/md";
import { toast } from "react-toastify";
import authService from "../../../services/client/authService";

import "../../../styles/client/ui/header.css";

function ClientHeader() {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);


  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {
        setUser(null);
      }
    }
    
    // Load notifications from localStorage
    const savedNotifications = localStorage.getItem("notifications");
    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications));
      } catch {
        setNotifications([]);
      }
    }

    // Listen for notification updates
    const handleNotificationsUpdated = () => {
      const updated = localStorage.getItem("notifications");
      if (updated) {
        try {
          setNotifications(JSON.parse(updated));
        } catch {
          setNotifications([]);
        }
      }
    };

    window.addEventListener("notificationsUpdated", handleNotificationsUpdated);
    return () => {
      window.removeEventListener("notificationsUpdated", handleNotificationsUpdated);
    };
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setShowNotificationDropdown(false);
      }
    };
    if (showDropdown || showNotificationDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown, showNotificationDropdown]);

  const markAsRead = (index) => {
    const updatedNotifications = notifications.map((notif, i) =>
      i === index ? { ...notif, read: true } : notif
    );
    setNotifications(updatedNotifications);
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    localStorage.setItem("notifications", JSON.stringify([]));
    setShowNotificationDropdown(false);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getInitial = () => {
    if (!user?.fullName) return "U";
    return user.fullName.charAt(0).toUpperCase();
  };

  return (
    <header className="client-header">
      <div className="client-header__user-section">
        <div className="client-header__user">
          <div className="client-header__avatar">{getInitial()}</div>
          <div className="client-header__user-info">
            <span className="client-header__user-name">
              {user?.fullName || "Người dùng"}
            </span>
            <span className="client-header__user-role">Ứng viên</span>
          </div>
        </div>

        <div className="client-header__notifications" ref={notificationRef}>
          <button
            className="client-header__notification-btn"
            onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
          >
            <MdNotifications size={24} />
            {unreadCount > 0 && (
              <span className="client-header__notification-badge">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
          
          {showNotificationDropdown && (
            <div className="client-header__notification-dropdown">
              <div className="client-header__notification-header">
                <h3>Thông báo</h3>
                {notifications.length > 0 && (
                  <button
                    className="client-header__clear-btn"
                    onClick={clearAllNotifications}
                  >
                    Xóa tất cả
                  </button>
                )}
              </div>
              
              <div className="client-header__notification-list">
                {notifications.length === 0 ? (
                  <div className="client-header__empty-notification">
                    Không có thông báo
                  </div>
                ) : (
                  notifications.map((notif, index) => (
                    <div
                      key={index}
                      className={`client-header__notification-item ${
                        notif.read ? "read" : "unread"
                      }`}
                      onClick={() => markAsRead(index)}
                    >
                      <div className="client-header__notif-title">
                        {notif.title}
                      </div>
                      <div className="client-header__notif-message">
                        {notif.message}
                      </div>
                      <div className="client-header__notif-time">
                        {notif.timestamp}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default ClientHeader;
