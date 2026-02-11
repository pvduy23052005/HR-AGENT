import AccountAdmin from "../../models/accountAdmin.model.js";
import jwt from "jsonwebtoken"; // Cần cài: pnpm add jsonwebtoken

// [POST] /admin/auth/login
export const loginPost = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({
        code: 400,
        message: "Vui lòng nhập Email!",
      });
    }

    if (!password) {
      return res.status(400).json({
        code: 400,
        message: "Vui lòng nhập mật khẩu!",
      });
    }

    const admin = await AccountAdmin.findOne({
      email: email,
      deleted: false,
    });

    if (!admin) {
      return res.status(400).json({
        code: 400,
        message: "Email không tồn tại!",
      });
    }

    if (admin.status === "inactive") {
      return res.status(400).json({
        code: 400,
        message: "Tài khoản Admin đã bị khóa!",
      });
    }

    if (password !== admin.password) {
      return res.status(400).json({
        code: 400,
        message: "Mật khẩu không chính xác!",
      });
    }

    const payload = {
      userID: admin.id,
    };

    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      path: "/",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Trả về kết quả
    res.status(200).json({
      success: true,
      message: "Đăng nhập Admin thành công!",
      token: token,
      data: {
        id: admin.id,
        fullName: admin.fullName,
        email: admin.email,
        role: admin.role_id,
      },
    });
  } catch (error) {
    console.error("Login Admin Error:", error);
    res.status(500).json({
      code: 500,
      message: "Lỗi hệ thống",
      error: error.message,
    });
  }
};
