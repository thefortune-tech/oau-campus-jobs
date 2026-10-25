import { prisma } from "../../database/prisma.js";
import type {
  ModerateJobInput,
  ReviewReportInput,
  UpdateUserRoleInput,
  VerifyEmployerInput,
} from "./admin-validation.js";

export async function getAllUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      studentProfile: true,
      employerProfile: true,
    },
    orderBy: { createdAt: "desc" },
  });
}


export async function updateUserRole(
  userId: number,
  input: UpdateUserRoleInput,
  adminId: number,
) {
  if (userId === adminId) {
    const error = new Error("You cannot change your own role");
    Object.assign(error, { statusCode: 403 });
    throw error;
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true },
  });

  if (!targetUser) {
    const error = new Error("User not found");
    Object.assign(error, { statusCode: 404 });
    throw error;
  }

  

  return prisma.user.update({
    where: { id: userId },
    data: { role: input.role },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      updatedAt: true,
    },
  });
}


export async function getPendingEmployers() {
  return prisma.employerProfile.findMany({
    where: { verificationStatus: "PENDING" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });
}


export async function verifyEmployer(
  employerProfileId: number,
  input: VerifyEmployerInput,
) {
  const employer = await prisma.employerProfile.findUnique({
    where: { id: employerProfileId },
    select: { id: true },
  });

  if (!employer) {
    throw Object.assign(new Error("Employer profile not found"), {
      statusCode: 404,
    });
  }

  return prisma.employerProfile.update({
    where: { id: employerProfileId },
    data: { verificationStatus: input.status },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

export async function getAllJobs() {
  return prisma.job.findMany({
    include: {
      employer: {
        select: {
          id: true,
          name: true,
          employerProfile: {
            select: {
              organizationName: true,
              verificationStatus: true,
            },
          },
        },
      },
      _count: {
        select: {
          applications: true,
          reports: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}


export async function moderateJob(
  jobId: number,
  input: ModerateJobInput,
) {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: { id: true },
  });

  if (!job) {
    throw Object.assign(new Error("Job not found"), {
      statusCode: 404,
    });
  }

  return prisma.job.update({
    where: { id: jobId },
    data: { status: input.status },
  });
}

export async function getReportedJobs() {
  return prisma.reportedJob.findMany({
    include: {
      job: {
        select: {
          id: true,
          title: true,
          status: true,
        },
      },
      reporter: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}



export async function reviewReport(
  reportId: number,
  input: ReviewReportInput,
) {
  const result = await prisma.reportedJob.updateMany({
    where: {
      id: reportId,
      status: "PENDING",
    },
    data: {
      status: input.status,
      reviewedAt: new Date(),
    },
  });

  if (result.count === 0) {
    const report = await prisma.reportedJob.findUnique({
      where: { id: reportId },
      select: { id: true },
    });

    if (!report) {
      throw Object.assign(new Error("Report not found"), {
        statusCode: 404,
      });
    }

    throw Object.assign(
      new Error("This report has already been reviewed"),
      { statusCode: 409 },
    );
  }

  return prisma.reportedJob.findUniqueOrThrow({
    where: { id: reportId },
  });
}
