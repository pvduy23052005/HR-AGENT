import type { IJobSummary, IJobDetail, IJobProps } from './job.types';

export class JobEntity {
  private id?: string;
  private userID: string;
  private title: string;
  private description: string;
  private requirements: string[];
  private status: boolean;
  private deleted: boolean;
  private createdAt: Date | undefined;
  private updatedAt: Date | undefined;

  private constructor(props: IJobProps) {
    this.id = props.id ? props.id.toString() : undefined;
    this.userID = props.userID ? props.userID.toString() : '';
    this.title = props.title ? props.title.trim() : '';
    this.description = props.description ? props.description.trim() : '';
    this.requirements = Array.isArray(props.requirements) ? props.requirements : [];
    this.status = props.status ?? false;
    this.deleted = props.deleted;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  public static createJob(
    userID: string,
    title: string,
    description: string = '',
    requirements: string[] = []
  ): JobEntity {
    if (!userID) throw new Error('Domain Error: Job phải có UserID.');
    if (!title.trim()) throw new Error('Domain Error: Thiếu tiêu đề.');

    return new JobEntity({
      userID,
      title,
      description,
      requirements,
      status: false,
      deleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public static restore(props: IJobProps): JobEntity {
    return new JobEntity(props);
  }

  public isOwner(currentUserID: string): boolean {
    return currentUserID === this.userID;
  }

  public delete(status: boolean): void {
    this.deleted = status;
  }

  public update(title: string, description: string, requirements: string[]): void {
    if (!title.trim()) throw new Error('Domain Error: Thiếu tiêu đề.');
    this.title = title.trim();
    this.description = description.trim();
    this.requirements = requirements;
    this.updatedAt = new Date();
  }

  public closeJob(): void {
    if (this.status === true) throw new Error('Domain Error: Job đã đóng.');
    this.status = true;
    this.updatedAt = new Date();
  }

  public isActive(): boolean {
    return this.status === false;
  }

  public getDetailJob(): IJobDetail {
    return {
      id: this.id,
      title: this.title,
      status: this.status,
      userID: this.userID,
      description: this.description,
      requirements: [...this.requirements],
      deleted: this.deleted,
      createdAt: this.createdAt,
    };
  }

  public getSummary(): IJobSummary {
    return {
      id: this.id,
      title: this.title,
      status: this.status,
      requirements: this.requirements,
      createdAt: this.createdAt
    }
  }

  public getId(): string | undefined { return this.id; }
  public getUserID(): string { return this.userID; }
  public getTitle(): string { return this.title; }
  public getDescription(): string { return this.description; }
  public getStatus(): boolean { return this.status; }
  public getCreatedAt(): Date | undefined { return this.createdAt; }
  public getUpdatedAt(): Date | undefined { return this.updatedAt; }

  public getRequirements(): string[] { return [...this.requirements]; }
}