import type { IJobSummary } from '../../../../domain/entities/client/job';
import type { IJobWriteRepo } from '../../../../domain/repositories/client/job.interface';
import type { IJobData } from '../../../../domain/repositories/client/job.interface';

export class CreateJobUseCase {
  constructor(private readonly jobRepo: IJobWriteRepo) { }

  async execute(jobData: IJobData): Promise<IJobSummary | null> {

    const newJob = await this.jobRepo.createJob(jobData);

    if (!newJob) throw new Error("Tạo mới không thành công!")

    return newJob?.getSummary();
  }
}
