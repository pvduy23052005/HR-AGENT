"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateJobUseCase = void 0;
class UpdateJobUseCase {
    jobRepo;
    constructor(jobRepo) {
        this.jobRepo = jobRepo;
    }
    async execute(jobId, userID, jobData) {
        const job = await this.jobRepo.getJobById(jobId);
        if (!job)
            throw new Error('Công việc không tồn tại!');
        if (job.userID !== userID.toString())
            throw new Error('Bạn không có quyền chỉnh sửa công việc này!');
        return await this.jobRepo.updateJobById(jobId, jobData);
    }
}
exports.UpdateJobUseCase = UpdateJobUseCase;
//# sourceMappingURL=update-job.use-case.js.map