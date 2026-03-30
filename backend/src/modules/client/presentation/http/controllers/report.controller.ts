import { Request, Response } from 'express';
import { GetStatisticsUseCase } from '../../../application/use-cases/report/get-statistics.use-case';
import { CandidateRepository } from '../../../infrastructure/database/repositories/candidate.repository';
import { InterviewScheduleRepository } from '../../../infrastructure/database/repositories/interviewSchedule.repository';

const candidateRepo = new CandidateRepository();
const interviewRepo = new InterviewScheduleRepository();
const getStatisticsUseCase = new GetStatisticsUseCase(candidateRepo, interviewRepo);

export const getStatistics = async (req: Request, res: Response): Promise<void> => {
  try {
    // User is injected by authMiddleware into res.locals.user
    const userId = res.locals.user?.id || res.locals.user?._id; 
    const { filterCriteria, filterDate } = req.query;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized, user ID not found' });
      return;
    }

    const reportData = await getStatisticsUseCase.execute(
      userId.toString(),
      filterCriteria as string,
      filterDate as string
    );

    res.status(200).json({
      success: true,
      data: reportData,
    });
  } catch (error) {
    console.error('Error getting statistics:', error);
    res.status(500).json({ success: false, message: 'Internal server error while fetching stats' });
  }
};
