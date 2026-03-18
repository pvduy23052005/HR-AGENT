import API from "./index";

const aiService = {
  // Phân tích ứng viên bằng AI
  analyzeCandidate: async (data) => {
    const res = await API.post("/ai/analyze", data);
    return res;
  },
};

export default aiService;
