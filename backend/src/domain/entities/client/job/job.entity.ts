import type { IJobSummary, IJobDetail, IJobProps } from './job.types';

export class JobEntity {
  private id: string;
  private userID: string;
  private title: string;
  private description: string;
  private requirements: string[];
  private status: boolean;
  private createdAt: Date | undefined;
  private updatedAt: Date | undefined;

  constructor({
    id,
    title = '',
    userID,
    description = '',
    requirements = [],
    status = false,
    createdAt,
    updatedAt,
  }: IJobProps) {
    this.id = id ?? '';
    this.userID = userID;
    this.title = title ? title.trim() : '';
    this.description = description ? description.trim() : '';
    this.requirements = Array.isArray(requirements) ? requirements : [];
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public getId(): string { return this.id; }
  public setId(value: string): void { this.id = value; }

  public getUserID(): string { return this.userID; }
  public setUserID(value: string): void { this.userID = value; }

  public getTitle(): string { return this.title; }
  public setTitle(value: string): void { this.title = value; }

  public getDescription(): string { return this.description; }
  public setDescription(value: string): void { this.description = value; }

  public getRequirements(): string[] { return this.requirements; }
  public setRequirements(value: string[]): void { this.requirements = value; }

  public getStatus(): boolean { return this.status; }
  public setStatus(value: boolean): void { this.status = value; }

  public getCreatedAt(): Date | undefined { return this.createdAt; }
  public setCreatedAt(value: Date | undefined): void { this.createdAt = value; }

  public getUpdatedAt(): Date | undefined { return this.updatedAt; }
  public setUpdatedAt(value: Date | undefined): void { this.updatedAt = value; }

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
