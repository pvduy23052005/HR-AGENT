import AiAnalysis from '../../models/AiAnalysis.model';
import { AiAnalyizeEntity } from '../../../../domain/entities/client/aiAnalyize.entity';
import type { IAiAnalysisRepository } from '../../../../domain/interfaces/client/aiAnalysis.interface';

const mapToEntity = (doc: any | null): AiAnalyizeEntity | null => {
  if (!doc) return null;
  const d = doc as any;

  return new AiAnalyizeEntity({
    id: d._id.toString(),
    jobID: d.jobID?.toString(),
    candidateID: d.candidateID?.toString(),
    summary: d.summary,
    matchingScore: d.matchingScore,
    redFlags: d.redFlags,
    suggestedQuestions: d.suggestedQuestions,
    createdAt: d.createdAt,
    updatedAt: d.updatedAt,
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

export class AiAnalysisRepository implements IAiAnalysisRepository {
  public async createAiAnalysis(data: IAiAnalysisData): Promise<AiAnalyizeEntity | null> {
    const newAnalysis = new AiAnalysis(data);
    const savedAnalysis = await newAnalysis.save();
    return mapToEntity(savedAnalysis);
  }

  public async getAnalysisByCandidateId(candidateID: string): Promise<AiAnalyizeEntity | null> {
    const analysis = await AiAnalysis.findOne({ candidateID }).lean();
    return mapToEntity(analysis);
  }
}
