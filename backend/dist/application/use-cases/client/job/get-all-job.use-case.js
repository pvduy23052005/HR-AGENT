"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllJobUseCase = void 0;
class GetAllJobUseCase {
    jobRepo;
    constructor(jobRepo) {
        this.jobRepo = jobRepo;
    }
    async execute(userID) {
        return await this.jobRepo.getAllJob(userID);
    }
}
exports.GetAllJobUseCase = GetAllJobUseCase;
//# sourceMappingURL=get-all-job.use-case.js.map