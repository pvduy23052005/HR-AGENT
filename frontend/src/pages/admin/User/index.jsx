import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdSearch,
  MdAdd,
  MdLock,
  MdLockOpen,
  MdPeople,
  MdEdit,
} from "react-icons/md";
import { toast } from "react-toastify";
import * as userService from "../../../services/admin/userService";
import "../../../styles/admin/pages/users.css";

function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, user: null });

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await userService.getUsers();
      setUsers(res.users || []);
    } catch (error) {
      console.error(error);
      toast.error("Lỗi tải danh sách người dùng!");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Filter & search
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Toggle lock
  const handleChangeStatus = async (user) => {
    // Only allow locking active accounts. Unlocking is disabled permanent.
    if (user.status === "active") {
      setConfirmDialog({ isOpen: true, user });
    } else {
      toast.warning("Tài khoản này đã bị khóa vĩnh viễn và không thể mở lại!");
    }
  };

  // Execute status change
  const executeChangeStatus = async (user) => {
    try {
      const newStatus = user.status === "active" ? "inactive" : "active";
      const data = await userService.changeStatus(
        user.id.toString(),
        newStatus,
      );
      if (data.success) {
        toast.success(
          newStatus === "active"
            ? "Đã mở khóa tài khoản!"
            : "Đã khóa tài khoản!",
        );
        fetchUsers();
      }
    } catch {
      toast.error("Lỗi cập nhật trạng thái!");
    }
  };

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <>
      {/* Header */}
      <div className="users-page__header">
        <h1 className="users-page__title">Quản lý người dùng</h1>
        <p className="users-page__subtitle">
          Quản lý tài khoản và phân quyền người dùng trong hệ thống.
        </p>
      </div>

      {/* Toolbar */}
      <div className="users-toolbar">
        <div className="users-toolbar__search">
          <MdSearch className="users-toolbar__search-icon" />
          <input
            type="text"
            className="users-toolbar__search-input"
            placeholder="Tìm theo tên hoặc email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select
          className="users-toolbar__filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="active">Hoạt động</option>
          <option value="inactive">Đã khóa</option>
        </select>

        <div className="users-toolbar__spacer" />

        <div className="users-toolbar__actions">
          <button
            className="users-toolbar__btn users-toolbar__btn--primary"
            onClick={() => navigate("/admin/users/create")}
          >
            <MdAdd size={18} />
            Thêm người dùng
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="users-table-wrapper">
        <table className="users-table">
          <thead>
            <tr>
              <th>Người dùng</th>
              <th>Email</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <SkeletonRows />
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="5">
                  <EmptyState />
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="users-table__user">
                      <div className="users-table__avatar">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.fullName} />
                        ) : (
                          getInitials(user.fullName)
                        )}
                      </div>
                      <span className="users-table__name">{user.fullName}</span>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`users-badge users-badge--${user.status}`}>
                      {user.status === "active" ? "Hoạt động" : "Đã khóa"}
                    </span>
                  </td>
                  <td>
                    <span className="users-table__date">
                      {formatDate(user.createdAt)}
                    </span>
                  </td>
                  {/* action */}
                  <td>
                    <div className="users-table__actions">
                      <button
                        className="users-table__action-btn users-table__action-btn--info"
                        title="Sửa"
                        onClick={() => navigate(`/admin/users/edit/${user.id}`)}
                      >
                        <MdEdit />
                      </button>
                      <button
                        className="users-table__action-btn users-table__action-btn--warning"
                        title={
                          user.status === "active"
                            ? "Khóa tài khoản"
                            : "Đã khóa vĩnh viễn"
                        }
                        onClick={() => handleChangeStatus(user)}
                        disabled={user.status !== "active"}
                        style={{
                          opacity: user.status === "active" ? 1 : 0.4,
                          cursor: user.status === "active" ? "pointer" : "not-allowed"
                        }}
                      >
                        {user.status === "active" ? <MdLock /> : <MdLock />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Confirmation Dialog */}
      {confirmDialog.isOpen && (
        <div className="users-dialog-overlay">
          <div className="users-dialog">
            <div className="users-dialog__header">
              <h2 className="users-dialog__title">Xác nhận vô hiệu hóa tài khoản</h2>
            </div>
            <div className="users-dialog__body">
              <p className="users-dialog__message">
                Bạn có chắc chắn muốn vô hiệu hóa tài khoản <strong>{confirmDialog.user?.fullName}</strong> không?
              </p>
            </div>
            <div className="users-dialog__footer">
              <button
                className="users-dialog__btn users-dialog__btn--cancel"
                onClick={() => setConfirmDialog({ isOpen: false, user: null })}
              >
                Hủy bỏ
              </button>
              <button
                className="users-dialog__btn users-dialog__btn--confirm"
                onClick={() => {
                  executeChangeStatus(confirmDialog.user);
                  setConfirmDialog({ isOpen: false, user: null });
                }}
              >
                Vô hiệu hóa
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Skeleton loading component
function SkeletonRows() {
  return Array.from({ length: 5 }).map((_, i) => (
    <tr key={i}>
      <td colSpan="5">
        <div className="users-skeleton__row">
          <div className="users-skeleton__avatar" />
          <div className="users-skeleton__line users-skeleton__line--name" />
          <div className="users-skeleton__line users-skeleton__line--email" />
          <div className="users-skeleton__line users-skeleton__line--badge" />
          <div className="users-skeleton__line users-skeleton__line--date" />
          <div className="users-skeleton__line users-skeleton__line--actions" />
        </div>
      </td>
    </tr>
  ));
}

// Empty state component
function EmptyState() {
  return (
    <div className="users-empty">
      <MdPeople className="users-empty__icon" />
      <p className="users-empty__title">Chưa có người dùng nào</p>
      <p className="users-empty__text">
        Nhấn "Thêm người dùng" để tạo tài khoản mới.
      </p>
    </div>
  );
}

export default Users;
