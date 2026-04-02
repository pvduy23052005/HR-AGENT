import AiAnalysis from '../models/AiAnalysis.model';
import { AnalysisEntity } from '../../../domain/entities/analysis';
import type { IAnalysisReadRepo, IAnalysisWriteRepo } from '../../../application/ports/repositories/analysis.interface';

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

  public async create(analysis: AnalysisEntity): Promise<AnalysisEntity | null> {
    const { id, ...data } = analysis.getDetail();
    const newAnalysis = new AiAnalysis(data);
    const savedAnalysis = await newAnalysis.save();
    return this.mapToEntity(savedAnalysis);
  }

  public async getAnalysisByCandidateId(candidateID: string): Promise<AnalysisEntity | null> {
    const analysis = await AiAnalysis.findOne({ candidateID }).lean();
    return this.mapToEntity(analysis);
  }

  public async getAnalysisByCandidateIdAndJobId(candidateID: string, jobID: string): Promise<AnalysisEntity | null> {
    const analysis = await AiAnalysis.findOne({
      candidateID: candidateID,
      jobID: jobID
    }).lean();
    return this.mapToEntity(analysis);
  }
}
