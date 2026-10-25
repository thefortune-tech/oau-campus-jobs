
import { z } from "zod";

export const createApplicationSchema = z.object({
  jobId: z.coerce.number().int().positive(),
  coverMessage: z.string().trim().max(2000).optional(),
});

export const updateApplicationStatusSchema = z.object({
  status: z.enum(["SHORTLISTED", "ACCEPTED", "REJECTED"]),
});

export const applicationIdSchema = z.coerce.number().int().positive();

export type CreateApplicationInput = z.infer<
  typeof createApplicationSchema
>;

export type UpdateApplicationStatusInput = z.infer<
  typeof updateApplicationStatusSchema
>;
