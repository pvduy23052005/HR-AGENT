import AiAnalysis from '../../models/AiAnalysis.model';
import { AnalysisEntity } from '../../../../domain/entities/client/analysis';
import type { IAnalysisReadRepo, IAnalysisWriteRepo } from '../../../../domain/interfaces/client/analysis.interface';
import type { IAnalysisData } from '../../../../domain/interfaces/client/analysis.interface';

export class AiAnalysisRepository implements IAnalysisReadRepo, IAnalysisWriteRepo {
  private mapToEntity(doc: any | null): AnalysisEntity | null {
    if (!doc) return null;
    const d = doc as any;

    return new AnalysisEntity({
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
  }

  public async createAiAnalysis(data: IAnalysisData): Promise<AnalysisEntity | null> {
    const newAnalysis = new AiAnalysis(data);
    const savedAnalysis = await newAnalysis.save();
    return this.mapToEntity(savedAnalysis);
  }

  public async getAnalysisByCandidateId(candidateID: string): Promise<AnalysisEntity | null> {
    const analysis = await AiAnalysis.findOne({ candidateID }).lean();
    return this.mapToEntity(analysis);
  }
}
