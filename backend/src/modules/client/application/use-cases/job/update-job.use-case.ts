import type { IJobReadRepo, IJobWriteRepo } from '../../../application/ports/repositories/job.interface';
import { IUpdateJobInputDto } from '../../dtos/job/create.dto';
import { IJobOutputDto } from '../../dtos/job/get.dto';

export class UpdateJobUseCase {
  constructor(private readonly jobRepo: IJobReadRepo & IJobWriteRepo) { }

  async execute(
    jobId: string,
    userID: string,
    jobData: IUpdateJobInputDto,
  ): Promise<IJobOutputDto | null> {
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

    return jobUpdated?.getDetailJob();
  }
}
