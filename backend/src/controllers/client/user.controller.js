import ForgotPassword from "../../models/forgot-password.model.js";
import { randomNumber } from "../../helpers/randomNumber.helper.js";
import User from "../../models/user.model.js";
import { sendEmail_helper } from "../../helpers/sendMail.helper.js";
import { htmlEmailOtp } from "../../templates/email/otp.js";

// [post] /user/password/forgot
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      email: email,
      deleted: false,
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Email không tồn tại trong hệ thống!",
      });
    }

    // Check if OTP was sent within last 60 seconds
    const recentOtp = await ForgotPassword.findOne({
      email: email,
    }).sort({ createdAt: -1 });

    if (recentOtp) {
      const timeDiff =
        (Date.now() - new Date(recentOtp.createdAt).getTime()) / 1000;
      if (timeDiff < 60) {
        const waitTime = Math.ceil(60 - timeDiff);
        return res.status(429).json({
          success: false,
          message: `Vui lòng đợi ${waitTime} giây trước khi yêu cầu mã OTP mới!`,
        });
      }
    }

    // random forgot password .
    const forgotPasswordRecord = new ForgotPassword({
      email: email,
      otp: randomNumber(8),
    });

    await forgotPasswordRecord.save();

    // 3. send email .
    const subject = "Mã OTP lấy lại mật khẩu";
    const content = htmlEmailOtp(forgotPasswordRecord.otp);
    sendEmail_helper(email, subject, content);

    res.status(200).json({
      success: true,
      message: "Mã OTP đã được gửi đến email của bạn!",
      email: email,
      otp: forgotPasswordRecord.otp,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi gửi mail", error: error.message });
  }
};

// [post] /user/password/otp
export const otpPassword = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: "Vui lòng nhập đầy đủ email và mã OTP!",
      });
    }

    const user = await User.findOne({
      email: email,
      deleted: false,
    });

    if (!user) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: "Email không tồn tại trong hệ thống!",
      });
    }

    const resultOtp = await ForgotPassword.findOne({
      email: email,
      otp: otp,
    });

    if (!resultOtp) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: "OTP không chính xác hoặc đã hết hạn!",
      });
    }

    res.status(200).json({
      code: 200,
      success: true,
      message: "Xác thực OTP thành công!",
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      success: false,
      message: "Lỗi hệ thống",
    });
  }
};

// [post] /user/password/reset
export const resetPassword = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: "Mật khẩu xác nhận không khớp!",
      });
    }

    const otpValid = await ForgotPassword.findOne({
      email: email,
    });

    if (!otpValid) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: "Phiên giao dịch đã hết hạn, vui lòng lấy lại mã OTP!",
      });
    }

    const newPassword = password;

    const user = await User.findOne({ email: email });
    user.password = newPassword;
    await user.save();

    await ForgotPassword.deleteOne({ email: email });

    res.json({
      code: 200,
      message: "Đổi mật khẩu thành công! Vui lòng đăng nhập lại.",
    });
  } catch (error) {
    res.status(500).json({ code: 500, message: "Lỗi đổi mật khẩu" });
  }
};
