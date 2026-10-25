
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../database/prisma.js";
import type { LoginInput, RegisterInput } from "./auth-validation.js";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters long");
  }

  return secret;
}

function isPrismaUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
}

export async function registerUser(input: RegisterInput) {
  // Validate configuration before performing database writes.
  const secret = getJwtSecret();

  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existingUser) {
    throw Object.assign(new Error("Email is already registered"), {
      statusCode: 409,
    });
  }

  const passwordHash = await bcrypt.hash(input.password, 12);

  let user;

  try {
    user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash,
        role: input.role,
        ...(input.role === "STUDENT"
          ? {
              studentProfile: {
                create: {},
              },
            }
          : {
              employerProfile: {
                create: {
                  organizationName: input.name,
                  verificationStatus: "PENDING",
                },
              },
            }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
  } catch (error: unknown) {
    // Handle duplicate emails even when concurrent requests race.
    if (isPrismaUniqueConstraintError(error)) {
      throw Object.assign(new Error("Email is already registered"), {
        statusCode: 409,
      });
    }

    throw error;
  }

  const token = jwt.sign(
    { sub: String(user.id), role: user.role },
    secret,
    { expiresIn: "1d" },
  );

  return { user, token };
}

export async function loginUser(input: LoginInput) {
  const secret = getJwtSecret();

  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) {
    throw Object.assign(new Error("Invalid email or password"), {
      statusCode: 401,
    });
  }

  const token = jwt.sign(
    { sub: String(user.id), role: user.role },
    secret,
    { expiresIn: "1d" },
  );

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
    token,
  };
}
