
import type { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "../../middleware/authenticate.js";
import {
  createApplicationSchema,
  updateApplicationStatusSchema,
  applicationIdSchema,
} from "./application-validation.js";
import {
  createApplication,
  listStudentApplications,
  listJobApplications,
  updateApplicationStatus,
} from "./application-service.js";

export async function applyForJob(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const input = createApplicationSchema.parse(req.body);
    const application = await createApplication(req.user!.id, input);

    res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMyApplications(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const applications = await listStudentApplications(req.user!.id);

    res.status(200).json({
      message: "Applications retrieved successfully",
      applications,
    });
  } catch (error) {
    next(error);
  }
}

export async function getJobApplications(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const jobId = applicationIdSchema.parse(
      String( req.params.jobId)
    );
    const applications = await listJobApplications(jobId, req.user!.id);

    res.status(200).json({
      message: "Job applications retrieved successfully",
      applications,
    });
  } catch (error) {
    next(error);
  }
}

export async function respondToApplication(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const applicationId = applicationIdSchema.parse(
      String(req.params.applicationId)
    );
    const { status } = updateApplicationStatusSchema.parse(req.body);

    const application = await updateApplicationStatus(
      applicationId,
      req.user!.id,
      status,
    );

    res.status(200).json({
      message: "Application status updated successfully",
      application,
    });
  } catch (error) {
    next(error);
  }
}
