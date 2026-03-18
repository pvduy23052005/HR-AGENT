import API from "./index";

const reportService = {

  getStatistics: async (filterCriteria, filterDate) => {
    const res = await API.get("/report/statistics", {
      params: { filterCriteria, filterDate }
    });
    return res;
  },
};

export default reportService;
