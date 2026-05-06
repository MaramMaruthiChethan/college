import { Router } from "express";
import { createLogin, getCurrentUser } from "../controllers/authController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const authRouter = Router();

authRouter.post("/auth/login", asyncHandler(createLogin));
authRouter.get("/auth/me", asyncHandler(getCurrentUser));
