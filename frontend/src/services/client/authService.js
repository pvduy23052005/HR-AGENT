import API from "./index";

const authService = {
  // Đăng nhập
  login: async (email, password) => {
    const res = await API.post("/auth/login", { email, password });
    return res;
  },

  // Đăng xuất
  logout: async () => {
    const res = await API.post("/auth/logout");
    return res;
  },
};

export default authService;
