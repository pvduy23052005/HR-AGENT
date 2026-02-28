import * as authService from "../../services/client/auth.service.js";

// [POST] /auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { token, user } = await authService.login(email, password);

    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    res.json({
      code: 200,
      message: "Đăng nhập thành công!",
      token: token,
      user: user,
    });
  } catch (error) {
    console.error("Login Error:", error);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      code: statusCode,
      message: error.message || "Lỗi hệ thống",
    });
  }
};