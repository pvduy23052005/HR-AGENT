import { RequestHandler } from 'express';

export const sendBulkEmailValidate: RequestHandler = (req, res, next) => {
  const { candidateIds, template, title, content } = req.body as {
    candidateIds?: string[];
    template?: { id: number; name: string };
    title?: string;
    content?: string;
  };

  if (!candidateIds || !Array.isArray(candidateIds) || candidateIds.length === 0) {
    res.status(400).json({
      success: false,
      message: 'Danh sách ứng viên không được để trống.',
    });
    return;
  }

  if (!template || !template.id) {
    res.status(400).json({
      success: false,
      message: 'Mẫu email không hợp lệ.',
    });
    return;
  }

  if (!title?.trim()) {
    res.status(400).json({
      success: false,
      message: 'Tiêu đề email không được để trống.',
    });
    return;
  }

  if (!content?.trim()) {
    res.status(400).json({
      success: false,
      message: 'Nội dung email không được để trống.',
    });
    return;
  }

  next();
};
