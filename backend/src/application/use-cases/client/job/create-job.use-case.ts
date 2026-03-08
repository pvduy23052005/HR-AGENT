import type { JobEntity } from '../../../../domain/entities/client/job.entity';
import type { IJobRepository } from '../../../../domain/interfaces/client/job.interface';
import type { IJobData } from '../../../../infrastructure/database/repositories/client/job.repository';

export class CreateJobUseCase {
  constructor(private readonly jobRepo: IJobRepository) { }

  async execute(jobData: IJobData): Promise<JobEntity | null> {

    const newJob = await this.jobRepo.createJob(jobData);

    return newJob;
  }
}
