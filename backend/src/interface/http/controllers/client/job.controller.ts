import { Request, Response } from 'express';
import * as jobUseCase from '../../../../application/use-case/client/job.use-case';
import * as jobRepository from '../../../../infrastructure/database/repositories/client/job.repository';

// [POST] /job/create
export const createJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const userID = res.locals.user.id;
    const { title, description, requirements, status } = req.body as {
      title: string;
      description: string;
      requirements: string;
      status?: boolean;
    };

    const newJob = await jobUseCase.createJob(jobRepository, { title, userID, description, requirements, status });
    res.status(201).json({ success: true, message: 'Tạo công việc thành công!', data: newJob });
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
      requirements?: string;
      status?: boolean;
    };

    const updatedJob = await jobUseCase.updateJob(jobRepository, jobId, userID, { title, description, requirements, status });
    res.status(200).json({ success: true, message: 'Cập nhật công việc thành công!', data: updatedJob });
  } catch (error: unknown) {
    const e = error as { message?: string };
    res.status(400).json({ success: false, message: e.message ?? 'Đã xảy ra lỗi khi cập nhật công việc!' });
  }
};

// [GET] /jobs
export const getAllJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const userID = res.locals.user.id;
    const jobs = await jobUseCase.getAllJob(jobRepository, userID);
    res.status(200).json({ success: true, message: 'Thành công', jobs });
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
    await jobUseCase.deleteJob(jobRepository, jobId, userID);
    res.status(200).json({ success: true, message: 'Xóa công việc thành công!' });
  } catch (error: unknown) {
    const e = error as { message?: string };
    res.status(400).json({ success: false, message: e.message ?? 'Đã xảy ra lỗi khi xóa công việc!' });
  }
};
