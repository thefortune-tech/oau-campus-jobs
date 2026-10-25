
import { prisma } from "../database/prisma.js";

import type {
  CreateJobInput,
  UpdateJobInput,
  ListJobsInput,
} from "./job-validation.js";

function serviceError(message: string, statusCode: number) {
  return Object.assign(new Error(message), { statusCode });
}


export async function createJob(
  employerId: number,
  input: CreateJobInput,
) {
  const employer = await prisma.employerProfile.findUnique({
    where: { userId: employerId },
    select: { verificationStatus: true },
  });

  if (!employer) {
    throw serviceError("Employer profile not found", 404);
  }

  if (employer.verificationStatus !== "VERIFIED") {
    throw serviceError(
      "Your employer account must be verified before posting jobs",
      403,
    );
  }

  return prisma.job.create({
    data: {
      ...input,
      deadline: input.deadline ? new Date(input.deadline) : undefined,
      employerId,
    },
    include: {
      employer: {
        select: { id: true, name: true },
      },
    },
  });
}

export async function listJobs(input: ListJobsInput) {
  const { search, category, location, page, limit } = input;

  const where = {
    status: "OPEN" as const,
    ...(category && {
      category: { contains: category, mode: "insensitive" as const },
    }),
    ...(location && {
      location: { contains: location, mode: "insensitive" as const },
    }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" as const } },
        { description: { contains: search, mode: "insensitive" as const } },
        { category: { contains: search, mode: "insensitive" as const } },
      ],
    }),
  };

  const [jobs, total] = await prisma.$transaction([
    prisma.job.findMany({
      where,
      include: {
        employer: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.job.count({ where }),
  ]);

  return {
    jobs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getJobById(id: number) {
  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      employer: { select: { id: true, name: true } },
    },
  });

  if (!job) {
    throw serviceError("Job not found", 404);
  }

  return job;
}

export async function listEmployerJobs(employerId: number) {
  return prisma.job.findMany({
    where: { employerId },
    include: {
      _count: { select: { applications: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateJob(
  id: number,
  employerId: number,
  input: UpdateJobInput,
) {
  const job = await prisma.job.findUnique({ where: { id } });

  if (!job) {
    throw serviceError("Job not found", 404);
  }

  if (job.employerId !== employerId) {
    throw serviceError("You cannot modify another employer's job", 403);
  }

  if (job.status === "CLOSED") {
    throw serviceError("Closed jobs cannot be edited", 400);
  }

  return prisma.job.update({
    where: { id },
    data: {
      ...input,
      deadline:
        input.deadline === undefined
          ? undefined
          : input.deadline === ""
            ? null
            : new Date(input.deadline),
    },
    include: {
      employer: { select: { id: true, name: true } },
    },
  });
}

export async function closeJob(id: number, employerId: number) {
  const job = await prisma.job.findUnique({ where: { id } });

  if (!job) {
    throw serviceError("Job not found", 404);
  }

  if (job.employerId !== employerId) {
    throw serviceError("You cannot modify another employer's job", 403);
  }

  if (job.status === "CLOSED") {
    throw serviceError("Job is already closed", 400);
  }

  return prisma.job.update({
    where: { id },
    data: { status: "CLOSED" },
  });
}

export async function deleteJob(id: number, employerId: number) {
  const job = await prisma.job.findUnique({ where: { id } });

  if (!job) {
    throw serviceError("Job not found", 404);
  }

  if (job.employerId !== employerId) {
    throw serviceError("You cannot delete another employer's job", 403);
  }

  const applicationCount = await prisma.application.count({
    where: { jobId: id },
  });

  if (applicationCount > 0) {
    throw serviceError(
      "This job has applications. Close it instead of deleting it.",
      409,
    );
  }

  await prisma.job.delete({ where: { id } });

  return { message: "Job deleted successfully" };
}


export async function saveJob(studentId: number, jobId: number) {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: { id: true, status: true },
  });

  if (!job) {
    throw serviceError("Job not found", 404);
  }

  if (job.status !== "OPEN") {
    throw serviceError("Only open jobs can be saved", 400);
  }

  try {
    return await prisma.savedJob.create({
      data: { studentId, jobId },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            category: true,
            location: true,
            status: true,
          },
        },
      },
    });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      throw serviceError("Job is already saved", 409);
    }

    throw error;
  }
}

export async function listSavedJobs(studentId: number) {
  return prisma.savedJob.findMany({
    where: { studentId },
    include: {
      job: {
        include: {
          employer: {
            select: { id: true, name: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function unsaveJob(studentId: number, jobId: number) {
  const savedJob = await prisma.savedJob.findUnique({
    where: {
      studentId_jobId: { studentId, jobId },
    },
  });

  if (!savedJob) {
    throw serviceError("Saved job not found", 404);
  }

  await prisma.savedJob.delete({
    where: {
      studentId_jobId: { studentId, jobId },
    },
  });

  return { message: "Job removed from saved jobs" };
}