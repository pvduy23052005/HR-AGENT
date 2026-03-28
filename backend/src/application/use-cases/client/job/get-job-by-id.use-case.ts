import type { IJobReadRepo } from '../../../../domain/repositories/client/job.interface';
import type { IJobDetail } from '../../../../domain/entities/client/job/job.types';

export class GetJobByIdUseCase {
  constructor(private readonly jobRepo: IJobReadRepo) { }

  async execute(jobID: string): Promise<IJobDetail | null> {
    const job = await this.jobRepo.getJobById(jobID);

    if (!job) return null;
    
    return job.getDetailJob();
  }
}
