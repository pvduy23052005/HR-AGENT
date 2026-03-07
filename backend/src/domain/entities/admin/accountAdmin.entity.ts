export interface IAdminEntityProps {
  id?: string;
  fullName: string;
  email: string;
  password: string;
  role?: string;
  status?: string;
  deleted?: boolean;
}

export interface IAdminProfile {
  id: string;
  fullName: string;
  email: string;
  role: string;
  status: string | undefined;
}

export class AdminEntity {
  id: string | undefined;
  fullName: string;
  email: string;
  password: string;
  role: string;
  status: string | undefined;
  deleted: boolean | undefined;

  constructor({
    id,
    fullName,
    email,
    password,
    role = 'admin',
    status,
    deleted,
  }: IAdminEntityProps) {
    this.id = id;
    this.fullName = fullName;
    this.email = email;
    this.password = password;
    this.role = role;
    this.status = status;
    this.deleted = deleted;
  }

  isActive(): boolean {
    return this.status === 'active';
  }

  verifyPassword(password: string): boolean {
    return this.password === password;
  }

  getProfile(): IAdminProfile {
    return {
      id: this.id ?? '',
      fullName: this.fullName,
      email: this.email,
      role: this.role,
      status: this.status,
    };
  }
}
