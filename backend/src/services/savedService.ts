import type { SavedCollege } from "../models/college.js";
import { DUMMY_USER_ID } from "../utils/constants.js";
import { pool } from "../utils/db.js";
import { HttpError } from "../utils/httpError.js";

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

export async function saveCollege(collegeId: number) {
  const existsResult = (await pool.query(
    "SELECT id FROM colleges WHERE id = $1",
    [collegeId]
  )) as { rows: Array<{ id: number }> };

  if (!existsResult.rows[0]) {
    throw new HttpError(404, "College not found");
  }

  const insertResult = (await pool.query(
    `
      INSERT INTO saved_colleges (user_id, college_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, college_id) DO UPDATE SET user_id = EXCLUDED.user_id
      RETURNING id, user_id, college_id
    `,
    [DUMMY_USER_ID, collegeId]
  )) as { rows: Array<{ id: number; user_id: string; college_id: number }> };

  return insertResult.rows[0];
}

export async function getSavedColleges() {
  const result = (await pool.query(
    `
      SELECT
        sc.id AS saved_id,
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
          ARRAY(
            SELECT cr.name
            FROM college_courses cc
            INNER JOIN courses cr ON cr.id = cc.course_id
            WHERE cc.college_id = c.id
            ORDER BY cr.name ASC
            LIMIT 3
          ),
          '{}'
        ) AS courses
      FROM saved_colleges sc
      INNER JOIN colleges c ON c.id = sc.college_id
      WHERE sc.user_id = $1
      ORDER BY sc.id DESC
    `,
    [DUMMY_USER_ID]
  )) as { rows: SavedCollege[] };

  return result.rows.map((row: SavedCollege) => ({
    ...row,
    fees_range: Number(row.fees_range),
    rating: Number(row.rating),
    placement_percentage: row.placement_percentage === null ? null : Number(row.placement_percentage),
    avg_package: row.avg_package === null ? null : Number(row.avg_package),
    ranking: row.ranking === null ? null : Number(row.ranking),
    courses: row.courses ?? [],
    decision_tags: deriveDecisionTags(row)
  }));
}
