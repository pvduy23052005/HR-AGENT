import API from "./index";

const forgotPasswordService = {

  requestForgotPassword: async (email) => {
    console.log(`${email} đã gửi otp thành công`);
    const res = await API.post("/user/password/forgot", { email });
    return res;
  },

 
  verifyOTP: async (email, otp) => {
 
    const res = await API.post("/user/password/otp", { email, otp });
    return res;
  },


  resetPassword: async (email, password, confirmPassword) => {
    const res = await API.post("/user/password/reset", {
      email,
      password,
      confirmPassword,
    });
    return res;
  },

 
  resetNotOTP: async (password, confirmPassword) => {
    const res = await API.post("/user/password/reset-not-otp", {
      password,
      confirmPassword,
    });
    return res;
  },
};

export default forgotPasswordService;
