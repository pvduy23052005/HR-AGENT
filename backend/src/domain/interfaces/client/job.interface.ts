import type { JobEntity } from '../../entities/client/job.entity';
import type { IJobData } from '../../../infrastructure/database/repositories/client/job.repository';

export interface IJobRepository {
  createJob(data: IJobData): Promise<JobEntity | null>;

  getAllJob(userID: string): Promise<(JobEntity | null)[]>;

  getJobById(id: string): Promise<JobEntity | null>;

  updateJobById(id: string, data: Partial<IJobData>): Promise<JobEntity | null>;
  
  deleteJobById(id: string): Promise<JobEntity | null>;
}
