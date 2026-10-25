
import { prisma } from "../../database/prisma.js";
import type { CreateApplicationInput } from "./application-validation.js";

export async function createApplication(
  studentId: number,
  input: CreateApplicationInput,
) {
  const job = await prisma.job.findUnique({
    where: { id: input.jobId },
    select: {
      id: true,
      status: true,
      deadline: true,
    },
  });

  if (!job) {
    const error = new Error("Job not found");
    Object.assign(error, { statusCode: 404 });
    throw error;
  }

  if (job.status !== "OPEN") {
    const error = new Error("This job is no longer accepting applications");
    Object.assign(error, { statusCode: 400 });
    throw error;
  }

  if (job.deadline && job.deadline < new Date()) {
    const error = new Error("The application deadline has passed");
    Object.assign(error, { statusCode: 400 });
    throw error;
  }

  try {
    return await prisma.application.create({
      data: {
        studentId,
        jobId: input.jobId,
        coverMessage: input.coverMessage,
      },
      select: {
        id: true,
        studentId: true,
        jobId: true,
        coverMessage: true,
        status: true,
        appliedAt: true,
        job: {
          select: {
            title: true,
            location: true,
            employer: {
              select: {
                id: true,
                name: true,
              },
            },
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
      const duplicateError = new Error(
        "You have already applied for this job",
      );

      Object.assign(duplicateError, { statusCode: 409 });
      throw duplicateError;
    }

    throw error;
  }
}

export async function listStudentApplications(studentId: number) {
  return prisma.application.findMany({
    where: { studentId },
    orderBy: { appliedAt: "desc" },
    select: {
      id: true,
      jobId: true,
      coverMessage: true,
      status: true,
      appliedAt: true,
      updatedAt: true,
      job: {
        select: {
          title: true,
          category: true,
          location: true,
          compensation: true,
          status: true,
        },
      },
    },
  });
}

export async function listJobApplications(
  jobId: number,
  employerId: number,
) {
  const job = await prisma.job.findFirst({
    where: { id: jobId, employerId },
    select: { id: true },
  });

  if (!job) {
    const error = new Error("Job not found or you do not own this job");
    Object.assign(error, { statusCode: 404 });
    throw error;
  }

  return prisma.application.findMany({
    where: { jobId },
    orderBy: { appliedAt: "desc" },
    select: {
      id: true,
      coverMessage: true,
      status: true,
      appliedAt: true,
      student: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}



export async function updateApplicationStatus(
  applicationId: number,
  employerId: number,
  status: "SHORTLISTED" | "ACCEPTED" | "REJECTED",
) {
  const application = await prisma.application.findFirst({
    where: {
      id: applicationId,
      job: { employerId },
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (!application) {
    throw Object.assign(
      new Error(
        "Application not found or you do not own the associated job",
      ),
      { statusCode: 404 },
    );
  }

  if (
    application.status === "ACCEPTED" ||
    application.status === "REJECTED"
  ) {
    throw Object.assign(
      new Error("A finalised application cannot be updated"),
      { statusCode: 400 },
    );
  }

  const result = await prisma.application.updateMany({
    where: {
      id: applicationId,
      job: { employerId },
      status: { in: ["PENDING", "SHORTLISTED"] },
    },
    data: { status },
  });

  if (result.count === 0) {
    throw Object.assign(
      new Error("The application status has already been finalised"),
      { statusCode: 409 },
    );
  }

  return prisma.application.findUniqueOrThrow({
    where: { id: applicationId },
    select: {
      id: true,
      studentId: true,
      jobId: true,
      status: true,
      updatedAt: true,
    },
  });
}
