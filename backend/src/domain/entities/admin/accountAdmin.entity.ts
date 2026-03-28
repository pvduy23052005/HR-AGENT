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
  private id: string ;
  private fullName: string;
  private email: string;
  private password: string;
  private role: string;
  private status: string | undefined;
  private deleted: boolean | undefined;

  constructor({
    id,
    fullName,
    email,
    password,
    role = 'admin',
    status,
    deleted,
  }: IAdminEntityProps) {
    this.id = id?.toString() || "";
    this.fullName = fullName;
    this.email = email;
    this.password = password;
    this.role = role;
    this.status = status;
    this.deleted = deleted;
  }

  public getId(): string { return this.id; }
  public setId(value: string): void { this.id = value; }

  public getFullName(): string { return this.fullName; }
  public setFullName(value: string): void { this.fullName = value; }

  public getEmail(): string { return this.email; }
  public setEmail(value: string): void { this.email = value; }

  public getPassword(): string { return this.password; }
  public setPassword(value: string): void { this.password = value; }

  public getRole(): string { return this.role; }
  public setRole(value: string): void { this.role = value; }

  public getStatus(): string | undefined { return this.status; }
  public setStatus(value: string | undefined): void { this.status = value; }

  public getDeleted(): boolean | undefined { return this.deleted; }
  public setDeleted(value: boolean | undefined): void { this.deleted = value; }

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
