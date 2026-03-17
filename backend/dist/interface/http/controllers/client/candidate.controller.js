"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStatus = exports.getCandidateDetail = exports.getCandidates = void 0;
const get_candidate_use_case_1 = require("../../../../application/use-cases/client/candidate/get-candidate.use-case");
const get_candidate_detail_use_case_1 = require("../../../../application/use-cases/client/candidate/get-candidate-detail.use-case");
const update_status_use_case_1 = require("../../../../application/use-cases/client/candidate/update-status.use-case");
const candidate_repository_1 = require("../../../../infrastructure/database/repositories/client/candidate.repository");
const candidateRepository = new candidate_repository_1.CandidateRepository();
// [GET] /candidates
const getCandidates = async (req, res) => {
    try {
        const userID = res.locals.user.id.toString() || "";
        const getCandidatesUseCase = new get_candidate_use_case_1.GetCandidatesUseCase(candidateRepository);
        const candidates = await getCandidatesUseCase.execute(userID);
        if (!candidates || candidates.length === 0) {
            res.status(200).json({ success: true, message: 'Vui lòng thêm ứng viên!', candidates: [] });
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
// [GET] /candidates/:candidateID
const getCandidateDetail = async (req, res) => {
    try {
        const candidateID = req.params.candidateID;
        if (!candidateID) {
            res.status(400).json({ success: false, message: 'Thiếu candidateID!' });
            return;
        }
        const getCandidateDetailUseCase = new get_candidate_detail_use_case_1.GetCandidateDetailUseCase(candidateRepository);
        const candidate = await getCandidateDetailUseCase.execute(candidateID);
        if (!candidate) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy ứng viên!'
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Thành công',
            candidate: candidate.getDetailProfile()
        });
    }
    catch (error) {
        const e = error;
        res.status(400).json({ success: false, message: e.message ?? 'Đã xảy ra lỗi khi lấy thông tin ứng viên!' });
    }
};
exports.getCandidateDetail = getCandidateDetail;
// [PATCH] /candidates/change-status/:id
const updateStatus = async (req, res) => {
    try {
        const id = req.params.id.toString() || '';
        const { status } = req.body;
        if (!id)
            throw new Error('ID ứng viên không hợp lệ.');
        const validStatuses = ['unanalyzed', 'scheduled', 'analyzed', 'risky'];
        if (!validStatuses.includes(status)) {
            throw new Error(`Trạng thái không hợp lệ. Các trạng thái cho phép: ${validStatuses.join(', ')}`);
        }
        const updateStatusUseCase = new update_status_use_case_1.UpdateStatusUseCase(candidateRepository);
        await updateStatusUseCase.execute(id, { status: status });
        res.status(200).json({
            success: true,
            message: 'Cập nhật trạng thái thành công.',
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Lỗi khi cập nhật trạng thái',
        });
    }
};
exports.updateStatus = updateStatus;
//# sourceMappingURL=candidate.controller.js.map