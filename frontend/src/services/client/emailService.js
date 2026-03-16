import API from "./index";

const emailService = {
  // Gửi email hàng loạt tới các ứng viên
  sendBulkEmail: async (data) => {
    // data: { candidateIds: [], template: {}, customContent: "" }
    try {
      const res = await API.post("/email/send-bulk", data);
      return res;
    } catch (error) {
      console.error("Error sending bulk email:", error);
      throw error;
    }
  },

  // Gửi email tới một ứng viên
  sendEmail: async (candidateId, data) => {
    try {
      const res = await API.post(`/email/send/${candidateId}`, data);
      return res;
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  },
};

export default emailService;
