import API from "./index";

const authService = {

  login: async (email, password) => {
    const res = await API.post("/auth/login", { email, password });
    return res;
  },


  logout: async () => {
    const res = await API.post("/auth/logout");
    return res;
  },
};

export default authService;
