export class OTPEntity {
  constructor({ id, email, otp, expireAt, createdAt, updatedAt }) {
    this.id = id;
    this.email = email;
    this.otp = otp;
    this.expireAt = expireAt;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  isExpired() {
    const now = new Date();
    return now > new Date(this.expireAt);
  }
}
