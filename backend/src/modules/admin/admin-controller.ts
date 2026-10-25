import type { Request, Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "../../middleware/authenticate.js";

import {
  getAllUsers,
  updateUserRole,
  getPendingEmployers,
  verifyEmployer,
  getAllJobs,
  moderateJob,
  getReportedJobs,
  reviewReport,
} from "./admin-service.js";

import {
  moderateJobSchema,
  reviewReportSchema,
  updateUserRoleSchema,
  verifyEmployerSchema,
} from "./admin-validation.js";
function parseId(value: string): number {
  const id = Number(value);

  if (!Number.isSafeInteger(id) || id <= 0) {
    throw Object.assign(new Error("Invalid resource ID"), {
      statusCode: 400,
    });
  }

  return id;
}

export async function listUsers(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const users = await getAllUsers();
    res.status(200).json({ data: users });
  } catch (error) {
    next(error);
  }
}

export async function changeUserRole(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = parseId(String(req.params.id));
    const input = updateUserRoleSchema.parse(req.body);
   const user = await updateUserRole(
  id,
  input,
  req.user!.id,
);

    res.status(200).json({
      message: "User role updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function listPendingEmployers(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const employers = await getPendingEmployers();
    res.status(200).json({ data: employers });
  } catch (error) {
    next(error);
  }
}

export async function changeEmployerVerification(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = parseId(String(req.params.id));
    const input = verifyEmployerSchema.parse(req.body);
    const employer = await verifyEmployer(id, input);

    res.status(200).json({
      message: "Employer verification updated successfully",
      data: employer,
    });
  } catch (error) {
    next(error);
  }
}

export async function listAllJobs(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const jobs = await getAllJobs();
    res.status(200).json({ data: jobs });
  } catch (error) {
    next(error);
  }
}

export async function changeJobModeration(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = parseId(String(req.params.id));
    const input = moderateJobSchema.parse(req.body);
    const job = await moderateJob(id, input);

    res.status(200).json({
      message: "Job status updated successfully",
      data: job,
    });
  } catch (error) {
    next(error);
  }
}

export async function listReportedJobs(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const reports = await getReportedJobs();
    res.status(200).json({ data: reports });
  } catch (error) {
    next(error);
  }
}

export async function changeReportReview(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = parseId(String(req.params.id));
    const input = reviewReportSchema.parse(req.body);
    const report = await reviewReport(id, input);

    res.status(200).json({
      message: "Report reviewed successfully",
      data: report,
    });
  } catch (error) {
    next(error);
  }
}