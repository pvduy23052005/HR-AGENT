import { RequestHandler } from 'express';

export const createJobValidate: RequestHandler = (req, res, next) => {
  const { title, description, requirements } = req.body as { title?: string; description?: string; requirements?: string };

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
