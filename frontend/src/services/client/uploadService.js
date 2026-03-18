import API from "./index";

const uploadService = {

  uploadCV: async (file, jobID) => {
    const formData = new FormData();
    formData.append("cv", file);
    if (jobID) formData.append("jobID", jobID);

    const res = await API.post("/upload/cv", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res;
  },
};

export default uploadService;
