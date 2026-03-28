import API from "./index";

const jobService = {
 
  getAll: async () => {
    const res = await API.get("/job");
    return res;
  },

  getCandidatesByJob: async (id) => {
    const res = await API.get(`/job/${id}/candidates`);
    return res;
  },

  getJobById: async (id) => {
    const res = await API.get(`/job/detail/${id}`);
    return res;
  },

  updateJob: async (id, data) => {
    const res = await API.patch(`/job/update/${id}`, data);
    return res;
  },

  create: async (data) => {
    const res = await API.post("/job/create", data);
    return res;
  },

  delete: async (id) => {
    const res = await API.delete(`/job/delete/${id}`);
    return res;
  },
};

export default jobService;
