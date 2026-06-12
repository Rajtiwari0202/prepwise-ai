import { z } from "zod";

export const profileSchema = z.object({
  targetRole: z.string().trim().min(2).max(80),
  experienceLevel: z.string().trim().min(2).max(80),
  skills: z.array(z.string().trim().min(1).max(40)).max(24),
  resumeText: z.string().max(12000).optional().default(""),
});

export type ProfileInput = z.infer<typeof profileSchema>;
