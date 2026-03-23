import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdArrowBack, MdSearch } from "react-icons/md";
import { toast } from "react-toastify";
import * as userService from "../../../services/admin/userService";
import "../../../styles/admin/pages/user-create.css";

function UserSearch() {
  const navigate = useNavigate();
  const { email: initialEmail } = useParams();
  const [email, setEmail] = useState(decodeURIComponent(initialEmail || ""));
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (initialEmail) {
      handleSearch();
    }
  }, [initialEmail]);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();

    if (!email.trim()) {
      toast.warning("Vui lòng nhập email để tìm kiếm!");
      return;
    }

    try {
      setLoading(true);
      const res = await userService.getUsers();
      const foundUsers = (res.users || []).filter((user) =>
        user.email.toLowerCase().includes(email.toLowerCase())
      );

      if (foundUsers.length === 0) {
        toast.warning("Không tìm thấy người dùng với email này!");
        setUsers([]);
      } else {
        setUsers(foundUsers);
      }
      setSearched(true);
    } catch (error) {
      console.error(error);
      toast.error("Lỗi tìm kiếm người dùng!");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="user-create">
      {/* Header */}
      <div className="user-create__header">
        <button
          className="user-create__back"
          onClick={() => navigate("/admin/users")}
        >
          <MdArrowBack size={20} />
          <span>Quay lại</span>
        </button>
        <div>
          <h1 className="user-create__title">Tìm kiếm người dùng</h1>
          <p className="user-create__subtitle">
            Nhập email để tìm kiếm và sửa thông tin người dùng.
          </p>
        </div>
      </div>

      {/* Search Card */}
      <div className="user-create__card">
        <form onSubmit={handleSearch} className="user-create__form">
          <div className="user-create__field">
            <label className="user-create__label">
              <MdSearch className="user-create__label-icon" />
              Email <span className="user-create__required">*</span>
            </label>
            <input
              type="email"
              className="user-create__input"
              placeholder="example@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
          </div>

          <div className="user-create__divider" />

          <div className="user-create__actions">
            <button
              type="button"
              className="user-create__btn user-create__btn--cancel"
              onClick={() => navigate("/admin/users")}
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="user-create__btn user-create__btn--save"
              disabled={loading}
            >
              <MdSearch size={18} />
              {loading ? "Đang tìm kiếm..." : "Tìm kiếm"}
            </button>
          </div>
        </form>

        {/* Search Results */}
        {searched && (
          <div style={{ marginTop: "30px", paddingTop: "20px", borderTop: "1px solid #e0e0e0" }}>
            <h3 style={{ marginBottom: "15px" }}>Kết quả tìm kiếm:</h3>
            {users.length === 0 ? (
              <p style={{ color: "#999" }}>Không tìm thấy kết quả nào.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {users.map((user) => (
                  <div
                    key={user.id}
                    style={{
                      padding: "15px",
                      borderRadius: "8px",
                      backgroundColor: "#f5f5f5",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <h4 style={{ margin: "0 0 5px 0" }}>{user.fullName}</h4>
                      <p style={{ margin: "0", fontSize: "14px", color: "#666" }}>
                        {user.email}
                      </p>
                      <p style={{ margin: "5px 0 0 0", fontSize: "12px", color: "#999" }}>
                        Tạo: {formatDate(user.createdAt)}
                      </p>
                    </div>
                    <button
                      className="user-create__btn user-create__btn--save"
                      style={{ marginLeft: "10px" }}
                      onClick={() => navigate(`/admin/users/edit/${user.id}`)}
                    >
                      Sửa
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserSearch;
