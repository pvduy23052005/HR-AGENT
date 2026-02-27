import jwt from "jsonwebtoken";
import * as authRepository from "../../repositories/client/auth.repository.js";
import bcrypt from "bcrypt";

// Login user — business logic
export const login = async (email, password) => {
  const user = await authRepository.findUserByEmail(email);

  if (!user) {
    const error = new Error("Email không tồn tại!");
    error.statusCode = 400;
    throw error;
  }

  if (user.status === "inactive") {
    const error = new Error("Tài khoản đã bị khóa! Vui lòng liên hệ Admin.");
    error.statusCode = 400;
    throw error;
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    const error = new Error("Mật khẩu không chính xác!");
    error.statusCode = 400;
    throw error;
  }

  const payLoad = {
    userID: user.id.toString(),
  };

  const token = jwt.sign(
    payLoad,
    process.env.ACCESS_TOKEN_SECRET || "secret-123",
    { expiresIn: "1d" },
  );

  return {
    token,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      avatar: user.avatar,
    },
  };
};
