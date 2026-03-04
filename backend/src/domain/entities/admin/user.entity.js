export class UserEntity {
  constructor({
    id,
    fullName,
    email,
    password,
    avatar = "",
    status = "active",
    deleted = false,
    deletedAt = null,
    createdAt,
    updatedAt,
  }) {
    this.id = id;
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

  isActive() {
    return this.status === "active" && this.deleted === false;
  }

  async hashPassword(plainPassword, passwordService) {
    return await passwordService.hash(plainPassword);
  }

  async verifyPassword(plainPassword, passwordService) {
    return await passwordService.compare(plainPassword, this.password);
  }

  getProfile() {
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
