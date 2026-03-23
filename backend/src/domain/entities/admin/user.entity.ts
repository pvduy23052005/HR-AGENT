import type { IPasswordService } from '../client/user';

export interface IAdminUserProfile {
  id: string;
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
  }: IAdminUserProps) {
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

  async hashPassword(plainPassword: string, passwordService: IPasswordService & { hash(plain: string): Promise<string> }): Promise<string> {
    return await passwordService.hash(plainPassword);
  }

  async verifyPassword(plainPassword: string, passwordService: IPasswordService): Promise<boolean> {
    return await passwordService.compare(plainPassword, this.password);
  }

  getProfile(): IAdminUserProfile {
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
