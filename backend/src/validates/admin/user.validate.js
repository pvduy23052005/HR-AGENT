// Validate create user input
export const createUserValidate = (req, res, next) => {
  const { fullName, email, password } = req.body;

  if (!fullName) {
    return res.status(400).json({
      code: 400,
      message: "Vui lòng nhập Họ tên!",
    });
  }

  if (!email) {
    return res.status(400).json({
      code: 400,
      message: "Vui lòng nhập Email!",
    });
  }

  if (!password) {
    return res.status(400).json({
      code: 400,
      message: "Vui lòng nhập Mật khẩu!",
    });
  }

  next();
};
