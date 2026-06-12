import { AuthTokenModel } from "@/models/AuthToken";
import { createOpaqueToken, hashToken } from "@/lib/utils/crypto";

export async function createAuthToken(userId: string, type: "email_verification" | "password_reset") {
  const token = createOpaqueToken();
  const hours = type === "password_reset" ? 1 : 24;

  await AuthTokenModel.create({
    userId,
    type,
    tokenHash: hashToken(token),
    expiresAt: new Date(Date.now() + hours * 60 * 60 * 1000),
  });

  return token;
}
