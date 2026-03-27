import { Request, Response } from 'express';
import { CreateJobUseCase } from '../../../../application/use-cases/client/job/create-job.use-case';
import { UpdateJobUseCase } from '../../../../application/use-cases/client/job/update-job.use-case';
import { GetAllJobUseCase } from '../../../../application/use-cases/client/job/get-all-job.use-case';
import { DeleteJobUseCase } from '../../../../application/use-cases/client/job/delete-job.use-case';
import { GetJobByIdUseCase } from '../../../../application/use-cases/client/job/get-job-by-id.use-case';
import { GetCanidateByJobUseCase } from '../../../../application/use-cases/client/candidate/get-candidate-by-job.use-case';

import { JobRepository } from '../../../../infrastructure/database/repositories/client/job.repository';
import { CandidateRepository } from '../../../../infrastructure/database/repositories/client/candidate.repository';

const jobRepository = new JobRepository();
const candidateRepo = new CandidateRepository();
const createJobUseCase = new CreateJobUseCase(jobRepository);
const updateJobUseCase = new UpdateJobUseCase(jobRepository);
const getAllJobUseCase = new GetAllJobUseCase(jobRepository);
const deleteJobUseCase = new DeleteJobUseCase(jobRepository);
const getJobByIdUseCase = new GetJobByIdUseCase(jobRepository);
const getCandidateByJobUseCase = new GetCanidateByJobUseCase(candidateRepo);

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

// [GET] /job
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

// [GET] /job/:id/candidates 
export const getCandidateByJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const jobID: string = req.params.id.toString() || "";

    console.log(jobID);
    const candidates = await getCandidateByJobUseCase.execute(jobID);

    res.status(200).json({
      success: true,
      candidates: candidates
    });
  } catch (error: unknown) {
    console.log("Get candidate by job error", error);
    const e = error as { message?: string };
    res.status(400).json({ success: false, message: e.message ?? 'Get candidate by job error ' });
  }
}

// [GET] /job/detail/:id
export const getJobById = async (req: Request, res: Response): Promise<void> => {
  try {
    const jobId = req.params['id'] as string;

    const job = await getJobByIdUseCase.execute(jobId);

    if (!job) {
      res.status(404).json({ success: false, message: 'Không tìm thấy công việc!' });
      return;
    }

    res.status(200).json({ success: true, message: 'Thành công', job: job });
  } catch (error: unknown) {
    const e = error as { message?: string };
    res.status(400).json({ success: false, message: e.message ?? 'Đã xảy ra lỗi khi tải thông tin công việc!' });
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
