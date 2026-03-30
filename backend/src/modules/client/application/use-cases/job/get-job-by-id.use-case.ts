import type { IJobReadRepo } from '../../../application/ports/repositories/job.interface';
import type { IJobDetail } from '../../../domain/entities/job/job.types';

export class GetJobByIdUseCase {
  constructor(private readonly jobRepo: IJobReadRepo) { }

  async execute(jobID: string): Promise<IJobDetail | null> {
    const job = await this.jobRepo.getById(jobID);

    if (!job) return null;

    return job.getDetailJob();
  }
}
