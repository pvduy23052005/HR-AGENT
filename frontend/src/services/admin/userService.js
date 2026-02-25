import API from "./index.js";

export const getUsers = async () => {
  return await API.get("/admin/users");
};

export const createUser = async (data) => {
  return await API.post("/admin/users/create", data);
};

export const changeStatus = async (id, status) => {
  return await API.post("/admin/users/change-status", {
    id: id,
    status: status,
  });
};
