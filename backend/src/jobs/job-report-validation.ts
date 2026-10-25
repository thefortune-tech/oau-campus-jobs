
import { z } from "zod";

export const createJobReportSchema = z.object({
  reason: z.string().trim().min(10).max(1000),
});

export const jobReportIdSchema = z.coerce.number().int().positive();

export type CreateJobReportInput = z.infer<
  typeof createJobReportSchema
>;
