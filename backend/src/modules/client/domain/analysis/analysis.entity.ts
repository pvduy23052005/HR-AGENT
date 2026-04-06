import type { IAnalysisProps, IAnalysisDetail } from './analysis.types';

export class AnalysisEntity {
  private id?: string;
  private jobID: string;
  private candidateID: string;
  private summary: string;
  private matchingScore: number;
  private redFlags: string[];
  private suggestedQuestions: string[];
  private createdAt?: Date;
  private updatedAt?: Date;

  constructor({
    id,
    jobID,
    candidateID,
    summary = '',
    matchingScore = 0,
    redFlags = [],
    suggestedQuestions = [],
    createdAt,
    updatedAt,
  }: IAnalysisProps) {
    this.id = id ? id.toString() : '';
    this.jobID = jobID ? jobID.toString() : '';
    this.candidateID = candidateID ? candidateID.toString() : '';
    this.summary = summary ? summary.trim() : '';
    this.matchingScore = matchingScore !== undefined ? Number(matchingScore) : 0;
    this.redFlags = Array.isArray(redFlags) ? redFlags : [];
    this.suggestedQuestions = Array.isArray(suggestedQuestions) ? suggestedQuestions : [];
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public static create(data: IAnalysisProps): AnalysisEntity {
    if (!data.jobID || !data.jobID.toString().trim()) {
      throw new Error('Domain Error: Không thể tạo bản phân tích do thiếu JobID.');
    }

    if (!data.candidateID || !data.candidateID.toString().trim()) {
      throw new Error('Domain Error: Không thể tạo bản phân tích do thiếu CandidateID.');
    }

    const score = data.matchingScore !== undefined ? Number(data.matchingScore) : 0;
    if (score < 0 || score > 100) {
      throw new Error('Domain Error: Điểm số phù hợp (matchingScore) phải nằm trong khoảng từ 0 đến 100.');
    }

    return new AnalysisEntity({
      ...data,
      id: undefined,
      matchingScore: score,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public static restore(data: IAnalysisProps): AnalysisEntity {
    return new AnalysisEntity(data);
  }

  public getId(): string | undefined { return this.id; }
  public setId(value: string): void { this.id = value; }

  public getJobID(): string { return this.jobID; }
  public setJobID(value: string): void { this.jobID = value; }

  public getCandidateID(): string { return this.candidateID; }
  public setCandidateID(value: string): void { this.candidateID = value; }

  public getSummary(): string { return this.summary; }
  public setSummary(value: string): void { this.summary = value; }

  public getMatchingScore(): number { return this.matchingScore; }
  public setMatchingScore(value: number): void { this.matchingScore = value; }

  public getRedFlags(): string[] { return this.redFlags; }
  public setRedFlags(value: string[]): void { this.redFlags = value; }

  public getSuggestedQuestions(): string[] { return this.suggestedQuestions; }
  public setSuggestedQuestions(value: string[]): void { this.suggestedQuestions = value; }

  public getCreatedAt(): Date | undefined { return this.createdAt; }
  public setCreatedAt(value: Date): void { this.createdAt = value; }

  public getUpdatedAt(): Date | undefined { return this.updatedAt; }
  public setUpdatedAt(value: Date): void { this.updatedAt = value; }

  public getDetail(): IAnalysisDetail {
    return {
      id: this.id,
      jobID: this.jobID,
      candidateID: this.candidateID,
      summary: this.summary,
      matchingScore: this.matchingScore,
      redFlags: this.redFlags,
      suggestedQuestions: this.suggestedQuestions,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
