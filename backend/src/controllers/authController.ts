import type { Request, Response } from "express";
import { getUserById, loginUser } from "../services/authService.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { requireUserId } from "../utils/auth.js";
import { parseLoginBody } from "../utils/validators.js";

export async function createLogin(req: Request, res: Response) {
  const body = parseLoginBody(req.body);
  const user = await loginUser(body.name, body.email);
  return sendSuccess(res, user, 201);
}

export async function getCurrentUser(req: Request, res: Response) {
  const userId = requireUserId(req);
  const user = await getUserById(userId);
  return sendSuccess(res, user);
}
