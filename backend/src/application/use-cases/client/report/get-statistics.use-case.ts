import Candidate from '../../../../infrastructure/database/models/candidate.model';
import InterviewSchedule from '../../../../infrastructure/database/models/interviewSchedule.model';
import mongoose from 'mongoose';

export class GetStatisticsUseCase {
  async execute(userId: string, filterCriteria: string, filterDate: string): Promise<any> {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // ── Parse filterDate ─────────────────────────────────────────────────────
    // filterDate format: "2026-03" (month picker from frontend)
    const [yearStr, monthStr] = (filterDate ?? '').split('-');
    const year  = parseInt(yearStr  ?? String(new Date().getFullYear()), 10);
    const month = parseInt(monthStr ?? String(new Date().getMonth() + 1), 10);

    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth   = new Date(year, month,     1); // exclusive

    // ── 1. Total CVs by this user (all time for the stat card) ────────────────
    const totalCVs = await Candidate.countDocuments({ addedBy: userObjectId });

    // ── 2. Interviews linked to this user (all time) ──────────────────────────
    const totalInterviews = await InterviewSchedule.countDocuments({ userId: userObjectId });

    // ── 3. Completed interviews ───────────────────────────────────────────────
    const totalCompleted = await InterviewSchedule.countDocuments({
      userId: userObjectId,
      status: 'completed',
    });

    // Response rate = completed / totalCVs
    const responseRate = totalCVs > 0
      ? `${Math.round((totalCompleted / totalCVs) * 100)}%`
      : '0%';

    // ── 4. Weekly chart data for selected month ───────────────────────────────
    // Group CVs by ISO week number (1-4) within the month
    const cvsByWeek: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
    const interviewsByWeek: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
    const completedByWeek: Record<number, number>  = { 1: 0, 2: 0, 3: 0, 4: 0 };

    const getWeek = (date: Date): number => {
      const day = date.getDate();
      if (day <= 7)  return 1;
      if (day <= 14) return 2;
      if (day <= 21) return 3;
      return 4;
    };

    // CVs in this month
    const cvsThisMonth = await Candidate.find({
      addedBy: userObjectId,
      createdAt: { $gte: startOfMonth, $lt: endOfMonth },
    }).select('createdAt').lean();

    for (const cv of cvsThisMonth) {
      const w = getWeek(new Date((cv as any).createdAt));
      cvsByWeek[w] = (cvsByWeek[w] ?? 0) + 1;
    }

    // Interviews in this month
    const interviewsThisMonth = await InterviewSchedule.find({
      userId: userObjectId,
      time: { $gte: startOfMonth, $lt: endOfMonth },
    }).select('time status').lean();

    for (const iv of interviewsThisMonth) {
      const w = getWeek(new Date((iv as any).time));
      interviewsByWeek[w] = (interviewsByWeek[w] ?? 0) + 1;
      if ((iv as any).status === 'completed') {
        completedByWeek[w] = (completedByWeek[w] ?? 0) + 1;
      }
    }

    const chartData = [1, 2, 3, 4].map((w) => ({
      name: `Tuần ${w}`,
      blueValue:   cvsByWeek[w],        // CV tiếp nhận
      orangeValue: interviewsByWeek[w], // Lịch phỏng vấn
      grayValue:   completedByWeek[w],  // Phỏng vấn hoàn thành
    }));

    return {
      totalCVs,
      totalEmailsSent: totalInterviews, // dùng tổng interview như proxy "emails gửi"
      responseRate,
      chartData,
    };
  }
}

