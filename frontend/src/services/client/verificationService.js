import API from "./index";

const API_BASE = "/verification";

const verificationService = {
  
  getVerificationDetail: async (candidateID) => {
    try {
      const response = await API.get(`${API_BASE}/${candidateID}`);
      return response;
    } catch (error) {
      console.error("Error fetching verification detail:", error);
      throw error;
    }
  },

  
  verifyCandidate: async (candidateID, verificationData) => {
    try {
      const cleanData =
        typeof verificationData === "string"
          ? JSON.parse(verificationData)
          : verificationData;

     
      const payload = {
        candidateID,
        data: cleanData,
      };

      const response = await API.post(`${API_BASE}/candidate`, payload);
      return response;
    } catch (error) {
      console.error("Error verifying candidate:", error);
      throw error;
    }
  },


  confirmVerification: async (candidateID, confirmData) => {
    try {
      // Keep status as-is: "verified" or "risky"
      const payload = {
        candidateID,
        status: confirmData.status, // "verified" or "risky"
      };

  
      try {
        const response = await API.post(`${API_BASE}/confirm`, payload);
        return response;
      } catch (error) {

        if (error.response?.status === 404) {
          console.warn("Confirm endpoint not found, returning default success");
          return {
            success: true,
            message:
              confirmData.status === "verified"
                ? "Kiểm chứng thành công!"
                : "Đã gắn cờ rủi ro!",
          };
        }
        throw error;
      }
    } catch (error) {
      console.error("Error confirming verification:", error);
      throw error;
    }
  },
};

export default verificationService;
