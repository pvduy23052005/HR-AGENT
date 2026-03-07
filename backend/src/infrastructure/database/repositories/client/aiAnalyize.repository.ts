import AiAnalysis from '../../models/AiAnalysis.model';
import { AiAnalyizeEntity } from '../../../../domain/entities/client/aiAnalyize.entity';
import type { IAiAnalysisDocument } from '../../models/AiAnalysis.model';

const mapToEntity = (doc: (IAiAnalysisDocument & { _id: { toString(): string } }) | null): AiAnalyizeEntity | null => {
  if (!doc) return null;
  return new AiAnalyizeEntity({
    id: doc._id.toString(),
    jobID: doc.jobID?.toString(),
    candidateID: doc.candidateID?.toString(),
    summary: doc.summary,
    matchingScore: doc.matchingScore,
    redFlags: doc.redFlags,
    suggestedQuestions: doc.suggestedQuestions,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  });
};

export interface IAiAnalysisData {
  jobID: string;
  candidateID: string;
  summary?: string;
  matchingScore?: number;
  redFlags?: string[];
  suggestedQuestions?: string[];
}

export const createAiAnalysis = async (data: IAiAnalysisData): Promise<AiAnalyizeEntity | null> => {
  const newAnalysis = new AiAnalysis(data);
  const savedAnalysis = await newAnalysis.save();
  return mapToEntity(savedAnalysis as IAiAnalysisDocument & { _id: { toString(): string } });
};

export const getAnalysisByCandidateId = async (candidateID: string): Promise<AiAnalyizeEntity | null> => {
  const analysis = await AiAnalysis.findOne({ candidateID }).lean();
  return mapToEntity(analysis as (IAiAnalysisDocument & { _id: { toString(): string } }) | null);
};
