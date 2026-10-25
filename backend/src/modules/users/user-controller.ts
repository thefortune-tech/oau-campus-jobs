import type { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "../../middleware/authenticate.js";
import {
  getMyProfile,
  updateEmployerProfile,
  updateStudentProfile,
} from "./user-service.js";
import {
  updateEmployerProfileSchema,
  updateStudentProfileSchema,
} from "./user-validation.js";


export async function getProfile(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const user = req.user!;

    if (user.role === "ADMIN") {
      res.status(403).json({
        message: "Administrators do not have student or employer profiles",
      });
      return;
    }

    const profile = await getMyProfile(user.id, user.role);

    res.status(200).json({ data: profile });
  } catch (error) {
    next(error);
  }
}

export async function updateEmployer(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const input = updateEmployerProfileSchema.parse(req.body);
    const profile = await updateEmployerProfile(req.user!.id, input);

    res.status(200).json({
      message: "Employer profile updated successfully",
      data: profile,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateStudent(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const input = updateStudentProfileSchema.parse(req.body);
    const profile = await updateStudentProfile(req.user!.id, input);

    res.status(200).json({
      message: "Student profile updated successfully",
      data: profile,
    });
  } catch (error) {
    next(error);
  }
}