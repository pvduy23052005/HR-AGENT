import API from "./index";

const aiService = {
  // Phân tích ứng viên bằng AI
  analyzeCandidate: async (data) => {
    const res = await API.post("/ai/analyize", data);
    return res;
  },
};

export default aiService;
