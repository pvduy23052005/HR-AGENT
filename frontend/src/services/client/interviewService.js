import API from "./index";

const interviewService = {

  schedule: async (data) => {
    const res = await API.post("/interview/schedule", data);
    return res;
  },


};


export default interviewService;
