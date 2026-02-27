import * as authService from "../../services/admin/auth.service.js";

// [POST] /admin/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { admin, token } = await authService.login(email, password);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Đăng nhập Admin thành công!",
      token: token,
      admin: admin,
    });
  } catch (error) {
    console.error("Login Admin Error:", error);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      code: statusCode,
      success: false,
      message: error.message || "Lỗi hệ thống",
    });
  }
};

// [POST] /admin/auth/logout
export const logout = (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({
      success: true,
      message: "Đăng xuất thành công!",
    });
  } catch (error) {
    console.error("Logout Admin Error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống",
      error: error.message,
    });
  }
};