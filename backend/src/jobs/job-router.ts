
import { Router } from "express";
import {
  authenticate,
  requireEmployer,
  requireStudent,
} from "../middleware/authenticate.js";
import {
  createJob,
  listJobs,
  getJobById,
  listMyJobs,
  updateJob,
  closeJob,
  deleteJob,
  saveJob,
  listSavedJobs,
  unsaveJob,
  reportJob,
} from "./job-controller.js";

const jobRouter = Router();

// Public job discovery
jobRouter.get("/", listJobs);

// Student-only saved-job operations
jobRouter.get("/saved", authenticate, requireStudent, listSavedJobs);
jobRouter.post("/:id/save", authenticate, requireStudent, saveJob);
jobRouter.delete("/:id/save", authenticate, requireStudent, unsaveJob);

// Student-only job reporting
jobRouter.post("/:id/report", authenticate, requireStudent, reportJob);

// Employer-only operations
jobRouter.get("/mine", authenticate, requireEmployer, listMyJobs);
jobRouter.post("/", authenticate, requireEmployer, createJob);
jobRouter.patch("/:id/close", authenticate, requireEmployer, closeJob);
jobRouter.patch("/:id", authenticate, requireEmployer, updateJob);
jobRouter.delete("/:id", authenticate, requireEmployer, deleteJob);

// Job details — keep after named routes
jobRouter.get("/:id", getJobById);

export default jobRouter;
