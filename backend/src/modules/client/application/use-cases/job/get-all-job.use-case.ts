import type { IJobReadRepo } from '../../../application/ports/repositories/job.interface';
import type { IJobSummary } from '../../../domain/job';

export class GetAllJobUseCase {
  constructor(private readonly jobRepo: IJobReadRepo) { }

  async execute(userID: string): Promise<IJobSummary[]> {

    const jobs = await this.jobRepo.getAll(userID);

    return jobs.map(job => job.getSummary());
  }
}
