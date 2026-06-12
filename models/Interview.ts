import { model, models, Schema, type InferSchemaType, type Model } from "mongoose";

const interviewSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    mode: { type: String, required: true, enum: ["dsa", "hr", "resume", "mixed"] },
    role: { type: String, required: true },
    difficulty: { type: String, required: true, enum: ["beginner", "intermediate", "advanced"] },
    status: { type: String, required: true, enum: ["draft", "active", "completed"], default: "active" },
    currentQuestionIndex: { type: Number, default: 0 },
    summary: {
      overallScore: { type: Number, default: 0 },
      totalQuestions: { type: Number, default: 0 },
      completedAnswers: { type: Number, default: 0 },
    },
    completedAt: { type: Date },
  },
  { timestamps: true },
);

export type InterviewDocument = InferSchemaType<typeof interviewSchema> & {
  _id: string;
};

export const InterviewModel =
  (models.Interview as Model<InterviewDocument>) ||
  model<InterviewDocument>("Interview", interviewSchema);
