import type { IJobWriteRepo } from '../../../application/ports/repositories/job.interface';
import { JobEntity } from '../../../domain/job';
import { ICreateJobInputDto } from '../../dtos/job/create.dto';
import { IJobOutputDto } from '../../dtos/job/get.dto';

export class CreateJobUseCase {
  constructor(private readonly jobRepo: IJobWriteRepo) { }

  async execute(jobData: ICreateJobInputDto): Promise<IJobOutputDto | null> {

    if (!jobData.userID || !jobData.title) {
       throw new Error("UserID và Tiêu đề là bắt buộc!");
    }

    const job = JobEntity.createJob(
      jobData.userID,
      jobData.title,
      jobData.description ?? '',
      jobData.requirements ?? []
    )

    const savedJob = await this.jobRepo.create(job);

    if (!savedJob) throw new Error("Tạo mới không thành công!")

    return savedJob.getDetailJob();
  }
}
