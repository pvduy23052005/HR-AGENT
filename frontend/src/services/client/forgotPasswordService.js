import API from "./index";

const forgotPasswordService = {
  // Bước 1: Gửi email yêu cầu OTP
  requestForgotPassword: async (email) => {
    const res = await API.post("/user/password/forgot", { email });
    return res;
  },

  // Bước 2: Xác nhận OTP
  verifyOTP: async (email, otp) => {
    const res = await API.post("/user/password/otp", { email, otp });
    return res;
  },

  // Bước 3: Reset mật khẩu
  resetPassword: async (email, password, confirmPassword) => {
    const res = await API.post("/user/password/reset", {
      email,
      password,
      confirmPassword,
    });
    return res;
  },
};

export default forgotPasswordService;
