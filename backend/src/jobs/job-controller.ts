
import type { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "../middleware/authenticate.js";
import { reportJob as reportJobService } from "./job-report-service.js";
import { createJobReportSchema } from "./job-report-validation.js";
import {
  createJob as createJobService,
  listJobs as listJobsService,
  getJobById as getJobByIdService,
  listEmployerJobs as listEmployerJobsService,
  updateJob as updateJobService,
  closeJob as closeJobService,
  deleteJob as deleteJobService,
  saveJob as saveJobService,
  listSavedJobs as listSavedJobsService,
  unsaveJob as unsaveJobService,
} from "./job-service.js";
import {
  createJobSchema,
  updateJobSchema,
  jobIdSchema,
  listJobsSchema,
} from "./job-validation.js";

export async function createJob(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const input = createJobSchema.parse(req.body);
    const job = await createJobService(req.user!.id, input);
    res.status(201).json({ message: "Job created successfully", job });
  } catch (error) {
    next(error);
  }
}

export async function listJobs(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const query = listJobsSchema.parse(req.query);
    res.status(200).json(await listJobsService(query));
  } catch (error) {
    next(error);
  }
}

export async function getJobById(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = jobIdSchema.parse(req.params.id);
    const job = await getJobByIdService(id);
    res.status(200).json({ job });
  } catch (error) {
    next(error);
  }
}

export async function listMyJobs(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const jobs = await listEmployerJobsService(req.user!.id);
    res.status(200).json({ jobs });
  } catch (error) {
    next(error);
  }
}

export async function updateJob(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = jobIdSchema.parse(req.params.id);
    const input = updateJobSchema.parse(req.body);
    const job = await updateJobService(id, req.user!.id, input);
    res.status(200).json({ message: "Job updated successfully", job });
  } catch (error) {
    next(error);
  }
}

export async function closeJob(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = jobIdSchema.parse(String(req.params.id));
    const job = await closeJobService(id, req.user!.id);
    res.status(200).json({ message: "Job closed successfully", job });
  } catch (error) {
    next(error);
  }
}

export async function deleteJob(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = jobIdSchema.parse(String(req.params.id));
    const result = await deleteJobService(id, req.user!.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function saveJob(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const jobId = jobIdSchema.parse(String(req.params.id));
    const savedJob = await saveJobService(req.user!.id, jobId);

    res.status(201).json({
      message: "Job saved successfully",
      savedJob,
    });
  } catch (error) {
    next(error);
  }
}

export async function listSavedJobs(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const savedJobs = await listSavedJobsService(req.user!.id);

    res.status(200).json({ savedJobs });
  } catch (error) {
    next(error);
  }
}

export async function unsaveJob(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const jobId = jobIdSchema.parse(String(req.params.id));
    const result = await unsaveJobService(req.user!.id, jobId);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}


export async function reportJob(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const jobId = jobIdSchema.parse(String(req.params.id));
    const input = createJobReportSchema.parse(req.body);

    const report = await reportJobService(
      req.user!.id,
      jobId,
      input,
    );

    res.status(201).json({
      message: "Job reported successfully",
      data: report,
    });
  } catch (error) {
    next(error);
  }
}
