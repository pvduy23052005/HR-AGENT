import API from "./index";

const authServiceAPI = {
  login: (data) => {
    return API.post("/admin/auth/login", data);
  },
};

export default authServiceAPI;
