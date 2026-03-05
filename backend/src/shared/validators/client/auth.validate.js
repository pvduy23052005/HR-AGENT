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

// Validate signup input
export const signupValidate = (req, res, next) => {
  const { fullName, email, password, confirmPassword } = req.body;

  if (!fullName || !fullName.trim()) {
    return res.status(400).json({
      code: 400,
      message: "Vui lòng nhập họ tên!",
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
      message: "Vui lòng nhập mật khẩu!",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      code: 400,
      message: "Mật khẩu phải có ít nhất 6 ký tự!",
    });
  }

  if (!confirmPassword) {
    return res.status(400).json({
      code: 400,
      message: "Vui lòng xác nhận mật khẩu!",
    });
  }

  next();
};
