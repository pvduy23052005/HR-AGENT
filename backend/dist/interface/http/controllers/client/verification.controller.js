"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyCandidate = exports.getVerificationDetail = void 0;
const get_verification_use_case_1 = require("../../../../application/use-cases/client/verfication/get-verification.use-case");
const candidate_verify_use_case_1 = require("../../../../application/use-cases/client/verfication/candidate-verify.use-case");
const verification_repository_1 = require("../../../../infrastructure/database/repositories/client/verification.repository");
const verificationRepository = new verification_repository_1.VerificationRepository();
// [GET] /verification/:candidateID
const getVerificationDetail = async (req, res) => {
    try {
        const candidateID = req.params.candidateID;
        if (!candidateID) {
            res.status(400).json({ success: false, message: 'Thiếu candidateID!' });
            return;
        }
        const getVerificationUseCase = new get_verification_use_case_1.GetVerificationUseCase(verificationRepository);
        const verification = await getVerificationUseCase.execute(candidateID);
        if (!verification) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy dữ liệu kiểm chứng cho ứng viên này!',
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Thành công',
            verification,
        });
    }
    catch (error) {
        const e = error;
        res.status(400).json({
            success: false,
            message: e.message ?? 'Đã xảy ra lỗi khi lấy thông tin kiểm chứng!',
        });
    }
};
exports.getVerificationDetail = getVerificationDetail;
// [POST] /verification/candidate 
const verifyCandidate = async (req, res) => {
    try {
        const { candidateID, data } = req.body;
        const dataCandidate = data.details.replace(/```json/g, '').replace(/```/g, '').trim();
        const candidateJson = JSON.parse(dataCandidate);
        if (!candidateID) {
            res.status(400).json({ success: false, message: 'Thiếu candidateID!' });
            return;
        }
        if (!data) {
            res.status(400).json({ success: false, message: 'Không có dữ liệu xác minh!' });
            return;
        }
        const candidateVerifyUseCase = new candidate_verify_use_case_1.VerifyCandidateUseCase(verificationRepository);
        const result = await candidateVerifyUseCase.execute(candidateID, candidateJson);
        res.status(200).json({ success: true, message: 'Xác minh thành công!', verification: result });
    }
    catch (error) {
        console.error('Lỗi xác minh ứng viên:', error);
        res.status(400).json({
            success: false,
            message: 'Lỗi phân tích ứng viên',
        });
    }
};
exports.verifyCandidate = verifyCandidate;
//# sourceMappingURL=verification.controller.js.map