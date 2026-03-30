import type { IJobSummary } from '../../../domain/entities/job';
import type { IJobWriteRepo } from '../../../application/ports/repositories/job.interface';
import type { IJobData } from '../../../application/ports/repositories/job.interface';

export class CreateJobUseCase {
  constructor(private readonly jobRepo: IJobWriteRepo) { }

  async execute(jobData: IJobData): Promise<IJobSummary | null> {

    const newJob = await this.jobRepo.createJob(jobData);

    if (!newJob) throw new Error("Tạo mới không thành công!")

    return newJob?.getSummary();
  }
}
