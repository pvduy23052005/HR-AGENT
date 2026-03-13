"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateScheduleInterview = void 0;
const validateScheduleInterview = (req, res, next) => {
    const { candidateID, jobID, time, address, durationMinutes } = req.body;
    if (!candidateID || !jobID) {
        res.status(400).json({ success: false, message: 'candidateID and jobID are required.' });
        return;
    }
    if (!time || Number.isNaN(Date.parse(time))) {
        res.status(400).json({ success: false, message: 'time must be a valid ISO datetime string.' });
        return;
    }
    if (!address || !address.trim()) {
        res.status(400).json({ success: false, message: 'Vui lòng nhập địa điểm/meeting link!' });
        return;
    }
    if (durationMinutes !== undefined) {
        const dm = Number(durationMinutes);
        if (!Number.isFinite(dm) || dm <= 0 || dm > 8 * 60) {
            res.status(400).json({ success: false, message: 'durationMinutes không hợp lệ.' });
            return;
        }
    }
    next();
};
exports.validateScheduleInterview = validateScheduleInterview;
//# sourceMappingURL=interview.validator.js.map