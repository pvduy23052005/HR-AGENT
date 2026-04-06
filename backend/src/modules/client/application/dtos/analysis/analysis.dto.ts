import { IAnalysisDetail } from "../../../domain/analysis";

export interface AnalysisInputDto {
  candidateID: string;
  jobID: string;
}

export interface AnalysisOutputDto {
  id?: string;
  jobID: string;
  candidateID: string;
  summary: string;
  matchingScore: number;
  redFlags: string[];
  suggestedQuestions: string[];
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
}