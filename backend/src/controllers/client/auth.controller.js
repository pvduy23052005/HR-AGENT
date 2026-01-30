import User from "../../models/user.model.js";

// [post] /auth/login
export const loginPost = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email: email,
      deleted: false,
    });

    if (!user) {
      return res.status(400).json({
        code: 400,
        message: "Email không tồn tại!",
      });
    }

    if (user.status === "inactive") {
      return res.status(400).json({
        code: 400,
        message: "Tài khoản đã bị khóa! Vui lòng liên hệ Admin.",
      });
    }

    // hash password.

    if (!passwordMatch) {
      return res.status(400).json({
        code: 400,
        message: "Mật khẩu không chính xác!",
      });
    }

    // res.cookie("token", user.id, {
    //   httpOnly: true,
    //   expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    // });

    res.json({
      code: 200,
      message: "Đăng nhập thành công!",
      user: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: 500,
      message: "Lỗi hệ thống",
      error: error.message,
    });
  }
};
