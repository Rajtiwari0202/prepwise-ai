import { model, models, Schema, type InferSchemaType, type Model } from "mongoose";

const profileSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    targetRole: { type: String, default: "SDE Intern" },
    experienceLevel: { type: String, default: "Student" },
    skills: [{ type: String, trim: true }],
    resumeText: { type: String, default: "", maxlength: 12000 },
  },
  { timestamps: true },
);

export type ProfileDocument = InferSchemaType<typeof profileSchema> & {
  _id: string;
};

export const ProfileModel =
  (models.Profile as Model<ProfileDocument>) || model<ProfileDocument>("Profile", profileSchema);
