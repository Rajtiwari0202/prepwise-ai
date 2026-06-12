import { model, models, Schema, type InferSchemaType, type Model } from "mongoose";

const questionSchema = new Schema(
  {
    interviewId: { type: Schema.Types.ObjectId, ref: "Interview", required: true, index: true },
    text: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ["technical", "behavioral", "resume", "follow_up"],
    },
    topic: { type: String, required: true },
    expectedSignals: [{ type: String }],
    order: { type: Number, required: true },
  },
  { timestamps: true },
);

export type QuestionDocument = InferSchemaType<typeof questionSchema> & {
  _id: string;
};

export const QuestionModel =
  (models.Question as Model<QuestionDocument>) || model<QuestionDocument>("Question", questionSchema);
