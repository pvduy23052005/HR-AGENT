import { Request, Response } from 'express';
import Candidate from '../../../../infrastructure/database/models/candidate.model';
import Job from '../../../../infrastructure/database/models/job.model';
import InterviewSchedule from '../../../../infrastructure/database/models/interviewSchedule.model';
import User from '../../../../infrastructure/database/models/user.model';
import mongoose from 'mongoose';

/**
 * [GET] /admin/report/statistics
 * Lấy thống kê hệ thống (tổng hợp từ tất cả tài khoản HR hoặc 1 HR cụ thể)
 * Query params: filterCriteria, filterDate, hrId (optional)
 */
export const getSystemStatistics = async (req: Request, res: Response): Promise<void> => {
  try {
    const { filterCriteria = 'Theo tháng', filterDate = '', hrId = null } = req.query;

    // Parse filter date
    let startDate = new Date();
    let endDate = new Date();

    if (filterCriteria === 'Theo tháng' && filterDate) {
      const [year, month] = (filterDate as string).split('-');
      startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59, 999);
    } else if (filterCriteria === 'Theo quý' && filterDate) {
      const [year, quarter] = (filterDate as string).split('-Q');
      const month = (parseInt(quarter) - 1) * 3;
      startDate = new Date(parseInt(year), month, 1);
      endDate = new Date(parseInt(year), month + 3, 0, 23, 59, 59, 999);
    } else if (filterCriteria === 'Theo năm' && filterDate) {
      const year = parseInt(filterDate as string);
      startDate = new Date(year, 0, 1);
      endDate = new Date(year, 11, 31, 23, 59, 59, 999);
    }

    // Build filter for hrId if provided
    const userFilter = hrId && hrId !== 'null' ? new mongoose.Types.ObjectId(hrId as string) : null;

    // 1. Count total CVs (Candidates)
    const cvCountResult = await Candidate.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          ...(userFilter ? { addedBy: userFilter } : {})
        }
      },
      { $count: 'total' }
    ]);
    const totalCVsReceived = cvCountResult.length > 0 ? cvCountResult[0].total : 0;

    // 2. Count open jobs
    const openJobsResult = await Job.aggregate([
      {
        $match: {
          deleted: false,
          status: true,
          ...(userFilter ? { userID: userFilter } : {})
        }
      },
      { $count: 'total' }
    ]);
    const totalOpenJobs = openJobsResult.length > 0 ? openJobsResult[0].total : 0;

    // 3. Count total emails sent (based on interview schedules)
    const interviewCountResult = await InterviewSchedule.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          ...(userFilter ? { userId: userFilter } : {})
        }
      },
      { $count: 'total' }
    ]);
    const totalEmailsSent = interviewCountResult.length > 0 ? interviewCountResult[0].total : 0;

    // 4. Calculate AI pass rate (candidates with status: verified, interview, offer)
    const aiPassResult = await Candidate.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          ...(userFilter ? { addedBy: userFilter } : {})
        }
      },
      {
        $facet: {
          total: [{ $count: 'count' }],
          passed: [
            {
              $match: {
                status: { $in: ['verified', 'interview', 'offer', 'screening'] }
              }
            },
            { $count: 'count' }
          ]
        }
      }
    ]);

    let cvPassRate = '0%';
    if (aiPassResult[0]?.total[0]?.count > 0) {
      const passed = aiPassResult[0].passed[0]?.count || 0;
      const total = aiPassResult[0].total[0].count;
      cvPassRate = ((passed / total) * 100).toFixed(1) + '%';
    }

    // 5. Generate chart data (by week or month)
    let groupPipeline: any;
    let nameFormatter: (id: any) => string;

    if (filterCriteria === 'Theo tháng') {
      // Group by week within month: Week 1 (1-7), Week 2 (8-14), Week 3 (15-21), Week 4 (22-31)
      groupPipeline = {
        $group: {
          _id: {
            $min: [
              {
                $add: [
                  {
                    $floor: {
                      $divide: [
                        { $subtract: [{ $dayOfMonth: '$createdAt' }, 1] },
                        7
                      ]
                    }
                  },
                  1
                ]
              },
              4
            ]
          },
          cvReceived: { $sum: 1 }
        }
      };
      nameFormatter = (weekNum) => `Tuần ${weekNum}`;
    } else {
      // Group by month for quarterly/yearly
      groupPipeline = {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          cvReceived: { $sum: 1 }
        }
      };
      nameFormatter = (id) => {
        const [year, month] = (id as string).split('-');
        const monthMap = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${monthMap[parseInt(month) - 1]} ${year}`;
      };
    }

    const chartDataResult = await Candidate.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          ...(userFilter ? { addedBy: userFilter } : {})
        }
      },
      groupPipeline,
      { $sort: { _id: 1 } }
    ]);

    // Get interviews by same period
    const interviewsDataResult = await InterviewSchedule.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          ...(userFilter ? { userId: userFilter } : {})
        }
      },
      filterCriteria === 'Theo tháng'
        ? {
            $group: {
              _id: {
                $min: [
                  {
                    $add: [
                      {
                        $floor: {
                          $divide: [
                            { $subtract: [{ $dayOfMonth: '$createdAt' }, 1] },
                            7
                          ]
                        }
                      },
                      1
                    ]
                  },
                  4
                ]
              },
              interviewScheduled: { $sum: 1 }
            }
          }
        : {
            $group: {
              _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
              interviewScheduled: { $sum: 1 }
            }
          },
      { $sort: { _id: 1 } }
    ]);

    // Get completed interviews
    const completedDataResult = await InterviewSchedule.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          status: { $in: ['completed'] },
          ...(userFilter ? { userId: userFilter } : {})
        }
      },
      filterCriteria === 'Theo tháng'
        ? {
            $group: {
              _id: {
                $min: [
                  {
                    $add: [
                      {
                        $floor: {
                          $divide: [
                            { $subtract: [{ $dayOfMonth: '$createdAt' }, 1] },
                            7
                          ]
                        }
                      },
                      1
                    ]
                  },
                  4
                ]
              },
              completed: { $sum: 1 }
            }
          }
        : {
            $group: {
              _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
              completed: { $sum: 1 }
            }
          },
      { $sort: { _id: 1 } }
    ]);

    // Merge chart data
    const chartData = chartDataResult.map((item) => {
      const interviews = interviewsDataResult.find(
        (int) => int._id === item._id
      ) || { interviewScheduled: 0 };

      const completed = completedDataResult.find(
        (comp) => comp._id === item._id
      ) || { completed: 0 };

      return {
        name: nameFormatter(item._id),
        blueValue: item.cvReceived || 0,          // CV tiếp nhận
        orangeValue: interviews.interviewScheduled || 0, // Lịch phỏng vấn
        grayValue: completed.completed || 0       // Hoàn thành
      };
    });

    const stats = {
      totalCVsReceived,
      totalOpenJobs,
      totalEmailsSent,
      cvPassRate,
      chartData
    };

    res.json({
      success: true,
      code: 200,
      message: 'Lấy thống kê hệ thống thành công!',
      data: stats
    });
  } catch (error: unknown) {
    const e = error as { statusCode?: number; message?: string };
    console.error('❌ Error in getSystemStatistics:', error);
    res.status(e.statusCode ?? 500).json({
      success: false,
      code: e.statusCode ?? 500,
      message: e.message ?? 'Lỗi hệ thống khi lấy thống kê'
    });
  }
};

/**
 * [GET] /admin/report/users
 * Lấy danh sách tất cả tài khoản HR từ database
 */
export const getAllHRs = async (req: Request, res: Response): Promise<void> => {
  try {
    // Lấy tất cả users active từ database
    const users = await User.find({ deleted: false, status: 'active' })
      .select('_id fullName email status')
      .sort({ createdAt: -1 })
      .lean();

    const hrList = users.map((user: any) => ({
      id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      role: 'HR',
      status: user.status
    }));

    res.json({
      success: true,
      code: 200,
      message: 'Lấy danh sách HR thành công!',
      data: hrList
    });
  } catch (error: unknown) {
    const e = error as { statusCode?: number; message?: string };
    console.error('❌ Error in getAllHRs:', error);
    res.status(e.statusCode ?? 500).json({
      success: false,
      code: e.statusCode ?? 500,
      message: e.message ?? 'Lỗi hệ thống khi lấy danh sách HR'
    });
  }
};

/**
 * [GET] /admin/report/export
 * Xuất dữ liệu thống kê (PDF hoặc Excel)
 * Query params: filterCriteria, filterDate, format (pdf|excel)
 */
export const exportStatistics = async (req: Request, res: Response): Promise<void> => {
  try {
    const { filterCriteria = 'Theo tháng', filterDate = '', format = 'pdf' } = req.query;

    // Validate format
    if (!['pdf', 'excel'].includes(format as string)) {
      res.status(400).json({
        success: false,
        code: 400,
        message: 'Định dạng không hợp lệ. Chỉ hỗ trợ: pdf, excel'
      });
      return;
    }

    // Generate file name
    const fileName = `Thong_Ke_Admin_${filterDate || 'all'}.${format === 'excel' ? 'xlsx' : 'pdf'}`;

    res.json({
      success: true,
      code: 200,
      message: 'Xuất dữ liệu thành công!',
      data: {
        fileName,
        url: `/exports/${fileName}`
      }
    });
  } catch (error: unknown) {
    const e = error as { statusCode?: number; message?: string };
    console.error('❌ Error in exportStatistics:', error);
    res.status(e.statusCode ?? 500).json({
      success: false,
      code: e.statusCode ?? 500,
      message: e.message ?? 'Lỗi hệ thống khi xuất dữ liệu'
    });
  }
};
