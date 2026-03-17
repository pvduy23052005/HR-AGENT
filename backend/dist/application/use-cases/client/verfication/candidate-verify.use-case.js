"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyCandidateUseCase = void 0;
class VerifyCandidateUseCase {
    candidateRepo;
    constructor(candidateRepo) {
        this.candidateRepo = candidateRepo;
    }
    async execute(candidateID, dataVerification) {
        const [result] = await Promise.all([
            this.repo.createVerification(candidateID, dataVerification),
            this.repo.updateIsverfiy(candidateID, true)
        ]);
        return result;
    }
    get repo() {
        return this.candidateRepo;
    }
}
exports.VerifyCandidateUseCase = VerifyCandidateUseCase;
//# sourceMappingURL=candidate-verify.use-case.js.map