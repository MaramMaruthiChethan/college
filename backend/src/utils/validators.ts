import { z } from "zod";
import { DEFAULT_LIMIT, DEFAULT_PAGE, MAX_LIMIT } from "./constants.js";
import { HttpError } from "./httpError.js";
import type { CollegeFilters } from "../models/college.js";

const listQuerySchema = z.object({
  search: z.string().trim().optional().default(""),
  city: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((value) => {
      if (!value) {
        return [];
      }

      const values = Array.isArray(value) ? value : [value];
      return values
        .flatMap((entry) => entry.split(","))
        .map((entry) => entry.trim())
        .filter(Boolean);
    }),
  course: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((value) => {
      if (!value) {
        return [];
      }

      const values = Array.isArray(value) ? value : [value];
      return values
        .flatMap((entry) => entry.split(","))
        .map((entry) => entry.trim())
        .filter(Boolean);
    }),
  max_fees: z.coerce.number().positive().optional().nullable(),
  min_rating: z.coerce.number().min(0).max(5).optional().nullable(),
  limit: z.coerce.number().int().min(1).max(MAX_LIMIT).optional().default(DEFAULT_LIMIT),
  page: z.coerce.number().int().min(1).optional().default(DEFAULT_PAGE)
});

const saveBodySchema = z.object({
  college_id: z.coerce.number().int().positive()
});

const loginBodySchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(200)
});

const compareSchema = z.object({
  ids: z.string().trim().min(1)
});

export function parseCollegeFilters(query: unknown): CollegeFilters {
  const parsed = listQuerySchema.safeParse(query);

  if (!parsed.success) {
    throw new HttpError(400, "Invalid query parameters");
  }

  return {
    search: parsed.data.search,
    cities: parsed.data.city,
    courses: parsed.data.course,
    maxFees: parsed.data.max_fees ?? null,
    minRating: parsed.data.min_rating ?? null,
    limit: parsed.data.limit,
    page: parsed.data.page
  };
}

export function parseSaveBody(body: unknown) {
  const parsed = saveBodySchema.safeParse(body);

  if (!parsed.success) {
    throw new HttpError(400, "Invalid request body");
  }

  return parsed.data;
}

export function parseLoginBody(body: unknown) {
  const parsed = loginBodySchema.safeParse(body);

  if (!parsed.success) {
    throw new HttpError(400, "Invalid login details");
  }

  return parsed.data;
}

export function parseCompareIds(query: unknown) {
  const parsed = compareSchema.safeParse(query);

  if (!parsed.success) {
    throw new HttpError(400, "Compare ids are required");
  }

  const ids = parsed.data.ids
    .split(",")
    .map((entry) => Number(entry.trim()))
    .filter((entry) => Number.isInteger(entry) && entry > 0);

  const uniqueIds = [...new Set(ids)];

  if (uniqueIds.length < 2 || uniqueIds.length > 3) {
    throw new HttpError(400, "Provide 2 to 3 valid college ids for comparison");
  }

  return uniqueIds;
}
