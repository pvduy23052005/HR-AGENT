export interface IAdminUserProfile {
  id?: string;
  fullName: string;
  email: string;
  avatar: string;
  status: string;
  createdAt: Date | undefined;
}

export interface IAdminUserProps {
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
