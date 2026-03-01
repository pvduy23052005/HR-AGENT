const mongoose = require("mongoose");

const interviewScheduleSchema = new mongoose.Schema(
  {
    time: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled", "rescheduled"],
      default: "scheduled",
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const InterviewSchedule = mongoose.model(
  "InterviewSchedule",
  interviewScheduleSchema,
);

module.exports = InterviewSchedule;
