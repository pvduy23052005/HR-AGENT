import { randomNumber } from "../../../helpers/randomNumber.helper.js";
import { htmlEmailOtp } from "../../../templates/email/otp.js";

export const forgotPassword = async (
  userRepository,
  otpRepository,
  mailService,
  email,
) => {
  const user = await userRepository.findUserByEmail(email);

  

  if (!user) {
    throw new Error("Email không tồn tại trong hệ thống!");
  }

  const recentOtp = await otpRepository.findRecentOTP(email);

  if (recentOtp) {
    const secondsPassed =
      (Date.now() - new Date(recentOtp.createdAt).getTime()) / 1000;
    if (secondsPassed < 60) {
      throw new Error(
        `Vui lòng đợi ${Math.ceil(60 - secondsPassed)} giây trước khi yêu cầu mã mới!`,
      );
    }
  }

  const otp = randomNumber(6);
  const record = await otpRepository.createOTP(email, otp);

  const subject = "Mã OTP lấy lại mật khẩu";
  const content = htmlEmailOtp(record.otp);
  await mailService.sendEmail(email, subject, content);

  return {
    email: email,
  };
};

export const verifyOtp = async (userRepository, otpRepository, email, otp) => {
  const user = await userRepository.findUserByEmail(email);

  if (!user) {
    throw new Error("Email không tồn tại trong hệ thống!");
  }

  const resultOtp = await otpRepository.findByEmailAndOTP(email, otp);

  if (!resultOtp) {
    throw new Error("OTP không chính xác hoặc đã hết hạn!");
  }
};

export const resetPassword = async (
  userRepository,
  otpRepository,
  passwordService,
  email,
  password,
  confirmPassword,
) => {
  if (password !== confirmPassword) {
    throw new Error("Mật khẩu xác nhận không khớp!");
  }

  const otpSession = await otpRepository.findOTPByEmail(email);

  if (!otpSession) {
    throw new Error("Phiên giao dịch đã hết hạn, vui lòng lấy lại mã OTP!");
  }

  const user = await userRepository.findUserByEmail(email);
  if (!user) {
    throw new Error("Email không tồn tại trong hệ thống!");
  }

  const hashedPassword = await passwordService.hash(password);

  await userRepository.updateUserPassword(email, hashedPassword);
  await otpRepository.deleteOTP(email);
};
