
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
