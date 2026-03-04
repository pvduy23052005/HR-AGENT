import bcrypt from "bcrypt";

export const hash = async (plainPassword) => {
  return await bcrypt.hash(plainPassword, 10);
};

export const compare = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};
