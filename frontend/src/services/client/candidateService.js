import API from "./index";

const candidateService = {
  // Lấy danh sách ứng viên
  getAll: async () => {
    const res = await API.get("/candidates");
    return res;
  },
};

export default candidateService;
