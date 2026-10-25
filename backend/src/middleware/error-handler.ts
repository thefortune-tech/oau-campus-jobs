
import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { Prisma } from "../generated/prisma/client.js";

export const errorHandler: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next,
) => {
  if (error instanceof ZodError) {
    res.status(400).json({
      message: "Validation failed",
      errors: error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2025") {
      res.status(404).json({ message: "Resource not found" });
      return;
    }

    if (error.code === "P2002") {
      res.status(409).json({ message: "A record with this value already exists" });
      return;
    }

    console.error("Prisma error:", error.code, error.message);
    res.status(500).json({ message: "Database operation failed" });
    return;
  }

  const statusCode =
    typeof error?.statusCode === "number" &&
    error.statusCode >= 400 &&
    error.statusCode <= 599
      ? error.statusCode
      : 500;

  if (statusCode >= 500) {
    console.error(error);
  }

  res.status(statusCode).json({
    message:
      statusCode === 500
        ? "Internal server error"
        : error.message,
  });
};
