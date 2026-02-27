import API from "./index";

const authService = {
  // Đăng nhập
  login: async (email, password) => {
    const res = await API.post("/auth/login", { email, password });
    return res;
  },

  // Đăng kí
  signup: async (fullName, email, password, confirmPassword) => {
    const res = await API.post("/auth/signup", {
      fullName,
      email,
      password,
      confirmPassword,
    });
    return res;
  },

  // Đăng xuất
  logout: async () => {
    const res = await API.post("/auth/logout");
    return res;
  },
};

export default authService;
