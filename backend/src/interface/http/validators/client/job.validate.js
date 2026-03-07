export const createJobValidate = (req, res, next) => {
  const { title, description, requirements } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng nhập tiêu đề công việc!",
    });
  }

  if (!description || !description.trim()) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng nhập mô tả công việc!",
    });
  }

  if (!requirements || !requirements.trim()) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng nhập yêu cầu công việc!",
    });
  }

  next();
};
