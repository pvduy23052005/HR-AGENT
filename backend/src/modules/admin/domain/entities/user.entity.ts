import type { IPasswordService } from '../../../client/application/ports/services/password.service';
import type { IAdminUserProfile, IAdminUserProps } from './user.type';
export type { IAdminUserProfile, IAdminUserProps };

export class UserEntity {
  private id?: string;
  private fullName: string;
  private email: string;
  private password: string;
  private avatar: string;
  private status: string;
  private deleted: boolean;
  private deletedAt: Date | null;
  private createdAt: Date | undefined;
  private updatedAt: Date | undefined;

  private constructor({
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

  public static create(data: IAdminUserProps): UserEntity {
    if (!data.email || !data.email.trim()) {
      throw new Error('Domain Error: Email không hợp lệ.');
    }
    if (!data.fullName || !data.fullName.trim()) {
      throw new Error('Domain Error: Tên không hợp lệ.');
    }

    return new UserEntity({
      ...data,
      status: data.status || 'active',
      deleted: false,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  public static restore(data: IAdminUserProps): UserEntity {
    return new UserEntity(data);
  }

  public getDetail(): IAdminUserProps {
    return {
      id: this.id,
      fullName: this.fullName,
      email: this.email,
      password: this.password,
      avatar: this.avatar,
      status: this.status,
      deleted: this.deleted,
      deletedAt: this.deletedAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  public update(data: Partial<IAdminUserProps>): void {
    if (data.fullName) this.fullName = data.fullName;
    if (data.email) this.email = data.email;
    if (data.password) this.password = data.password;
    if (data.avatar !== undefined) this.avatar = data.avatar;
    if (data.status) this.status = data.status;
    if (data.deleted !== undefined) this.deleted = data.deleted;
    if (data.deletedAt !== undefined) this.deletedAt = data.deletedAt;

    this.updatedAt = new Date();
  }

  public getId(): string | undefined { return this.id; }

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
