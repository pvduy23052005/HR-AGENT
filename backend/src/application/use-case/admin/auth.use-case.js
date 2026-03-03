

// Login admin — business logic
export const login = async (tokenService, authRepository, email, password) => {
  const admin = await authRepository.findAccountByEmail(email);

  if (!admin) {
    throw new Error("Email không tồn tại!");
  }

  if (!admin.isActive()) {
    throw new Error("Tài khoản Admin đã bị khóa!");
  }

  if (!admin.verifyPassword(password)) {
    throw new Error("Mật khẩu không chính xác!");
  }

  const payload = { userID: admin.id };

  const token = tokenService.generateToken(payload);

  return {
    token,
    admin: admin.getProfile(),
  };
};
