export const validateAnalyizeCandidate = (req, res, next) => {
  const { jobID, candidateID } = req.body;

  if (!jobID || !candidateID) {
    return res.status(400).json({
      success: false,
      message: "jobId and candidateID are required.",
    });
  }

  next();
};
