import type { ICandidateReadRepo } from '../../../../domain/interfaces/client/candidate.interface';
import type { IInterviewScheduleRepository } from '../../../../domain/interfaces/client/interviewSchedule.interface';

export class GetStatisticsUseCase {
  constructor(
    private readonly candidateRepo: ICandidateReadRepo,
    private readonly interviewScheduleRepo: IInterviewScheduleRepository
  ) {}

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

    // ── 1. Xác định khoảng thời gian cho stat cards ───────────────────────────
    let startDate: Date | undefined;
    let endDate: Date | undefined;

    if (filterCriteria === 'Theo tháng') {
      const month = parseInt(filterDate ?? String(now.getMonth() + 1), 10) || now.getMonth() + 1;
      startDate = new Date(currentYear, month - 1, 1);
      endDate   = new Date(currentYear, month,     1);
    } else if (filterCriteria === 'Theo Tuần') {
      const isoWeek = parseInt(filterDate ?? '1', 10) || 1;
      const { start, end } = this.getWeekRange(isoWeek, currentYear);
      startDate = start;
      endDate = end;
    }

    // ── 2. Tính stat cards theo khoảng thời gian tương ứng ────────────────────
    const [totalCVs, totalInterviews, totalCompleted] = await Promise.all([
      this.candidateRepo.countForStatistics(userId, startDate, endDate),
      this.interviewScheduleRepo.countForStatistics(userId, startDate, endDate),
      this.candidateRepo.countForStatistics(userId, startDate, endDate, 'offer'),
    ]);

    const responseRate = totalCVs > 0
      ? `${Math.round((totalCompleted / totalCVs) * 100)}%`
      : '0%';

    // ── 2. Chart data theo tiêu chí ──────────────────────────────────────────
    let chartData: { name: string; blueValue: number; orangeValue: number; grayValue: number }[] = [];

    // ── Toàn thời gian: biểu đồ theo từng tháng trong năm hiện tại ───────────
    if (!filterCriteria || filterCriteria === 'Toàn thời gian') {
      const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

      for (const m of months) {
        const start = new Date(currentYear, m - 1, 1);
        const end   = new Date(currentYear, m,     1);

        const [cvCount, ivCount, doneCount] = await Promise.all([
          this.candidateRepo.countForStatistics(userId, start, end),
          this.interviewScheduleRepo.countForStatistics(userId, start, end),
          this.candidateRepo.countForStatistics(userId, start, end, 'offer'),
        ]);

        chartData.push({
          name: this.MONTH_LABELS[m],
          blueValue:   cvCount,
          orangeValue: ivCount,
          grayValue:   doneCount,
        });
      }
    }

    // ── Theo tháng: biểu đồ theo tuần (1–4) trong tháng được chọn ───────────
    else if (filterCriteria === 'Theo tháng') {
      const month = parseInt(filterDate ?? String(now.getMonth() + 1), 10) || now.getMonth() + 1;
      const startOfMonth = new Date(currentYear, month - 1, 1);
      const endOfMonth   = new Date(currentYear, month,     1);

      const getWeekOfMonth = (date: Date): number => {
        const day = date.getDate();
        if (day <= 7)  return 1;
        if (day <= 14) return 2;
        if (day <= 21) return 3;
        return 4;
      };

      const cvsByWeek:        Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
      const interviewsByWeek: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
      const completedByWeek:  Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };

      const [cvsThisMonth, ivThisMonth, doneThisMonth] = await Promise.all([
        this.candidateRepo.getForStatistics(userId, startOfMonth, endOfMonth),
        this.interviewScheduleRepo.getForStatistics(userId, startOfMonth, endOfMonth),
        this.candidateRepo.getForStatistics(userId, startOfMonth, endOfMonth, 'offer'),
      ]);

      for (const cv of cvsThisMonth) {
        if (cv.createdAt) cvsByWeek[getWeekOfMonth(new Date(cv.createdAt))]++;
      }
      for (const iv of ivThisMonth) {
        if (iv.time) interviewsByWeek[getWeekOfMonth(new Date(iv.time))]++;
      }
      for (const done of doneThisMonth) {
        if (done.updatedAt) completedByWeek[getWeekOfMonth(new Date(done.updatedAt))]++;
      }

      chartData = [1, 2, 3, 4].map((w) => ({
        name:        `Tuần ${w}`,
        blueValue:   cvsByWeek[w],
        orangeValue: interviewsByWeek[w],
        grayValue:   completedByWeek[w],
      }));
    }

    // ── Theo Tuần: biểu đồ theo từng ngày (Thứ 2 → CN) của tuần được chọn ──
    else if (filterCriteria === 'Theo Tuần') {
      const isoWeek = parseInt(filterDate ?? '1', 10) || 1;
      const { start: weekStart, end: weekEnd } = this.getWeekRange(isoWeek, currentYear);

      const DAY_LABELS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
      const cvsByDay:        number[] = Array(7).fill(0);
      const interviewsByDay: number[] = Array(7).fill(0);
      const completedByDay:  number[] = Array(7).fill(0);

      const [cvsThisWeek, ivThisWeek, doneThisWeek] = await Promise.all([
        this.candidateRepo.getForStatistics(userId, weekStart, weekEnd),
        this.interviewScheduleRepo.getForStatistics(userId, weekStart, weekEnd),
        this.candidateRepo.getForStatistics(userId, weekStart, weekEnd, 'offer'),
      ]);

      // getDay(): 0=CN, 1=T2...6=T7 → chuyển sang index 0=T2...6=CN
      const dayIndex = (date: Date): number => {
        const d = date.getDay();
        return d === 0 ? 6 : d - 1; // CN → index 6, T2 → index 0
      };

      for (const cv of cvsThisWeek) {
        if (cv.createdAt) cvsByDay[dayIndex(new Date(cv.createdAt))]++;
      }
      for (const iv of ivThisWeek) {
        if (iv.time) interviewsByDay[dayIndex(new Date(iv.time))]++;
      }
      for (const done of doneThisWeek) {
        if (done.updatedAt) completedByDay[dayIndex(new Date(done.updatedAt))]++;
      }

      chartData = DAY_LABELS.map((label, i) => ({
        name:        label,
        blueValue:   cvsByDay[i],
        orangeValue: interviewsByDay[i],
        grayValue:   completedByDay[i],
      }));
    }

    return {
      totalCVs,
      totalEmailsSent: totalInterviews,
      responseRate,
      chartData,
    };
  }
}
