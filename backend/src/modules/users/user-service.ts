
import { prisma } from "../../database/prisma.js";
import type {
  UpdateEmployerProfileInput,
  UpdateStudentProfileInput,
} from "./user-validation.js";

export async function getMyProfile(userId: number, role: "STUDENT" | "EMPLOYER") {
  if (role === "STUDENT") {
    const profile = await prisma.studentProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });

    if (!profile) {
      throw Object.assign(new Error("Student profile not found"), {
        statusCode: 404,
      });
    }

    return profile;
  }

  const profile = await prisma.employerProfile.findUnique({
    where: { userId },
    include: {
      user: {
        select: { id: true, name: true, email: true, role: true },
      },
    },
  });

  if (!profile) {
    throw Object.assign(new Error("Employer profile not found"), {
      statusCode: 404,
    });
  }

  return profile;
}

export async function updateStudentProfile(
  userId: number,
  input: UpdateStudentProfileInput,
) {
  return prisma.studentProfile.update({
    where: { userId },
    data: input,
  });
}

export async function updateEmployerProfile(
  userId: number,
  input: UpdateEmployerProfileInput,
) {
  const { organizationName, ...details } = input;

  return prisma.employerProfile.update({
    where: { userId },
    data: {
      ...details,
      ...(organizationName !== undefined ? { organizationName } : {}),
    },
  });
}

