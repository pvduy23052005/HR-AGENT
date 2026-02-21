import User from "../../models/user.model.js";
import jwt from "jsonwebtoken";
import ForgotPassword from "../../models/forgot-password.model.js";
import * as sendMailHelper from "../../helpers/sendMail.helper.js";
import * as randomNumberHelper from "../../helpers/randomNumber.helper.js";

// [POST] /auth/login
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

    if (password !== user.password) {
      return res.status(400).json({
        code: 400,
        message: "Mật khẩu không chính xác!",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.ACCESS_TOKEN_SECRET || "secret-123",
      { expiresIn: "1d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    res.json({
      code: 200,
      message: "Đăng nhập thành công!",
      token: token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        avatar: user.avatar,
      },
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

// [POST] /auth/forgot-password
export const forgotPasswordPost = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        code: 400,
        message: "Vui lòng nhập email!",
      });
    }

    const user = await User.findOne({
      email: email,
      deleted: false,
    });

    if (!user) {
      return res.status(400).json({
        code: 400,
        message: "Email không tồn tại trong hệ thống!",
      });
    }

    // Tạo mã xác nhận
    const verificationCode = randomNumberHelper.randomNumber();

    // Lưu mã xác nhận vào database
    await ForgotPassword.updateOne(
      { email: email },
      {
        email: email,
        code: verificationCode,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 phút
      },
      { upsert: true },
    );

    // Gửi email với mã xác nhận
    const subject = "Yêu cầu đặt lại mật khẩu";
    const html = `
      <h2>Yêu cầu đặt lại mật khẩu</h2>
      <p>Xin chào ${user.fullName || "người dùng"},</p>
      <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
      <p><strong>Mã xác nhận của bạn:</strong> <h3>${verificationCode}</h3></p>
      <p>Mã này sẽ hết hạn trong 15 phút.</p>
      <p>Nếu bạn không yêu cầu điều này, vui lòng bỏ qua email này.</p>
      <p>Trân trọng,<br/>Đội ngũ HR-Agent</p>
    `;

    await sendMailHelper.sendMail({
      email: email,
      subject: subject,
      html: html,
    });

    return res.json({
      code: 200,
      message: "Mã xác nhận đã được gửi đến email của bạn!",
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