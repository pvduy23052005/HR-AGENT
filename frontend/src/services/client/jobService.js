import API from "./index";

const jobService = {
  // Lấy tất cả jobs
  getAll: async () => {
    const res = await API.get("/job");
    return res;
  },

  // Tạo job mới
  create: async (data) => {
    const res = await API.post("/job/create", data);
    return res;
  },

  // Cập nhật job
  update: async (id, data) => {
    const res = await API.patch(`/job/update/${id}`, data);
    return res;
  },

  // Xóa job
  delete: async (id) => {
    const res = await API.delete(`/job/delete/${id}`);
    return res;
  },
};

export default jobService;
