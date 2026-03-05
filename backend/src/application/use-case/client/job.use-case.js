export const createJob = async (jobRepository, jobData) => {
  const newJob = await jobRepository.createJob(jobData);
  return newJob;
};

export const updateJob = async (jobRepository, jobId, userID, jobData) => {
  const job = await jobRepository.getJobById(jobId);

  if (!job) {
    throw new Error("Công việc không tồn tại!");
  }

  if (job.userID !== userID.toString()) {
    throw new Error("Bạn không có quyền chỉnh sửa công việc này!");
  }

  const updatedJob = await jobRepository.updateJobById(jobId, jobData);
  return updatedJob;
};
