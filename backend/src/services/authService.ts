import { createHash } from "node:crypto";
import type { User } from "../models/college.js";
import { pool } from "../utils/db.js";
import { HttpError } from "../utils/httpError.js";

function toUserId(email: string) {
  return createHash("sha256").update(email.trim().toLowerCase()).digest("hex").slice(0, 24);
}

export async function loginUser(name: string, email: string): Promise<User> {
  const normalizedEmail = email.trim().toLowerCase();
  const userId = toUserId(normalizedEmail);

  const result = (await pool.query(
    `
      INSERT INTO users (id, name, email)
      VALUES ($1, $2, $3)
      ON CONFLICT (email)
      DO UPDATE SET name = EXCLUDED.name
      RETURNING id, name, email
    `,
    [userId, name.trim(), normalizedEmail]
  )) as { rows: User[] };

  return result.rows[0];
}

export async function getUserById(userId: string): Promise<User> {
  const result = (await pool.query(
    `
      SELECT id, name, email
      FROM users
      WHERE id = $1
    `,
    [userId]
  )) as { rows: User[] };

  const user = result.rows[0];

  if (!user) {
    throw new HttpError(404, "User not found");
  }

  return user;
}
