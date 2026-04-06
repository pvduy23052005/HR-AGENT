import type { IJobReadRepo } from '../../../application/ports/repositories/job.interface';
import { IJobOutputDto } from '../../dtos/job/get.dto';

export class GetAllJobUseCase {
  constructor(private readonly jobRepo: IJobReadRepo) { }

  async execute(userID: string): Promise<IJobOutputDto[]> {

    const jobs = await this.jobRepo.getAll(userID);

    return jobs;
  }
}
