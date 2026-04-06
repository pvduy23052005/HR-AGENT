export interface AnalysisInputDto {
  candidateID: string;
  jobID: string;
}

export interface AnalysisOutputDto {
  id?: string | undefined;
  jobID: string;
  candidateID: string;
  summary: string;
  matchingScore: number;
  redFlags: string[];
  suggestedQuestions: string[];
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
}