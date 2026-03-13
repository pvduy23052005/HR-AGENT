"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCandidates = void 0;
const get_candidate_use_case_1 = require("../../../../application/use-cases/client/candidate/get-candidate.use-case");
const candidate_repository_1 = require("../../../../infrastructure/database/repositories/client/candidate.repository");
const candidateRepository = new candidate_repository_1.CandidateRepository();
// [GET] /candidates
const getCandidates = async (req, res) => {
    try {
        const getCandidatesUseCase = new get_candidate_use_case_1.GetCandidatesUseCase(candidateRepository);
        const candidates = await getCandidatesUseCase.execute();
        if (!candidates || candidates.length === 0) {
            res.status(200).json({ success: true, message: 'Không có ứng viên nào!', candidates: [] });
            return;
        }
        const listSummaryProfile = candidates.map((c) => c.getSummaryProfile());
        res.status(200).json({ success: true, message: 'Thành công', candidates: listSummaryProfile });
    }
    catch (error) {
        const e = error;
        res.status(400).json({ success: false, message: e.message ?? 'Đã xảy ra lỗi khi lấy danh sách ứng viên!' });
    }
};
exports.getCandidates = getCandidates;
//# sourceMappingURL=candidate.controller.js.map