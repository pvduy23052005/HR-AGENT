import type { IJobReadRepo } from '../../../application/ports/repositories/job.interface';
import { IJobOutputDto } from '../../dtos/job/get.dto';

export class GetJobByIdUseCase {
  constructor(private readonly jobRepo: IJobReadRepo) { }

  async execute(jobID: string): Promise<IJobOutputDto | null> {
    const job = await this.jobRepo.getById(jobID);

    if (!job) return null;

    return job.getDetailJob();
  }
}
