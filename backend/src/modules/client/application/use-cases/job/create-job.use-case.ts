import type { IJobSummary } from '../../../domain/entities/job';
import type { IJobWriteRepo } from '../../../application/ports/repositories/job.interface';
import type { IJobData } from '../../../application/ports/repositories/job.interface';
import { JobEntity } from '../../../domain/entities/job';

export class CreateJobUseCase {
  constructor(private readonly jobRepo: IJobWriteRepo) { }

  async execute(jobData: IJobData): Promise<IJobSummary | null> {

    const job = JobEntity.createJob(
      jobData.userID,
      jobData.title,
      jobData.description,
      jobData.requirements
    )

    const savedJob = await this.jobRepo.create(job);
    
    if (!savedJob) throw new Error("Tạo mới không thành công!")

    return savedJob.getSummary();
  }
}
