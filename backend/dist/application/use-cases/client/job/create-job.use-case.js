"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateJobUseCase = void 0;
class CreateJobUseCase {
    jobRepo;
    constructor(jobRepo) {
        this.jobRepo = jobRepo;
    }
    async execute(jobData) {
        const newJob = await this.jobRepo.createJob(jobData);
        return newJob;
    }
}
exports.CreateJobUseCase = CreateJobUseCase;
//# sourceMappingURL=create-job.use-case.js.map