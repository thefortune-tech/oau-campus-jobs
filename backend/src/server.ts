
import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";

import { prisma } from "./database/prisma.js";
import { errorHandler } from "./middleware/error-handler.js";

import authRouter from "./modules/auth/auth-router.js";
import userRouter from "./modules/users/user-router.js";
import jobRouter from "./jobs/job-router.js";
import applicationRouter from "./modules/applications/application-router.js";
import adminRouter from "./modules/admin/admin-router.js";

const app = express();
const port = Number(process.env.PORT) || 4000;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "OAU Campus Jobs API is running",
  });
});

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-8",
    legacyHeaders: false,
  }),
);

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/jobs", jobRouter);
app.use("/api/applications", applicationRouter);
app.use("/api/admin", adminRouter);

app.use(errorHandler);

async function startServer(): Promise<void> {
  try {
    await prisma.$connect();

    console.log("Database connected successfully");

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

startServer();
