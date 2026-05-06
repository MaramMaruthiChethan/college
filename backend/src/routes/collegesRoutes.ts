import { Router } from "express";
import {
  getCollege,
  getComparedColleges,
  getMeta,
  listColleges
} from "../controllers/collegesController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const collegesRouter = Router();

collegesRouter.get("/", asyncHandler(listColleges));
collegesRouter.get("/meta", asyncHandler(getMeta));
collegesRouter.get("/compare", asyncHandler(getComparedColleges));
collegesRouter.get("/:id", asyncHandler(getCollege));
