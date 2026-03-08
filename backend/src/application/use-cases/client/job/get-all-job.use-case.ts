import type { JobEntity } from '../../../../domain/entities/client/job.entity';
import type { IJobRepository } from '../../../../domain/interfaces/client/job.interface';

export class GetAllJobUseCase {
  constructor(private readonly jobRepo: IJobRepository) { }

  async execute(userID: string): Promise<(JobEntity | null)[]> {

    return await this.jobRepo.getAllJob(userID);
  }
}
