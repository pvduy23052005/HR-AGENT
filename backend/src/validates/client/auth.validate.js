// Validate login input
export const loginValidate = (req, res, next) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({
      code: 400,
      message: "Vui lòng nhập Email!",
    });
  }

  if (!password) {
    return res.status(400).json({
      code: 400,
      message: "Vui lòng nhập mật khẩu!",
    });
  }

  next();
};
