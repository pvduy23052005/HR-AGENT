import jwt from "jsonwebtoken";
import * as authRepository from "../../repositories/admin/auth.repository.js";

// Login admin — business logic
export const login = async (email, password) => {
  const admin = await authRepository.findAccountByEmail(email);

  if (!admin) {
    const error = new Error("Email không tồn tại!");
    error.statusCode = 400;
    throw error;
  }

  if (admin.status === "inactive") {
    const error = new Error("Tài khoản Admin đã bị khóa!");
    error.statusCode = 400;
    throw error;
  }

  if (password !== admin.password) {
    const error = new Error("Mật khẩu không chính xác!");
    error.statusCode = 400;
    throw error;
  }

  const payload = { userID: admin.id };

  const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });

  return {
    token,
    admin: {
      id: admin.id,
      fullName: admin.fullName,
      email: admin.email,
      role: admin.role_id,
    },
  };
};