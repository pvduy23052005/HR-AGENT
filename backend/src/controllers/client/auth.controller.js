import * as authService from "../../services/client/auth.service.js";

// [POST] /auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("=== LOGIN REQUEST ===", { email, password });

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

// [POST] /auth/signup
export const signup = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body;

    const user = await authService.signup(fullName, email, password, confirmPassword);

    res.status(201).json({
      success: true,
      message: "Đăng kí thành công!",
      user: user,
    });
  } catch (error) {
    console.error("Signup Error:", error);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      code: statusCode,
      message: error.message || "Lỗi hệ thống",
    });
  }
};