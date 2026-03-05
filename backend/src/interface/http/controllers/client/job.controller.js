import * as jobUseCase from "../../../../application/use-case/client/job.use-case.js";
import * as jobRepository from "../../../../infrastructure/database/repositories/client/job.repository.js";

// [post] admin/job/create
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

// [patch] /job/update/:id
export const updateJob = async (req, res) => {
  try {
    const userID = res.locals.user.id || res.locals.user._id;
    const jobId = req.params.id;
    const { title, description, requirements, status } = req.body;

    const updatedJob = await jobUseCase.updateJob(
      jobRepository,
      jobId,
      userID,
      {
        title,
        description,
        requirements,
        status,
      },
    );

    return res.status(200).json({
      success: true,
      message: "Cập nhật công việc thành công!",
      data: updatedJob,
    });
  } catch (error) {
    console.error("Error updating job:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Đã xảy ra lỗi khi cập nhật công việc!",
    });
  }
};
