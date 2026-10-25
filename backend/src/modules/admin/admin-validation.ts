
import { z } from "zod";

export const updateUserRoleSchema = z.object({
  role: z.enum(["STUDENT", "EMPLOYER"]),
});

export const verifyEmployerSchema = z.object({
  status: z.enum(["VERIFIED", "REJECTED"]),
});

export const moderateJobSchema = z.object({
  status: z.enum(["OPEN", "CLOSED"]),
});

export const reviewReportSchema = z.object({
  status: z.enum(["REVIEWED", "DISMISSED"]),
});

export type UpdateUserRoleInput = z.infer<
  typeof updateUserRoleSchema
>;

export type VerifyEmployerInput = z.infer<
  typeof verifyEmployerSchema
>;

export type ModerateJobInput = z.infer<
  typeof moderateJobSchema
>;

export type ReviewReportInput = z.infer<
  typeof reviewReportSchema
>;
