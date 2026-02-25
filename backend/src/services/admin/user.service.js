import bcrypt from "bcrypt";
import * as userRepository from "../../repositories/admin/user.repository.js";

export const createUser = async (dataUser) => {
  const { fullName, email, password } = dataUser;

  const emailExist = await userRepository.findByEmail(email);

  if (emailExist) {
    const error = new Error("Email này đã tồn tại trong hệ thống!");
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await userRepository.createUser({
    fullName: fullName,
    email: email,
    password: hashedPassword,
    deleted: false,
  });

  return {
    id: newUser.id,
    fullName: newUser.fullName,
    email: newUser.email,
    status: newUser.status,
  };
};
