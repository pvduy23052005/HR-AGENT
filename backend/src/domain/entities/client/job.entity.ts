export interface IJobSummary {
  id: string;
  title: string;
  status: boolean;
  createdAt: Date | undefined;
}

export interface IJobDetail extends IJobSummary {
  description: string;
  requirements: string[];
}

export interface IJobProps {
  id?: string;
  _id?: string | { toString(): string };
  title?: string;
  userID?: string | { toString(): string };
  description?: string;
  requirements?: string[];
  status?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class JobEntity {
  id: string;
  userID: string;
  title: string;
  description: string;
  requirements: string[];
  status: boolean;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;

  constructor({
    id,
    _id,
    title = '',
    userID,
    description = '',
    requirements = [],
    status = false,
    createdAt,
    updatedAt,
  }: IJobProps) {
    const entityId = id ?? _id;
    this.id = entityId ? entityId.toString() : '';
    this.userID = userID ? userID.toString() : '';
    this.title = title ? title.trim() : '';
    this.description = description ? description.trim() : '';
    this.requirements = Array.isArray(requirements) ? requirements : [];
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  isActive(): boolean {
    return this.status === false;
  }

  isOwner(checkUserID: string | { toString(): string }): boolean {
    if (!this.userID || !checkUserID) return false;
    return this.userID === checkUserID.toString();
  }

  getDetailJob(): IJobDetail {
    return {
      id: this.id,
      title: this.title,
      status: this.status,
      description: this.description,
      requirements: this.requirements,
      createdAt: this.createdAt,
    };
  }

  getSummary(): IJobSummary {
    return {
      id: this.id,
      title: this.title,
      status: this.status,
      createdAt: this.createdAt,
    };
  }
}
