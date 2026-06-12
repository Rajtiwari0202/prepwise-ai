import { model, models, Schema, type InferSchemaType, type Model } from "mongoose";

const feedbackReportSchema = new Schema(
  {
    interviewId: { type: Schema.Types.ObjectId, ref: "Interview", required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    overallScore: { type: Number, required: true },
    communicationScore: { type: Number, required: true },
    technicalScore: { type: Number, required: true },
    confidenceScore: { type: Number, required: true },
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    missedConcepts: [{ type: String }],
    suggestedImprovements: [{ type: String }],
    recommendedTopics: [{ type: String }],
    sampleAnswers: [
      {
        question: String,
        answer: String,
      },
    ],
    transcript: [
      {
        question: String,
        answer: String,
        evaluation: String,
        score: Number,
      },
    ],
    isPublic: { type: Boolean, default: false },
    publicShareId: { type: String, unique: true, sparse: true },
  },
  { timestamps: true },
);

export type FeedbackReportDocument = InferSchemaType<typeof feedbackReportSchema> & {
  _id: string;
};

export const FeedbackReportModel =
  (models.FeedbackReport as Model<FeedbackReportDocument>) ||
  model<FeedbackReportDocument>("FeedbackReport", feedbackReportSchema);
