export const createJob = async (jobRepository, jobData) => {
  const newJob = await jobRepository.createJob(jobData);
  return newJob;
};
