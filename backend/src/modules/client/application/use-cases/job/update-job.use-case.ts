import type { IJobSummary } from '../../../domain/job';
import type { IJobReadRepo, IJobWriteRepo, IJobData } from '../../../application/ports/repositories/job.interface';

export class UpdateJobUseCase {
  constructor(private readonly jobRepo: IJobReadRepo & IJobWriteRepo) { }

  async execute(
    jobId: string,
    userID: string,
    jobData: Partial<IJobData>,
  ): Promise<IJobSummary | null> {
    const job = await this.jobRepo.getById(jobId);
    if (!job) throw new Error('Công việc không tồn tại!');

    const isOwner = job.isOwner(userID);

    if (!isOwner) throw new Error("Bạn không có quyền!");

    job.update(
      jobData.title ?? job.getTitle(),
      jobData.description ?? job.getDescription(),
      jobData.requirements ?? job.getRequirements()
    )

    const jobUpdated = await this.jobRepo.update(job);

    if (!jobUpdated) throw new Error("Cập nhật thất bại!");

    return jobUpdated?.getSummary();
  }
}
