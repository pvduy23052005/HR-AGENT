import type { IJobSummary } from '../../../domain/entities/job';
import type { IJobReadRepo, IJobWriteRepo, IJobData } from '../../../application/ports/repositories/job.interface';

export class UpdateJobUseCase {
  constructor(private readonly jobRepo: IJobReadRepo & IJobWriteRepo) { }

  async execute(
    jobId: string,
    userID: string,
    jobData: Partial<IJobData>,
  ): Promise<IJobSummary | null> {
    const job = await this.jobRepo.getJobById(jobId);
    if (!job) throw new Error('Công việc không tồn tại!');

    if (job.getUserID() !== userID.toString()) throw new Error('Bạn không có quyền chỉnh sửa công việc này!');

    const jobUpdated = await this.jobRepo.updateJobById(jobId, jobData);

    if (!jobUpdated) throw new Error("Cập nhật thất bại!");

    return jobUpdated?.getSummary();
  }
}
