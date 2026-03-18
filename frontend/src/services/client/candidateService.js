import API from "./index";

const candidateService = {
  // Lấy danh sách ứng viên
  getAll: async () => {
    const res = await API.get("/candidates");
    return res;
  },

  // Lấy chi tiết 1 ứng viên (cũ)
  getById: async (id) => {
    const res = await API.get(`/candidates/${id}`);
    return res;
  },

  // Lấy chi tiết ứng viên (API mới)
  getCandidateDetail: async (id) => {
    const res = await API.get(`/candidates/${id}`);
    return res;
  },

  updateStatus: async (id, status) => {
    const res = await API.patch(`/candidates/change-status/${id}`, { status });
    return res;
  }
};

export default candidateService;
