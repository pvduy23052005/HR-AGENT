export interface IAnalysisDetail {
  id: string;
  jobID: string;
  candidateID: string;
  summary: string;
  matchingScore: number;
  redFlags: string[];
  suggestedQuestions: string[];
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
}

export interface IAnalysisProps {
  id?: string | { toString(): string };
  jobID?: string | { toString(): string };
  candidateID?: string | { toString(): string };
  summary?: string;
  matchingScore?: number;
  redFlags?: string[];
  suggestedQuestions?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
