import type { JobEntity } from '../../../../domain/entities/client/job';
import type { IJobReadRepo, IJobWriteRepo } from '../../../../domain/repositories/client/job.interface';

export class DeleteJobUseCase {
  constructor(private readonly jobRepo: IJobReadRepo & IJobWriteRepo) { }

  async execute(jobId: string, userID: string): Promise<JobEntity | null> {
    const job = await this.jobRepo.getJobById(jobId);
    if (!job) throw new Error('Công việc không tồn tại!');
    if (job.userID !== userID.toString()) throw new Error('Bạn không có quyền xóa công việc này!');

    return await this.jobRepo.deleteJobById(jobId);
  }
}
