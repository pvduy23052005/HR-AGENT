"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJobValidate = void 0;
const createJobValidate = (req, res, next) => {
    const { title, description, requirements } = req.body;
    if (!title || !title.trim()) {
        res.status(400).json({ success: false, message: 'Vui lòng nhập tiêu đề công việc!' });
        return;
    }
    if (!description || !description.trim()) {
        res.status(400).json({ success: false, message: 'Vui lòng nhập mô tả công việc!' });
        return;
    }
    if (!requirements || !requirements.trim()) {
        res.status(400).json({ success: false, message: 'Vui lòng nhập yêu cầu công việc!' });
        return;
    }
    next();
};
exports.createJobValidate = createJobValidate;
//# sourceMappingURL=job.validate.js.map