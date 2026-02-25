import API from "./index.js";

export const getUsers = async () => {
  return await API.get("/admin/users");
};

export const createUser = async (data) => {
  return await API.post("/admin/users/create", data);
};

export const updateUser = async (id, data) => {
  return await API.patch(`/admin/users/update/${id}`, data);
};

export const deleteUser = async (id) => {
  return await API.delete(`/admin/users/delete/${id}`);
};
