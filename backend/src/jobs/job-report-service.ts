
import { prisma } from "../database/prisma.js";
import type { CreateJobReportInput } from "./job-report-validation.js";

export async function reportJob(
  reporterId: number,
  jobId: number,
  input: CreateJobReportInput,
) {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: { id: true, status: true },
  });

  if (!job) {
    throw Object.assign(new Error("Job not found"), {
      statusCode: 404,
    });
  }

  return prisma.reportedJob.create({
    data: {
      jobId,
      reporterId,
      reason: input.reason,
    },
    select: {
      id: true,
      jobId: true,
      reporterId: true,
      reason: true,
      
      createdAt: true,
    },
  });
}
