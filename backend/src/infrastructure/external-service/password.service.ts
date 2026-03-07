import bcrypt from 'bcrypt';

export const hash = async (plainPassword: string): Promise<string> => {
  return await bcrypt.hash(plainPassword, 10);
};

export const compare = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};
