import API from "./index";

const candidateService = {
  // Lấy danh sách ứng viên
  getAll: async () => {
    const res = await API.get("/candidates");
    return res;
  },

  // Lấy chi tiết 1 ứng viên
  getById: async (id) => {
    const res = await API.get(`/candidates/${id}`);
    return res;
  },
};

export default candidateService;
