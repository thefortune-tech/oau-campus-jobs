
import { z } from "zod";

const futureDeadlineSchema = z.iso.datetime().refine(
  (value) => new Date(value).getTime() > Date.now(),
  { message: "Deadline must be in the future" },
);

export const createJobSchema = z.object({
  title: z.string().trim().min(3).max(150),
  description: z.string().trim().min(20).max(5000),
  category: z.string().trim().min(2).max(100),
  location: z.string().trim().min(2).max(150),
  compensation: z.string().trim().max(100).optional(),
  deadline: futureDeadlineSchema.optional(),
});

export const updateJobSchema = createJobSchema
  .extend({
    deadline: z.union([
      futureDeadlineSchema,
      z.literal(""),
    ]).optional(),
  })
  .partial()
  .refine(
    (data) => Object.values(data).some((value) => value !== undefined),
    {
      message: "At least one field must be provided to update a job",
    },
  );

export const jobIdSchema = z.coerce.number().int().positive();

export const listJobsSchema = z.object({
  search: z.string().trim().min(1).max(150).optional(),
  category: z.string().trim().min(1).max(100).optional(),
  location: z.string().trim().min(1).max(150).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export type CreateJobInput = z.infer<typeof createJobSchema>;
export type UpdateJobInput = z.infer<typeof updateJobSchema>;
export type ListJobsInput = z.infer<typeof listJobsSchema>;
