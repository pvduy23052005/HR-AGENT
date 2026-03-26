import type { JobEntity } from '../../../../domain/entities/client/job';
import type { IJobReadRepo, IJobWriteRepo } from '../../../../domain/repositories/client/job.interface';
import type { IJobData } from '../../../../infrastructure/database/repositories/client/job.repository';

export class UpdateJobUseCase {
  constructor(private readonly jobRepo: IJobReadRepo & IJobWriteRepo) { }

  async execute(
    jobId: string,
    userID: string,
    jobData: Partial<IJobData>,
  ): Promise<JobEntity | null> {
    const job = await this.jobRepo.getJobById(jobId);
    if (!job) throw new Error('Công việc không tồn tại!');
    if (job.userID !== userID.toString()) throw new Error('Bạn không có quyền chỉnh sửa công việc này!');

    return await this.jobRepo.updateJobById(jobId, jobData);
  }
}
