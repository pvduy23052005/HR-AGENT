import * as jobUseCase from "../../../../application/use-case/client/job.use-case.js";
import * as jobRepository from "../../../../infrastructure/database/repositories/client/job.repository.js";

export const createJob = async (req, res) => {
  try {
    const userID = res.locals.user.id || res.locals.user._id;
    const { title, description, requirements, status } = req.body;

    const newJob = await jobUseCase.createJob(jobRepository, {
      title,
      userID,
      description,
      requirements,
      status,
    });

    return res.status(201).json({
      success: true,
      message: "Tạo công việc thành công!",
      data: newJob,
    });
  } catch (error) {
    console.error("Error creating job:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Đã xảy ra lỗi khi tạo công việc!",
    });
  }
};
