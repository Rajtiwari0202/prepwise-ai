import type { InterviewDifficulty, InterviewMode, InterviewRole } from "@/types/interview";

export const interviewModes: Array<{ value: InterviewMode; label: string; description: string }> = [
  {
    value: "dsa",
    label: "DSA",
    description: "Algorithms, data structures, complexity, and problem-solving narration.",
  },
  {
    value: "hr",
    label: "HR",
    description: "Behavioral signals, motivation, ownership, teamwork, and clarity.",
  },
  {
    value: "resume",
    label: "Resume-based",
    description: "Questions grounded in projects, internships, skills, and career story.",
  },
  {
    value: "mixed",
    label: "Mixed",
    description: "A realistic blend of technical, resume, and behavioral questions.",
  },
];

export const interviewRoles: InterviewRole[] = [
  "Frontend Engineer",
  "Backend Engineer",
  "Full-stack Engineer",
  "SDE Intern",
  "Data Structures Specialist",
  "Product Engineer",
];

export const interviewDifficulties: Array<{ value: InterviewDifficulty; label: string }> = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];
