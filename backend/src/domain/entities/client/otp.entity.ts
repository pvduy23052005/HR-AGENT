export interface IOTPProps {
  id?: string;
  email: string;
  otp: string;
  expireAt: Date | string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class OTPEntity {
  id: string | undefined;
  email: string;
  otp: string;
  expireAt: Date | string;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;

  constructor({ id, email, otp, expireAt, createdAt, updatedAt }: IOTPProps) {
    this.id = id;
    this.email = email;
    this.otp = otp;
    this.expireAt = expireAt;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  isExpired(): boolean {
    const now = new Date();
    return now > new Date(this.expireAt);
  }
}
