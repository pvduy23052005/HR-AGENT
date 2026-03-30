import type { ICandidateReadRepo } from '../../../application/ports/repositories/candidate.interface';
import type { IInterviewScheduleRepository } from '../../../application/ports/repositories/interviewSchedule.interface';

export class GetStatisticsUseCase {
  constructor(
    private readonly candidateRepo: ICandidateReadRepo,
    private readonly interviewScheduleRepo: IInterviewScheduleRepository
  ) { }

  /** Trả về ngày đầu và cuối của một tuần ISO (Thứ 2 → Chủ nhật) trong năm hiện tại */
  private getWeekRange(isoWeek: number, year: number): { start: Date; end: Date } {
    // Ngày 4/1 luôn nằm ở tuần 1 (ISO 8601)
    const jan4 = new Date(year, 0, 4);
    const dayOfWeek = jan4.getDay() === 0 ? 7 : jan4.getDay(); // Thứ 2 = 1, CN = 7
    const startOfWeek1 = new Date(jan4);
    startOfWeek1.setDate(jan4.getDate() - (dayOfWeek - 1));

    const start = new Date(startOfWeek1);
    start.setDate(startOfWeek1.getDate() + (isoWeek - 1) * 7);

    const end = new Date(start);
    end.setDate(start.getDate() + 7);

    return { start, end };
  }

  /** Nhãn ngắn cho từng tháng */
  private readonly MONTH_LABELS = [
    '', 'Th.1', 'Th.2', 'Th.3', 'Th.4', 'Th.5', 'Th.6',
    'Th.7', 'Th.8', 'Th.9', 'Th.10', 'Th.11', 'Th.12',
  ];

  async execute(userId: string, filterCriteria: string, filterDate: string): Promise<any> {
    const now = new Date();
    const currentYear = now.getFullYear();

