import cors from "cors";
import dotenv from "dotenv";
import express, { type NextFunction, type Request, type Response } from "express";
import { authRouter } from "./routes/authRoutes.js";
import { getComparedColleges } from "./controllers/collegesController.js";
import { collegesRouter } from "./routes/collegesRoutes.js";
import { savedRouter } from "./routes/savedRoutes.js";
import { sendError, sendSuccess } from "./utils/apiResponse.js";
import { asyncHandler } from "./utils/asyncHandler.js";
import { HttpError } from "./utils/httpError.js";

dotenv.config();

export const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:3000"
  })
);
app.use(express.json());

app.get("/health", (_req, res) => {
  return sendSuccess(res, { status: "ok" });
});

app.get("/compare", asyncHandler(getComparedColleges));
app.use("/", authRouter);
app.use("/colleges", collegesRouter);
app.use("/", savedRouter);

app.use((_req, res) => {
  return sendError(res, "Route not found", 404);
});

app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof HttpError) {
    return sendError(res, error.message, error.statusCode);
  }

  if (error instanceof SyntaxError) {
    return sendError(res, "Invalid JSON body", 400);
  }

  console.error(error);
  return sendError(res, "Internal server error", 500);
});
