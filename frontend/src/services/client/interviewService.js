import API from "./index";

const interviewService = {
  /**
   * Lấy danh sách lịch phỏng vấn của user
   */
  getSchedules: async () => {
    const res = await API.get("/interview");
    return res;
  },

  /**
   * Lấy chi tiết lịch phỏng vấn
   * @param {string} id - ID lịch phỏng vấn
   */
  getScheduleDetail: async (id) => {
    const res = await API.get(`/interview/${id}`);
    return res;
  },

  /**
   * Đặt lịch phỏng vấn và gửi email mời ứng viên
   * @param {Object} data - { candidateID, jobID, time, address, durationMinutes?, notes? }
   */
  schedule: async (data) => {
    const res = await API.post("/interview/schedule", data);
    return res;
  },

  /**
   * Cập nhật lịch phỏng vấn
   * @param {string} id - ID lịch phỏng vấn
   * @param {Object} data - { time?, address?, status?, notes? }
   */
  updateSchedule: async (id, data) => {
    const res = await API.patch(`/interview/${id}`, data);
    return res;
  },

  /**
   * Xóa lịch phỏng vấn
   * @param {string} id - ID lịch phỏng vấn
   */
  deleteSchedule: async (id) => {
    const res = await API.delete(`/interview/${id}`);
    return res;
  },
};


export default interviewService;
