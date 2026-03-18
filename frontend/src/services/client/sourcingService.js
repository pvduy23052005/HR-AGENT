import api from "./index";

const sourcingService = {
  // Trigger sourcing from GitHub / LinkedIn
  searchCandidates: (data) => {
    return api.post("/sourcing/search", data);
  },

  // Get saved leads (optional params: ?jobID=&source=)
  getLeads: (params) => {
    return api.get("/sourcing/leads", { params });
  },

  // Update lead status
  updateLeadStatus: (id, status) => {
    return api.patch(`/sourcing/leads/${id}/status`, { status });
  },

  // Remove a lead
  deleteLead: (id) => {
    return api.delete(`/sourcing/leads/${id}`);
  },
};

export default sourcingService;
