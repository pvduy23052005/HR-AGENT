export const createUser = async (userRepository, passwordService, dataUser) => {
  const { fullName, email, password } = dataUser;

  const emailExist = await userRepository.findByEmail(email);
  if (emailExist) {
    throw new Error("Email này đã tồn tại trong hệ thống!");
  }

  const hashedPassword = await passwordService.hash(password);

  const newUser = await userRepository.createUser({
    fullName,
    email,
    password: hashedPassword,
    status: "active",
    deleted: false,
  });

  return newUser.getProfile();
};

export const getUsers = async (userRepository) => {
  const users = await userRepository.findAll();
  return users.map((user) => user.getProfile());
};

export const changeStatus = async (userRepository, id, status) => {
  const user = await userRepository.findById(id);

  if (!user) {
    throw new Error("Người dùng không tồn tại!");
  }

  const updatedUser = await userRepository.updateStatus(id, status);

  return updatedUser.getProfile();
};
