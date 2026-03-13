"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteJob = exports.getAllJob = exports.updateJob = exports.createJob = void 0;
const create_job_use_case_1 = require("../../../../application/use-cases/client/job/create-job.use-case");
const update_job_use_case_1 = require("../../../../application/use-cases/client/job/update-job.use-case");
const get_all_job_use_case_1 = require("../../../../application/use-cases/client/job/get-all-job.use-case");
const delete_job_use_case_1 = require("../../../../application/use-cases/client/job/delete-job.use-case");
const job_repository_1 = require("../../../../infrastructure/database/repositories/client/job.repository");
const jobRepository = new job_repository_1.JobRepository();
const createJobUseCase = new create_job_use_case_1.CreateJobUseCase(jobRepository);
const updateJobUseCase = new update_job_use_case_1.UpdateJobUseCase(jobRepository);
const getAllJobUseCase = new get_all_job_use_case_1.GetAllJobUseCase(jobRepository);
const deleteJobUseCase = new delete_job_use_case_1.DeleteJobUseCase(jobRepository);
// [POST] /job/create
const createJob = async (req, res) => {
    try {
        const userID = res.locals.user.id;
        const { title, description, requirements, status } = req.body;
        const newJob = await createJobUseCase.execute({ title, userID, description, requirements, status });
        res.status(201).json({ success: true, message: 'Tạo công việc thành công!', newJob: newJob });
    }
    catch (error) {
        const e = error;
        res.status(400).json({ success: false, message: e.message ?? 'Đã xảy ra lỗi khi tạo công việc!' });
    }
};
exports.createJob = createJob;
// [PATCH] /job/update/:id
const updateJob = async (req, res) => {
    try {
        const userID = res.locals.user.id;
        const jobId = req.params['id'];
        const { title, description, requirements, status } = req.body;
        const updatedJob = await updateJobUseCase.execute(jobId, userID, { title, description, requirements, status });
        res.status(200).json({
            success: true,
            message: 'Cập nhật công việc thành công!',
            updatedJob: updatedJob
        });
    }
    catch (error) {
        const e = error;
        res.status(400).json({ success: false, message: e.message ?? 'Đã xảy ra lỗi khi cập nhật công việc!' });
    }
};
exports.updateJob = updateJob;
// [GET] /jobs
const getAllJob = async (req, res) => {
    try {
        const userID = res.locals.user.id;
        const jobs = await getAllJobUseCase.execute(userID);
        res.status(200).json({ success: true, message: 'Thành công', jobs: jobs });
    }
    catch (error) {
        const e = error;
        res.status(400).json({ success: false, message: e.message ?? 'Đã xảy ra lỗi khi tải danh sách công việc!' });
    }
};
exports.getAllJob = getAllJob;
// [DELETE] /job/delete/:id
const deleteJob = async (req, res) => {
    try {
        const userID = res.locals.user.id;
        const jobId = req.params['id'];
        await deleteJobUseCase.execute(jobId, userID);
        res.status(200).json({ success: true, message: 'Xóa công việc thành công!' });
    }
    catch (error) {
        const e = error;
        res.status(400).json({ success: false, message: e.message ?? 'Đã xảy ra lỗi khi xóa công việc!' });
    }
};
exports.deleteJob = deleteJob;
//# sourceMappingURL=job.controller.js.map