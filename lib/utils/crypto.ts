import crypto from "node:crypto";

export function createOpaqueToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function createShareId() {
  return crypto.randomBytes(10).toString("base64url");
}
