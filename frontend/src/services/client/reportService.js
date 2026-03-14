import API from "./index";

const reportService = {
  // Lấy dữ liệu thống kê
  getStatistics: async (filterCriteria, filterDate) => {
    const res = await API.get("/report/statistics", {
      params: { filterCriteria, filterDate }
    });
    return res;
  },
};

export default reportService;
