import bcrypt from "bcrypt";
import { randomNumber } from "../../helpers/randomNumber.helper.js";
import { sendEmail_helper } from "../../utils/sendMail.helper.js";
import { htmlEmailOtp } from "../../templates/email/otp.js";
import * as userRepository from "../../repositories/client/user.repository.js";
import * as otpRepository from "../../repositories/client/otp.repository.js";

export const forgotPassword = async (email) => {
  const user = await userRepository.findUserByEmail(email);

  if (!user) {
    const error = new Error("Email không tồn tại trong hệ thống!");
    error.statusCode = 400;
    throw error;
  }

  const recentOtp = await otpRepository.findRecentOTP(email);

  if (recentOtp) {
    const timeDiff =
      (Date.now() - new Date(recentOtp.createdAt).getTime()) / 1000;
    if (timeDiff < 60) {
      const waitTime = Math.ceil(60 - timeDiff);
      const error = new Error(
        `Vui lòng đợi ${waitTime} giây trước khi yêu cầu mã OTP mới!`,
      );
      error.statusCode = 400;
      throw error;
    }
  }

  const otp = randomNumber(8);
  const record = await otpRepository.createOTP(email, otp);

  const subject = "Mã OTP lấy lại mật khẩu";
  const content = htmlEmailOtp(record.otp);
  sendEmail_helper(email, subject, content);

  return {
    email: email,
    otp: record.otp,
  };
};

export const verifyOtp = async (email, otp) => {
  const user = await userRepository.findUserByEmail(email);

  if (!user) {
    const error = new Error("Email không tồn tại trong hệ thống!");
    error.statusCode = 400;
    throw error;
  }

  const resultOtp = await otpRepository.findByEmailAndOTP(email, otp);

  if (!resultOtp) {
    const error = new Error("OTP không chính xác hoặc đã hết hạn!");
    error.statusCode = 400;
    throw error;
  }
};

export const resetPassword = async (email, password, confirmPassword) => {
  if (password !== confirmPassword) {
    const error = new Error("Mật khẩu xác nhận không khớp!");
    error.statusCode = 400;
    throw error;
  }

  const otpSession = await otpRepository.findOTPByEmail(email);

  if (!otpSession) {
    const error = new Error(
      "Phiên giao dịch đã hết hạn, vui lòng lấy lại mã OTP!",
    );
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await userRepository.updateUserPassword(email, hashedPassword);
  await otpRepository.deleteOTP(email);
};