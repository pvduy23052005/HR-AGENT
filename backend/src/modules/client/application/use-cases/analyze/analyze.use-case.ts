import type { ICandidateReadRepo, ICandidateWriteRepo } from '../../../application/ports/repositories/candidate.interface';
import type { IJobReadRepo } from '../../../application/ports/repositories/job.interface';
import type { IAnalysisReadRepo, IAnalysisWriteRepo } from '../../../application/ports/repositories/analysis.interface';
import type { IAIService } from '../../../application/ports/services/ai.service';
import { CandidateStatus } from '../../../domain/candidate';
import { AnalysisEntity } from '../../../domain/analysis';
import { AnalysisInputDto, AnalysisOutputDto } from '../../dtos/analysis/analysis.dto';

export class AnalysisUseCase {
  constructor(
    private readonly candidateRepo: ICandidateReadRepo & ICandidateWriteRepo,
    private readonly jobRepo: IJobReadRepo,
    private readonly aiAnalyzeRepo: IAnalysisReadRepo & IAnalysisWriteRepo,
    private readonly geminiService: IAIService,
  ) { }

  async execute(input: AnalysisInputDto): Promise<AnalysisOutputDto> {
    const { candidateID, jobID } = input;

    const existingAnalysis = await this.aiAnalyzeRepo.getAnalysisByCandidateIdAndJobId(candidateID, jobID);
    if (existingAnalysis) {
      return existingAnalysis as AnalysisOutputDto;
    }

    const candidate = await this.candidateRepo.getById(candidateID);
    if (!candidate) throw new Error('Không tìm thấy thông tin ứng viên.');

    const job = await this.jobRepo.getById(jobID);
    if (!job) throw new Error('Không tìm thấy thông tin công việc (Job).');

    const analysisResult = await this.geminiService.analyzeCandidateWithJob(
      candidate.getDetailProfile(),
      job.getDetailJob(),
    );
    if (!analysisResult) throw new Error('Lỗi khi gọi AI phân tích dữ liệu.');

    const analysis = AnalysisEntity.create({
      jobID,
      candidateID,
      summary: analysisResult['summary'] as string | undefined,
      matchingScore: analysisResult['matchingScore'] as number | undefined,
      redFlags: analysisResult['redFlags'] as string[] | undefined,
      suggestedQuestions: analysisResult['suggestedQuestions'] as string[] | undefined
    });

    const savedAnalysis = await this.aiAnalyzeRepo.create(analysis);

    if (!savedAnalysis) throw new Error('Lỗi khi lưu kết quả phân tích.');

    candidate.updateStatus(CandidateStatus.SCREENING);
    await this.candidateRepo.update(candidate);

    return savedAnalysis as AnalysisOutputDto;
  }
}
