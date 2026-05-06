import type { Request, Response } from "express";
import { getSavedColleges, saveCollege } from "../services/savedService.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { requireUserId } from "../utils/auth.js";
import { parseSaveBody } from "../utils/validators.js";

export async function createSavedCollege(req: Request, res: Response) {
  const userId = requireUserId(req);
  const body = parseSaveBody(req.body);
  const result = await saveCollege(userId, body.college_id);
  return sendSuccess(res, result, 201);
}

export async function listSavedColleges(req: Request, res: Response) {
  const userId = requireUserId(req);
  const result = await getSavedColleges(userId);
  return sendSuccess(res, result);
}
