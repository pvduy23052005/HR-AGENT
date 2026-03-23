import API from "./index.js";

export const getUsers = async () => {
  return await API.get("/admin/users");
};

export const getUserById = async (id) => {
  return await API.get(`/admin/users/${id}`);
};

export const createUser = async (data) => {
  return await API.post("/admin/users/create", data);
};

export const updateUser = async (id, data) => {
  return await API.put(`/admin/users/${id}`, data);
};

export const changeStatus = async (id, status) => {
  console.log(id);
  console.log(status);
  return await API.post("/admin/users/change-status", {
    id: id,
    status: status,
  });
};
