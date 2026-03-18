import API from "./index";

const candidateService = {

  getAll: async () => {
    const res = await API.get("/candidates");
    return res;
  },

  getById: async (id) => {
    const res = await API.get(`/candidates/${id}`);
    return res;
  },

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
