import type { Request, Response } from "express";
import { getSavedColleges, saveCollege } from "../services/savedService.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { parseSaveBody } from "../utils/validators.js";

export async function createSavedCollege(req: Request, res: Response) {
  const body = parseSaveBody(req.body);
  const result = await saveCollege(body.college_id);
  return sendSuccess(res, result, 201);
}

export async function listSavedColleges(_req: Request, res: Response) {
  const result = await getSavedColleges();
  return sendSuccess(res, result);
}
