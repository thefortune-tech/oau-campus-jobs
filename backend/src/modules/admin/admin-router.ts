import { Router } from "express";
import {
  authenticate,
  requireAdmin,
} from "../../middleware/authenticate.js";
import {
  listUsers,
  changeUserRole,
  listPendingEmployers,
  changeEmployerVerification,
  listAllJobs,
  changeJobModeration,
  listReportedJobs,
  changeReportReview,
} from "./admin-controller.js";

const router = Router();

router.use(authenticate, requireAdmin);

router.get("/users", listUsers);
router.patch("/users/:id/role", changeUserRole);

router.get("/employers/pending", listPendingEmployers);
router.patch("/employers/:id/verification", changeEmployerVerification);

router.get("/jobs", listAllJobs);
router.patch("/jobs/:id/moderation", changeJobModeration);

router.get("/reports", listReportedJobs);
router.patch("/reports/:id/review", changeReportReview);

export default router;