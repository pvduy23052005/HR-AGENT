import type { IPasswordService, IUserProfile, IUserProps } from './user.types';

export class UserEntity {
  private id: string;
  private fullName: string;
  private email: string;
  private password: string;
  private avatar: string;
  private status: string;
  private deleted: boolean;
  private deletedAt: Date | null;
  private createdAt: Date | undefined;
  private updatedAt: Date | undefined;

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

  public getId(): string { return this.id; }
  public setId(value: string): void { this.id = value; }

  public getFullName(): string { return this.fullName; }
  public setFullName(value: string): void { this.fullName = value; }

  public getEmail(): string { return this.email; }
  public setEmail(value: string): void { this.email = value; }

  public getPassword(): string { return this.password; }
  public setPassword(value: string): void { this.password = value; }

  public getAvatar(): string { return this.avatar; }
  public setAvatar(value: string): void { this.avatar = value; }

  public getStatus(): string { return this.status; }
  public setStatus(value: string): void { this.status = value; }

  public getDeleted(): boolean { return this.deleted; }
  public setDeleted(value: boolean): void { this.deleted = value; }

  public getDeletedAt(): Date | null { return this.deletedAt; }
  public setDeletedAt(value: Date | null): void { this.deletedAt = value; }

  public getCreatedAt(): Date | undefined { return this.createdAt; }
  public setCreatedAt(value: Date | undefined): void { this.createdAt = value; }

  public getUpdatedAt(): Date | undefined { return this.updatedAt; }
  public setUpdatedAt(value: Date | undefined): void { this.updatedAt = value; }

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
