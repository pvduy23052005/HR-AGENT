import type { IJobSummary, IJobDetail, IJobProps } from './job.types';

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
      requirements: this.requirements,
      createdAt: this.createdAt,
    };
  }
}
