import type { JobEntity } from '../../../domain/job/job.entity';
import type { IJobSummary } from '../../../domain/job/job.types';

export interface IJobReadRepo {
  getAll(userID: string): Promise<IJobSummary[]>;

  getById(id: string): Promise<JobEntity | null>;
}

export interface IJobWriteRepo {
  create(job: JobEntity): Promise<JobEntity | null>;

  update(job: JobEntity): Promise<JobEntity | null>;
}