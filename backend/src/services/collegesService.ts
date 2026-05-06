import type {
  College,
  CollegeDetail,
  CollegeFilters,
  CollegeCourse,
  CollegesListResult,
  CollegesMeta
} from "../models/college.js";
import { pool } from "../utils/db.js";
import { HttpError } from "../utils/httpError.js";

interface CollegeRow {
  id: number;
  name: string;
  city: string;
  state: string;
  fees_range: number;
  rating: number;
  placement_percentage: number | null;
  avg_package: number | null;
  ranking: number | null;
  courses: string[] | null;
}

function buildWhereClause(filters: CollegeFilters) {
  const conditions: string[] = [];
  const values: Array<string | number | string[]> = [];

  if (filters.search) {
    values.push(`%${filters.search}%`);
    conditions.push(`c.name ILIKE $${values.length}`);
  }

  if (filters.cities.length > 0) {
    values.push(filters.cities);
    conditions.push(`c.city = ANY($${values.length})`);
  }

  if (filters.courses.length > 0) {
    values.push(filters.courses);
    conditions.push(`
      EXISTS (
        SELECT 1
        FROM college_courses cc
        INNER JOIN courses cr ON cr.id = cc.course_id
        WHERE cc.college_id = c.id
        AND cr.name = ANY($${values.length})
      )
    `);
  }

  if (filters.maxFees !== null) {
    values.push(filters.maxFees);
    conditions.push(`c.fees_range <= $${values.length}`);
  }

  if (filters.minRating !== null) {
    values.push(filters.minRating);
    conditions.push(`c.rating >= $${values.length}`);
  }

  const clause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  return { clause, values };
}

function deriveDecisionTags(college: {
  fees_range: number;
  rating: number;
  placement_percentage: number | null;
  avg_package: number | null;
  ranking: number | null;
}) {
  const tags: string[] = [];

  if (college.placement_percentage !== null && college.placement_percentage >= 90) {
    tags.push("High placement");
  }

  if (college.avg_package !== null && college.avg_package >= 1200000) {
    tags.push("Salary upside");
  }

  if (college.fees_range <= 150000) {
    tags.push("Affordable");
  }

  if (college.rating >= 4.6 || (college.ranking !== null && college.ranking <= 20)) {
    tags.push("Top reputation");
  }

  return tags.length > 0 ? tags : ["Balanced choice"];
}

function normalizeCollege(row: CollegeRow): College {
  // The API normalizes DB primitives here so React components never have to guess at types.
  const courses = (row.courses ?? []).filter(Boolean).slice(0, 3);

  return {
    id: row.id,
    name: row.name,
    city: row.city,
    state: row.state,
    fees_range: Number(row.fees_range),
    rating: Number(row.rating),
    placement_percentage: row.placement_percentage === null ? null : Number(row.placement_percentage),
    avg_package: row.avg_package === null ? null : Number(row.avg_package),
    ranking: row.ranking === null ? null : Number(row.ranking),
    courses,
    decision_tags: deriveDecisionTags(row)
  };
}

function getDecisionTag(college: College) {
  if (college.decision_tags.includes("High placement")) {
    return "Best for: High placement";
  }

  if (college.decision_tags.includes("Affordable")) {
    return "Best for: Affordable path";
  }

  if (college.decision_tags.includes("Top reputation")) {
    return "Best for: Strong overall reputation";
  }

  if (college.decision_tags.includes("Salary upside")) {
    return "Best for: Better salary outcomes";
  }

  return "Best for: Balanced decision";
}

function buildStrengths(college: College) {
  const strengths: string[] = [];

  if (college.placement_percentage !== null && college.placement_percentage >= 90) {
    strengths.push("Strong placement record");
  }

  if (college.avg_package !== null && college.avg_package >= 1000000) {
    strengths.push("Above-average package outcomes");
  }

  if (college.ranking !== null && college.ranking <= 25) {
    strengths.push("Competitive ranking position");
  }

  if (college.fees_range <= 150000) {
    strengths.push("More affordable than many peers");
  }

  return strengths.length > 0 ? strengths : ["Balanced performance across core decision factors"];
}

function buildCautionPoints(college: College) {
  const cautions: string[] = [];

  if (college.placement_percentage === null) {
    cautions.push("Placement data is unavailable");
  }

  if (college.avg_package === null) {
    cautions.push("Average package data is unavailable");
  }

  if (college.fees_range >= 400000) {
    cautions.push("Higher fee commitment");
  }

  if (college.rating < 4.2) {
    cautions.push("Lower overall rating than top options");
  }

  return cautions.length > 0 ? cautions : ["No major cautions from the currently available data"];
}

