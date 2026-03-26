import type { JobEntity } from '../../../../domain/entities/client/job';
import type { IJobReadRepo } from '../../../../domain/repositories/client/job.interface';

export class GetAllJobUseCase {
  constructor(private readonly jobRepo: IJobReadRepo) { }

  async execute(userID: string): Promise<(JobEntity | null)[]> {

    return await this.jobRepo.getAllJob(userID);
  }
}
