import type { IJobReadRepo, IJobWriteRepo } from '../../../application/ports/repositories/job.interface';

export class DeleteJobUseCase {
  constructor(private readonly jobRepo: IJobReadRepo & IJobWriteRepo) { }

  async execute(jobId: string, userID: string): Promise<string | null | undefined> {
    const job = await this.jobRepo.getById(jobId);
    if (!job) throw new Error('Công việc không tồn tại!');

    const isOwner = job.isOwner(userID);

    if (!isOwner) throw new Error("Bạn không có quyền");

    job.delete(true);

    const deletedJob = await this.jobRepo.update(job);

    if (!deletedJob) throw new Error("Xóa thất bại!");

    return deletedJob?.getId();
  }
}
