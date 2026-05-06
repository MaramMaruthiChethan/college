import type { Request, Response } from "express";
import {
  compareColleges,
  getCollegeById,
  getColleges,
  getCollegesMeta
} from "../services/collegesService.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { HttpError } from "../utils/httpError.js";
import { parseCollegeFilters, parseCompareIds } from "../utils/validators.js";

export async function listColleges(req: Request, res: Response) {
  const filters = parseCollegeFilters(req.query);
  const result = await getColleges(filters);
  return sendSuccess(res, result);
}

export async function getCollege(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    throw new HttpError(400, "Invalid college id");
  }
  const result = await getCollegeById(id);
  return sendSuccess(res, result);
}

export async function getComparedColleges(req: Request, res: Response) {
  const ids = parseCompareIds(req.query);
  const result = await compareColleges(ids);
  return sendSuccess(res, result);
}

export async function getMeta(_req: Request, res: Response) {
  const result = await getCollegesMeta();
  return sendSuccess(res, result);
}
