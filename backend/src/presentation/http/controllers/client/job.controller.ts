import { Request, Response } from 'express';
import { CreateJobUseCase } from '../../../../application/use-cases/client/job/create-job.use-case';
import { UpdateJobUseCase } from '../../../../application/use-cases/client/job/update-job.use-case';
import { GetAllJobUseCase } from '../../../../application/use-cases/client/job/get-all-job.use-case';
import { DeleteJobUseCase } from '../../../../application/use-cases/client/job/delete-job.use-case';
import { JobRepository } from '../../../../infrastructure/database/repositories/client/job.repository';

const jobRepository = new JobRepository();
const createJobUseCase = new CreateJobUseCase(jobRepository);
const updateJobUseCase = new UpdateJobUseCase(jobRepository);
const getAllJobUseCase = new GetAllJobUseCase(jobRepository);
const deleteJobUseCase = new DeleteJobUseCase(jobRepository);

// [POST] /job/create
export const createJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const userID = res.locals.user.id;
    const { title, description, requirements, status } = req.body as {
      title: string;
      description?: string;
      requirements?: string[];
      status?: boolean;
    };

    const newJob = await createJobUseCase.execute({ title, userID, description: description ?? '', requirements: requirements ?? [], status });

    res.status(201).json({ success: true, message: 'Tạo công việc thành công!', newJob: newJob });
  } catch (error: unknown) {
    const e = error as { message?: string };
    res.status(400).json({ success: false, message: e.message ?? 'Đã xảy ra lỗi khi tạo công việc!' });
  }
};

// [PATCH] /job/update/:id
export const updateJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const userID = res.locals.user.id;
    const jobId = req.params['id'] as string;

    const { title, description, requirements, status } = req.body as {
      title?: string;
      description?: string;
      requirements?: string[];
      status?: boolean;
    };

    const updatedJob = await updateJobUseCase.execute(jobId, userID, { title, description, requirements, status });

    res.status(200).json({
      success: true,
      message: 'Cập nhật công việc thành công!',
      updatedJob: updatedJob
    });
  } catch (error: unknown) {
    const e = error as { message?: string };
    res.status(400).json({ success: false, message: e.message ?? 'Đã xảy ra lỗi khi cập nhật công việc!' });
  }
};

// [GET] /jobs
export const getAllJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const userID = res.locals.user.id;

    const jobs = await getAllJobUseCase.execute(userID);

    res.status(200).json({ success: true, message: 'Thành công', jobs: jobs });
  } catch (error: unknown) {
    const e = error as { message?: string };
    res.status(400).json({ success: false, message: e.message ?? 'Đã xảy ra lỗi khi tải danh sách công việc!' });
  }
};

// [DELETE] /job/delete/:id
export const deleteJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const userID = res.locals.user.id;
    const jobId = req.params['id'] as string;

    await deleteJobUseCase.execute(jobId, userID);

    res.status(200).json({ success: true, message: 'Xóa công việc thành công!' });
  } catch (error: unknown) {
    const e = error as { message?: string };
    res.status(400).json({ success: false, message: e.message ?? 'Đã xảy ra lỗi khi xóa công việc!' });
  }
};
