"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteJobUseCase = void 0;
class DeleteJobUseCase {
    jobRepo;
    constructor(jobRepo) {
        this.jobRepo = jobRepo;
    }
    async execute(jobId, userID) {
        const job = await this.jobRepo.getJobById(jobId);
        if (!job)
            throw new Error('Công việc không tồn tại!');
        if (job.userID !== userID.toString())
            throw new Error('Bạn không có quyền xóa công việc này!');
        return await this.jobRepo.deleteJobById(jobId);
    }
}
exports.DeleteJobUseCase = DeleteJobUseCase;
//# sourceMappingURL=delete-job.use-case.js.map