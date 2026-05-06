import { Router } from "express";
import { createSavedCollege, listSavedColleges } from "../controllers/savedController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const savedRouter = Router();

savedRouter.post("/save", asyncHandler(createSavedCollege));
savedRouter.get("/saved", asyncHandler(listSavedColleges));
