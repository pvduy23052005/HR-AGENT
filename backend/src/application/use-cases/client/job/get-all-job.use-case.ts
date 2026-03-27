import type { IJobReadRepo } from '../../../../domain/repositories/client/job.interface';
import type { IJobSummary } from '../../../../domain/entities/client/job';

export class GetAllJobUseCase {
  constructor(private readonly jobRepo: IJobReadRepo) { }

  async execute(userID: string): Promise<IJobSummary[]> {

    const jobs = await this.jobRepo.getAllJob(userID);

    return jobs.map(job => job.getSummary());
  }
}
