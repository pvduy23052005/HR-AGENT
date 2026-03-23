export interface IPasswordService {
  compare(plain: string, hashed: string): Promise<boolean>;
}

export interface IUserProfile {
  id: string;
  fullName: string;
  email: string;
  avatar: string;
  status: string;
  createdAt: Date | undefined;
}

export interface IUserProps {
  id?: string;
  fullName: string;
  email: string;
  password: string;
  avatar?: string;
  status?: string;
  deleted?: boolean;
  deletedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}
