import type { Request } from "express";
import { HttpError } from "./httpError.js";

export function getUserIdFromRequest(req: Request) {
  const header = req.header("x-user-id");
  return header?.trim() || null;
}

export function requireUserId(req: Request) {
  const userId = getUserIdFromRequest(req);

  if (!userId) {
    throw new HttpError(401, "Login required");
  }

  return userId;
}
