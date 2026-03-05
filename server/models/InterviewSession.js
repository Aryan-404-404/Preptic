import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String
  },
  score: {
    type: Number,
    default: 0
  },
  feedback: {
    type: String
  }
});

const interviewSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    trackType: {
      type: String,
      enum: ["niche", "behavioral", "combo"],
      required: true
    },

    level: {
      type: Number,
      min: 1,
      max: 3,
      required: true
    },
    
    niche: { type: String },
    techStack: { type: [String] },

    questions: [questionSchema],

    finalScore: {
      type: Number,
      default: 0
    },

    passed: {
      type: Boolean,
      default: false
    },

    status: {
      type: String,
      enum: ["in-progress", "completed"],
      default: "in-progress"
    }
  },
  { timestamps: true }
);

export default mongoose.model("InterviewSession", interviewSessionSchema);