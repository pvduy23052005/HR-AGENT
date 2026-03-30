import type { JobEntity } from '../../../domain/entities/job/job.entity';

export interface IJobData {
  title: string;
  userID: string;
  description: string;
  requirements: string[];
  status?: boolean;
}

export interface IJobReadRepo {
  getAll(userID: string): Promise<(JobEntity[])>;

  getById(id: string): Promise<JobEntity | null>;
}

export interface IJobWriteRepo {
  create(job: JobEntity): Promise<JobEntity | null>;

  update(job: JobEntity): Promise<JobEntity | null>;
}