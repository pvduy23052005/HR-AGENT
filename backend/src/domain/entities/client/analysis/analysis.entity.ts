import type { IAnalysisDetail, IAnalysisProps } from './analysis.types';

export class AnalysisEntity {
  id: string;
  jobID: string;
  candidateID: string;
  summary: string;
  matchingScore: number;
  redFlags: string[];
  suggestedQuestions: string[];
  createdAt: Date | undefined;
  updatedAt: Date | undefined;

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

  getDetail(): IAnalysisDetail {
    return {
      id: this.id,
      jobID: this.jobID,
      candidateID: this.candidateID,
      summary: this.summary,
      matchingScore: this.matchingScore,
      redFlags: this.redFlags,
      suggestedQuestions: this.suggestedQuestions,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
