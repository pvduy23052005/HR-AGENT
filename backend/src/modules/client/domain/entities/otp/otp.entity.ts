import type { IOTPProps } from './otp.types';

export class OTPEntity {
  private id?: string | undefined;
  private email: string;
  private otp: string;
  private expireAt: Date | string;
  private createdAt: Date | undefined;
  private updatedAt: Date | undefined;

  constructor({ id, email, otp, expireAt, createdAt, updatedAt }: IOTPProps) {
    this.id = id;
    this.email = email;
    this.otp = otp;
    this.expireAt = expireAt;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public static create(data: { email: string; otp: string; expiresInMinutes?: number }): OTPEntity {
    if (!data.email || !data.email.trim()) {
      throw new Error('Domain Error: Không thể tạo OTP vì thiếu Email.');
    }
    if (!data.otp || !data.otp.trim()) {
      throw new Error('Domain Error: Không thể tạo OTP vì thiếu mã xác nhận.');
    }

    const minutes = data.expiresInMinutes || 1;
    const expireTime = new Date();
    expireTime.setMinutes(expireTime.getMinutes() + minutes);

    return new OTPEntity({
      email: data.email.trim().toLowerCase(),
      otp: data.otp.trim(),
      expireAt: expireTime,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public static restore(data: IOTPProps): OTPEntity {
    return new OTPEntity(data);
  }

  public getDetail(): IOTPProps {
    return {
      id: this.id,
      email: this.email,
      otp: this.otp,
      expireAt: this.expireAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  public getId(): string | undefined { return this.id; }
  public setId(value: string | undefined): void { this.id = value; }

  public getEmail(): string { return this.email; }
  public setEmail(value: string): void { this.email = value; }

  public getOtp(): string { return this.otp; }
  public setOtp(value: string): void { this.otp = value; }

  public getExpireAt(): Date | string { return this.expireAt; }
  public setExpireAt(value: Date | string): void { this.expireAt = value; }

  public getCreatedAt(): Date | undefined { return this.createdAt; }
  public setCreatedAt(value: Date | undefined): void { this.createdAt = value; }

  public getUpdatedAt(): Date | undefined { return this.updatedAt; }
  public setUpdatedAt(value: Date | undefined): void { this.updatedAt = value; }

  isExpired(): boolean {
    const now = new Date();
    return now > new Date(this.expireAt);
  }
}
