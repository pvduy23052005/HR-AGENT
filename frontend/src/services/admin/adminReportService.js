import API from "./index.js";

const adminReportService = {
  /**
   * Lấy thống kê hệ thống (tổng hợp từ tất cả HR)
   * @param {string} filterCriteria - Tiêu chí lọc: 'Theo tháng', 'Theo quý', 'Theo năm'
   * @param {string} filterDate - Ngày tháng (YYYY-MM hoặc YYYY)
   * @param {string|null} hrId - ID HR (null = tất cả HR)
   * @returns {Promise<Object>}
   */
  getSystemStatistics: async (filterCriteria, filterDate, hrId = null) => {
    try {
      const params = { filterCriteria, filterDate };
      if (hrId) params.hrId = hrId;

      const res = await API.get("/admin/report/statistics", { params });

      if (!res.success) {
        throw new Error(res.message || 'Không thể lấy dữ liệu thống kê');
      }

      return res;
    } catch (error) {
      console.error("❌ Error getting system statistics:", error.message);
      throw error;
    }
  },

  /**
   * Lấy danh sách tất cả tài khoản HR
   * @returns {Promise<Object>}
   */
  getAllHRs: async () => {
    try {
      const res = await API.get("/admin/report/users");

      if (!res.success) {
        throw new Error(res.message || 'Không thể lấy danh sách HR');
      }

      return res;
    } catch (error) {
      console.error("❌ Error getting HRs list:", error.message);
      throw error;
    }
  },

  /**
   * Xuất thống kê ra file (PDF/Excel)
   * @param {string} filterCriteria - Tiêu chí lọc
   * @param {string} filterDate - Ngày tháng
   * @param {string} format - 'pdf' hoặc 'excel'
   * @returns {Promise<Object>}
   */
  exportStatistics: async (filterCriteria, filterDate, format = 'pdf') => {
    try {
      // Validate format
      if (!['pdf', 'excel'].includes(format)) {
        throw new Error('Định dạng không hợp lệ. Chỉ hỗ trợ: pdf, excel');
      }

      const params = { filterCriteria, filterDate, format };
      const res = await API.get("/admin/report/export", { params });

      if (!res.success) {
        throw new Error(res.message || 'Không thể xuất dữ liệu');
      }

      return res;
    } catch (error) {
      console.error("❌ Error exporting statistics:", error.message);
      throw error;
    }
  }
};

export default adminReportService;
