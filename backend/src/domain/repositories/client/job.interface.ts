import type { JobEntity } from '../../entities/client/job';

export interface IJobData {
  title: string;
  userID: string;
  description: string;
  requirements: string[];
  status?: boolean;
}

export interface IJobReadRepo {
  getAllJob(userID: string): Promise<(JobEntity[])>;

  getJobById(id: string): Promise<JobEntity | null>;
}

export interface IJobWriteRepo {
  createJob(data: IJobData): Promise<JobEntity | null>;

  updateJobById(id: string, data: Partial<IJobData>): Promise<JobEntity | null>;

  deleteJobById(id: string): Promise<JobEntity | null>;
}