import { model, models, Schema, type InferSchemaType, type Model } from "mongoose";

const answerSchema = new Schema(
  {
    interviewId: { type: Schema.Types.ObjectId, ref: "Interview", required: true, index: true },
    questionId: { type: Schema.Types.ObjectId, ref: "Question", required: true },
    text: { type: String, required: true, maxlength: 8000 },
    transcriptSource: { type: String, enum: ["text", "voice"], default: "text" },
    evaluation: { type: String, required: true },
    score: { type: Number, required: true, min: 0, max: 100 },
    strengths: [{ type: String }],
    improvements: [{ type: String }],
  },
  { timestamps: true },
);

export type AnswerDocument = InferSchemaType<typeof answerSchema> & {
  _id: string;
};

export const AnswerModel =
  (models.Answer as Model<AnswerDocument>) || model<AnswerDocument>("Answer", answerSchema);
