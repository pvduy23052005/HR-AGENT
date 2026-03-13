"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAnalyizeCandidate = void 0;
const validateAnalyizeCandidate = (req, res, next) => {
    const { jobID, candidateID } = req.body;
    if (!jobID || !candidateID) {
        res.status(400).json({ success: false, message: 'jobId and candidateID are required.' });
        return;
    }
    next();
};
exports.validateAnalyizeCandidate = validateAnalyizeCandidate;
//# sourceMappingURL=aiAnalysis.validator.js.map