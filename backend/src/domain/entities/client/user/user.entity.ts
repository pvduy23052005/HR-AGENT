import type { IPasswordService, IUserProfile, IUserProps } from './user.types';

export class UserEntity {
  id: string;
  fullName: string;
  email: string;
  password: string;
  avatar: string;
  status: string;
  deleted: boolean;
  deletedAt: Date | null;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;

  constructor({
    id,
    fullName,
    email,
    password,
    avatar = '',
    status = 'active',
    deleted = false,
    deletedAt = null,
    createdAt,
    updatedAt,
  }: IUserProps) {
    this.id = id ?? '';
    this.fullName = fullName;
    this.email = email;
    this.password = password;
    this.avatar = avatar;
    this.status = status;
    this.deleted = deleted;
    this.deletedAt = deletedAt;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  isActive(): boolean {
    return this.status === 'active' && this.deleted === false;
  }

  async verifyPassword(plainPassword: string, passwordService: IPasswordService): Promise<boolean> {
    return await passwordService.compare(plainPassword, this.password);
  }

  getProfile(): IUserProfile {
    return {
      id: this.id,
      fullName: this.fullName,
      email: this.email,
      avatar: this.avatar,
      status: this.status,
      createdAt: this.createdAt,
    };
  }
}
