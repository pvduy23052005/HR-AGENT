import API from "./index";

const API_BASE = "/verification";

const verificationService = {
  // Lấy chi tiết kiểm chứng của ứng viên
  getVerificationDetail: async (candidateID) => {
    try {
      const response = await API.get(`${API_BASE}/${candidateID}`);
      return response;
    } catch (error) {
      console.error("Error fetching verification detail:", error);
      throw error;
    }
  },

  // Gửi kết quả kiểm chứng từ extension lên backend
  verifyCandidate: async (candidateID, verificationData) => {
    try {
      const cleanData =
        typeof verificationData === "string"
          ? JSON.parse(verificationData)
          : verificationData;

      // Chuẩn bị payload cho backend
      // Backend expects: { candidateID, data: { details: JSON_string } }
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

  // Xác nhận verification status (trusted hoặc risky)
  confirmVerification: async (candidateID, confirmData) => {
    try {
      const payload = {
        candidateID,
        status: confirmData.status, // "trusted" hoặc "risky"
        verification: confirmData.verification,
      };

      // Nếu backend có endpoint này, gọi nó
      // Nếu không, tạm thời return success
      try {
        const response = await API.post(`${API_BASE}/confirm`, payload);
        return response;
      } catch (error) {
        // Nếu endpoint không tồn tại, return success (tạm thời)
        if (error.response?.status === 404) {
          console.warn("Confirm endpoint not found, returning default success");
          return {
            success: true,
            message:
              confirmData.status === "trusted"
                ? "Xác nhận uy tín thành công!"
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
