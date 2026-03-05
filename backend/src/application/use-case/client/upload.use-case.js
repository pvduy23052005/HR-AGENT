export const uploadCV = async (
  candidateRepository,
  jobRepository,
  uploadService,
  geminiService,
  userID,
  jobID,
  file,
) => {
  if (!file) return res.status(400).json({ message: "No file uploaded" });

  const job = await jobRepository.getJobById(jobID);

  if (!job) {
    throw new Error("Công việc không đúng ");
  }

  const fileUrls = await uploadService.uploadCloud([file]);

  if (!fileUrls || fileUrls.length === 0) {
    throw new Error("Upalod CV thất bại");
  }

  const cvLink = fileUrls[0];

  let dataCV = {
    jobId: jobID,
    addedBy: userID,
    personal: { cvLink: cvLink },
  };

  if (
    file.mimetype === "application/pdf" ||
    file.mimetype.startsWith("image/")
  ) {
    console.log("Đang ném file cho Gemini làm OCR...");

    const extractedData = await geminiService.extractCV(
      file.buffer,
      file.mimetype,
    );

    if (extractedData) {
      dataCV = {
        ...extractedData,
        jobId: jobID,
        addedBy: userID,
        personal: {
          ...extractedData.personal,
          cvLink: cvLink,
        },
      };
    }
  }

  const newCandidate = await candidateRepository.createCandidate(dataCV);

  return {
    cvLink,
    newCandidate,
    dataCV,
  };
};
