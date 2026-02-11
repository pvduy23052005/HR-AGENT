import API from "./index";

const authServiceAPI = {
  login: async (data) => {
    const res = await API.post("/admin/auth/login", {
      email: data.email,
      password: data.password,
    });

    return res;
  },
};

export default authServiceAPI;
