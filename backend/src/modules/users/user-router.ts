import { Router } from "express";
import {
  getProfile,
  updateStudent,
  updateEmployer,
} from "./user-controller.js";
import {
  authenticate,
  requireStudent,
  requireEmployer,
} from "../../middleware/authenticate.js";

const router = Router();

router.get("/me", authenticate, getProfile);

router.patch(
  "/me/student",
  authenticate,
  requireStudent,
  updateStudent,
);

router.patch(
  "/me/employer",
  authenticate,
  requireEmployer,
  updateEmployer,
);

export default router;