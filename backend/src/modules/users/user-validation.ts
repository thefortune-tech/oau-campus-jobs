
import { z } from "zod";

export const updateStudentProfileSchema = z.object({
  department: z.string().trim().max(100).nullable().optional(),
  level: z.string().trim().max(50).nullable().optional(),
  skills: z.array(z.string().trim().min(1).max(100)).max(50).optional(),
  cvUrl: z.url().nullable().optional(),
}).refine(
  (data) => Object.values(data).some((value) => value !== undefined),
  { message: "At least one field must be provided" },
);

export const updateEmployerProfileSchema = z.object({
  organizationName: z.string().trim().min(2).max(150).optional(),
  description: z.string().trim().max(2000).nullable().optional(),
  website: z.url().nullable().optional(),
  phone: z.string().trim().max(30).nullable().optional(),
}).refine(
  (data) => Object.values(data).some((value) => value !== undefined),
  { message: "At least one field must be provided" },
);

export type UpdateStudentProfileInput = z.infer<
  typeof updateStudentProfileSchema
>;

export type UpdateEmployerProfileInput = z.infer<
  typeof updateEmployerProfileSchema
>;