export async function getColleges(filters: CollegeFilters): Promise<CollegesListResult> {
  const { clause, values } = buildWhereClause(filters);
  const offset = (filters.page - 1) * filters.limit;

  const countQuery = `SELECT COUNT(*)::int AS total FROM colleges c ${clause}`;
  const dataQuery = `
    SELECT
      c.id,
      c.name,
      c.city,
      c.state,
      c.fees_range,
      c.rating::float8 AS rating,
      c.placement_percentage,
      c.avg_package,
      c.ranking,
      COALESCE(
        ARRAY_AGG(DISTINCT cr.name) FILTER (WHERE cr.name IS NOT NULL),
        '{}'
      ) AS courses
    FROM colleges c
    LEFT JOIN college_courses cc ON cc.college_id = c.id
    LEFT JOIN courses cr ON cr.id = cc.course_id
    ${clause}
    GROUP BY c.id
    ORDER BY c.rating DESC, c.ranking ASC NULLS LAST, c.fees_range ASC
    LIMIT $${values.length + 1}
    OFFSET $${values.length + 2}
  `;

  const [countResult, dataResult] = (await Promise.all([
    pool.query(countQuery, values),
    pool.query(dataQuery, [...values, filters.limit, offset])
  ])) as [{ rows: Array<{ total: number }> }, { rows: CollegeRow[] }];

  const total = countResult.rows[0]?.total ?? 0;

  return {
    items: dataResult.rows.map(normalizeCollege),
    pagination: {
      page: filters.page,
      limit: filters.limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / filters.limit))
    },
    filters: {
      search: filters.search,
      cities: filters.cities,
      courses: filters.courses,
      maxFees: filters.maxFees,
      minRating: filters.minRating
    }
  };
}

export async function getCollegeById(id: number): Promise<CollegeDetail> {
  const collegeResult = (await pool.query(
    `
      SELECT
        c.id,
        c.name,
        c.city,
        c.state,
        c.fees_range,
        c.rating::float8 AS rating,
        c.placement_percentage,
        c.avg_package,
        c.ranking,
        COALESCE(
          ARRAY_AGG(DISTINCT cr.name) FILTER (WHERE cr.name IS NOT NULL),
          '{}'
        ) AS courses
      FROM colleges c
      LEFT JOIN college_courses cc ON cc.college_id = c.id
      LEFT JOIN courses cr ON cr.id = cc.course_id
      WHERE c.id = $1
      GROUP BY c.id
    `,
    [id]
  )) as { rows: CollegeRow[] };

  const collegeRow = collegeResult.rows[0];

  if (!collegeRow) {
    throw new HttpError(404, "College not found");
  }

  const college = normalizeCollege(collegeRow);
  const coursesResult = (await pool.query(
    `
      SELECT
        cr.id,
        cr.name,
        cr.degree_type,
        cr.duration_years,
        cc.annual_fees
      FROM college_courses cc
      INNER JOIN courses cr ON cr.id = cc.course_id
      WHERE cc.college_id = $1
      ORDER BY cc.annual_fees ASC, cr.name ASC
    `,
    [id]
  )) as { rows: CollegeCourse[] };

  return {
    ...college,
    decision_tag: getDecisionTag(college),
    strengths: buildStrengths(college),
    caution_points: buildCautionPoints(college),
    courses_offered: coursesResult.rows.map((course: CollegeCourse) => ({
      ...course,
      annual_fees: Number(course.annual_fees),
      duration_years: Number(course.duration_years)
    }))
  };
}

export async function compareColleges(ids: number[]) {
  const result = (await pool.query(
    `
      SELECT
        c.id,
        c.name,
        c.city,
        c.state,
        c.fees_range,
        c.rating::float8 AS rating,
        c.placement_percentage,
        c.avg_package,
        c.ranking,
        COALESCE(
          ARRAY_AGG(DISTINCT cr.name) FILTER (WHERE cr.name IS NOT NULL),
          '{}'
        ) AS courses
      FROM colleges c
      LEFT JOIN college_courses cc ON cc.college_id = c.id
      LEFT JOIN courses cr ON cr.id = cc.course_id
      WHERE c.id = ANY($1::int[])
      GROUP BY c.id
      ORDER BY array_position($1::int[], c.id)
    `,
    [ids]
  )) as { rows: CollegeRow[] };

  if (result.rows.length !== ids.length) {
    throw new HttpError(404, "One or more colleges were not found");
  }

  return result.rows.map(normalizeCollege);
}

export async function getCollegesMeta(): Promise<CollegesMeta> {
  const [citiesResult, coursesResult, statsResult] = (await Promise.all([
    pool.query("SELECT DISTINCT city FROM colleges ORDER BY city ASC"),
    pool.query("SELECT name FROM courses ORDER BY name ASC"),
    pool.query(`
      SELECT
        COUNT(*)::int AS total_colleges,
        ROUND(AVG(rating)::numeric, 1)::float8 AS average_rating,
        ROUND(AVG(fees_range))::int AS average_fees,
        MAX(placement_percentage)::int AS highest_placement
      FROM colleges
    `)
  ])) as [
    { rows: Array<{ city: string }> },
    { rows: Array<{ name: string }> },
    {
      rows: Array<{
        total_colleges: number;
        average_rating: number;
        average_fees: number;
        highest_placement: number | null;
      }>;
    }
  ];

  const stats = statsResult.rows[0];

  return {
    filters: {
      cities: citiesResult.rows.map((row: { city: string }) => row.city),
      courses: coursesResult.rows.map((row: { name: string }) => row.name)
    },
    stats: {
      totalColleges: stats.total_colleges,
      averageRating: Number(stats.average_rating),
      averageFees: Number(stats.average_fees),
      highestPlacement: stats.highest_placement === null ? null : Number(stats.highest_placement)
    }
  };
}
