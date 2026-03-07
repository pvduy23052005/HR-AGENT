import type { JobEntity } from '../../../domain/entities/client/job.entity';
import type * as jobRepository from '../../../infrastructure/database/repositories/client/job.repository';

export const createJob = async (
  jobRepo: typeof jobRepository,
  jobData: Parameters<typeof jobRepository.createJob>[0],
): Promise<JobEntity | null> => {
  return await jobRepo.createJob(jobData);
};

export const updateJob = async (
  jobRepo: typeof jobRepository,
  jobId: string,
  userID: string,
  jobData: Parameters<typeof jobRepository.updateJobById>[1],
): Promise<JobEntity | null> => {
  const job = await jobRepo.getJobById(jobId);
  if (!job) throw new Error('Công việc không tồn tại!');
  if (job.userID !== userID.toString()) throw new Error('Bạn không có quyền chỉnh sửa công việc này!');
  return await jobRepo.updateJobById(jobId, jobData);
};

export const getAllJob = async (
  jobRepo: typeof jobRepository,
  userID: string,
): Promise<(JobEntity | null)[]> => {
  return await jobRepo.getAllJob(userID);
};

export const deleteJob = async (
  jobRepo: typeof jobRepository,
  jobId: string,
  userID: string,
): Promise<JobEntity | null> => {
  const job = await jobRepo.getJobById(jobId);
  if (!job) throw new Error('Công việc không tồn tại!');
  if (job.userID !== userID.toString()) throw new Error('Bạn không có quyền xóa công việc này!');
  return await jobRepo.deleteJobById(jobId);
};
