export const login = async (
  authRepository,
  passwordService,
  tokenService,
  email,
  password,
) => {
  const user = await authRepository.findUserByEmail(email);

  if (!user) {
    throw new Error("Email không tồn tại!");
  }

  if (!user.isActive()) {
    throw new Error("Tài khoản đã bị khóa! Vui lòng liên hệ Admin.");
  }

  const passwordMatch = await user.verifyPassword(password, passwordService);

  if (!passwordMatch) {
    throw new Error("Mật khẩu không chính xác!");
  }

  const payLoad = {
    userID: user.id,
  };

  const token = tokenService.generateToken(payLoad);

  return {
    token: token,
    user: user.getProfile(),
  };
};
