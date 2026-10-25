
import { Router } from "express";
import {
  authenticate,
  requireEmployer,
  requireStudent,
} from "../../middleware/authenticate.js";
import {
  applyForJob,
  getMyApplications,
  getJobApplications,
  respondToApplication,
} from "./application-controller.js";

const applicationRouter = Router();

// Student routes
applicationRouter.post(
  "/",
  authenticate,
  requireStudent,
  applyForJob,
);

applicationRouter.get(
  "/mine",
  authenticate,
  requireStudent,
  getMyApplications,
);

// Employer routes
applicationRouter.get(
  "/job/:jobId",
  authenticate,
  requireEmployer,
  getJobApplications,
);

applicationRouter.patch(
  "/:applicationId/status",
  authenticate,
  requireEmployer,
  respondToApplication,
);

export default applicationRouter;
