import { model, models, Schema, type InferSchemaType, type Model } from "mongoose";

const authTokenSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    tokenHash: { type: String, required: true, unique: true },
    type: { type: String, required: true, enum: ["email_verification", "password_reset"] },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
    usedAt: { type: Date },
  },
  { timestamps: true },
);

export type AuthTokenDocument = InferSchemaType<typeof authTokenSchema> & {
  _id: string;
};

export const AuthTokenModel =
  (models.AuthToken as Model<AuthTokenDocument>) || model<AuthTokenDocument>("AuthToken", authTokenSchema);
