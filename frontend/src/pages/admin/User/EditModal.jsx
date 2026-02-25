import { useState } from "react";
import { MdClose } from "react-icons/md";
import { toast } from "react-toastify";
import * as userService from "../../../services/admin/userService";

function EditModal({ user, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    fullName: user.fullName || "",
    email: user.email || "",
    password: "",
    status: user.status || "active",
  });
  const [saving, setSaving] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData.fullName || !formData.email) {
      toast.warning("Vui lòng nhập đầy đủ Họ tên và Email!");
      return;
    }

    try {
      setSaving(true);
      const updateData = { ...formData };
      if (!updateData.password) delete updateData.password;
      await userService.updateUser(user._id, updateData);
      toast.success("Cập nhật tài khoản thành công!");
      onSuccess();
    } catch (error) {
      const msg =
        error.response?.data?.message || "Lỗi cập nhật, vui lòng thử lại!";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="users-modal-overlay" onClick={onClose}>
      <div className="users-modal" onClick={(e) => e.stopPropagation()}>
        <div className="users-modal__header">
          <h2 className="users-modal__title">Cập nhật người dùng</h2>
          <button className="users-modal__close" onClick={onClose}>
            <MdClose />
          </button>
        </div>

        <div className="users-modal__body">
          <div className="users-modal__field">
            <label className="users-modal__label">
              Họ tên <span>*</span>
            </label>
            <input
              type="text"
              className="users-modal__input"
              name="fullName"
              placeholder="Nhập họ tên"
              value={formData.fullName}
              onChange={handleInputChange}
            />
          </div>

          <div className="users-modal__field">
            <label className="users-modal__label">
              Email <span>*</span>
            </label>
            <input
              type="email"
              className="users-modal__input"
              name="email"
              placeholder="Nhập email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          <div className="users-modal__field">
            <label className="users-modal__label">Mật khẩu</label>
            <input
              type="password"
              className="users-modal__input"
              name="password"
              placeholder="Để trống nếu không đổi"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>

          <div className="users-modal__field">
            <label className="users-modal__label">Trạng thái</label>
            <select
              className="users-modal__select"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value="active">Hoạt động</option>
              <option value="inactive">Đã khóa</option>
            </select>
          </div>
        </div>

        <div className="users-modal__footer">
          <button
            className="users-modal__btn users-modal__btn--cancel"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            className="users-modal__btn users-modal__btn--save"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditModal;
