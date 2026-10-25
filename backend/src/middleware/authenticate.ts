
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

type UserRole = "STUDENT" | "EMPLOYER" | "ADMIN";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    role: UserRole;
  };
}

function isUserRole(role: unknown): role is UserRole {
  return (
    role === "STUDENT" ||
    role === "EMPLOYER" ||
    role === "ADMIN"
  );
}

export function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void {
  const authorization = req.headers.authorization;
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice(7)
    : undefined;

  if (!token) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }

  const secret = process.env.JWT_SECRET;

  if (!secret || secret.length < 32) {
    next(new Error("JWT_SECRET must be at least 32 characters long"));
    return;
  }

  try {
    const payload = jwt.verify(token, secret);

    if (
      typeof payload !== "object" ||
      payload === null ||
      typeof payload.sub !== "string" ||
      !/^[1-9]\d*$/.test(payload.sub) ||
      !Number.isSafeInteger(Number(payload.sub)) ||
      !isUserRole(payload.role)
    ) {
      res.status(401).json({
        message: "Invalid authentication token",
      });
      return;
    }

    req.user = {
      id: Number(payload.sub),
      role: payload.role,
    };

    next();
  } catch {
    res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}

export function requireEmployer(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void {
  if (req.user?.role !== "EMPLOYER") {
    res.status(403).json({ message: "Employer access required" });
    return;
  }

  next();
}

export function requireStudent(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void {
  if (req.user?.role !== "STUDENT") {
    res.status(403).json({ message: "Student access required" });
    return;
  }

  next();
}

export function requireAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void {
  if (req.user?.role !== "ADMIN") {
    res.status(403).json({
      message: "Administrator access required",
    });
    return;
  }

  next();
}
