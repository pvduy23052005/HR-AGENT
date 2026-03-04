export class AdminEntity {
  constructor({
    id,
    fullName,
    email,
    password,
    role = "admin",
    status,
    deleted,
  }) {
    this.id = id;
    this.fullName = fullName;
    this.email = email;
    this.password = password;
    this.role = role;
    this.status = status;
    this.deleted = deleted;
  }

  isActive() {
    return this.status == "active";
  }

  verifyPassword(password) {
    return this.password === password;
  }

  getProfile() {
    const object = {
      id: this.id,
      fullNam: this.fullName,
      email: this.email,
      role: this.role_id,
      status: this.status,
    };
    return object;
  }
}
