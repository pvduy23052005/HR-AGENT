"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCandidatesUseCase = void 0;
class GetCandidatesUseCase {
    candidateRepo;
    constructor(candidateRepo) {
        this.candidateRepo = candidateRepo;
    }
    async execute() {
        return await this.candidateRepo.getCandidates();
    }
}
exports.GetCandidatesUseCase = GetCandidatesUseCase;
//# sourceMappingURL=get-candidate.use-case.js.map