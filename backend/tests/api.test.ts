import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { app } from "../src/app.js";
import { pool } from "../src/utils/db.js";

let server: ReturnType<typeof app.listen>;
let baseUrl = "";

async function resetDatabase() {
  const workspaceRoot = path.resolve(process.cwd(), "..");
  const schema = await fs.readFile(path.join(workspaceRoot, "db/schema.sql"), "utf8");
  const seed = await fs.readFile(path.join(workspaceRoot, "db/seed.sql"), "utf8");

  // Keep tests deterministic by applying schema and demo records before assertions run.
  await pool.query(schema);
  await pool.query(seed);
}

before(async () => {
  await resetDatabase();

  await new Promise<void>((resolve) => {
    server = app.listen(0, () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        throw new Error("Unable to determine test server port");
      }

      baseUrl = `http://127.0.0.1:${address.port}`;
      resolve();
    });
  });
});

after(async () => {
  await new Promise<void>((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
  await pool.end();
});

test("GET /colleges returns paginated data with course enrichment", async () => {
  const response = await fetch(`${baseUrl}/colleges?city=Bengaluru&course=Data%20Science&limit=5&page=1`);
  const json = await response.json();

  assert.equal(response.status, 200);
  assert.equal(json.success, true);
  assert.ok(json.data.items.length > 0);
  assert.equal(typeof json.data.items[0].rating, "number");
  assert.ok(Array.isArray(json.data.items[0].courses));
  assert.deepEqual(json.data.filters.cities, ["Bengaluru"]);
  assert.deepEqual(json.data.filters.courses, ["Data Science"]);
});

test("GET /colleges/meta returns API-driven filter options", async () => {
  const response = await fetch(`${baseUrl}/colleges/meta`);
  const json = await response.json();

  assert.equal(response.status, 200);
  assert.equal(json.success, true);
  assert.ok(json.data.filters.cities.includes("Bengaluru"));
  assert.ok(json.data.filters.courses.includes("Computer Science Engineering"));
  assert.equal(json.data.stats.totalColleges, 26);
});

test("GET /colleges/:id returns detail decision content", async () => {
  const response = await fetch(`${baseUrl}/colleges/1`);
  const json = await response.json();

  assert.equal(response.status, 200);
  assert.equal(json.success, true);
  assert.ok(json.data.decision_tag.startsWith("Best for:"));
  assert.ok(json.data.strengths.length > 0);
  assert.ok(json.data.courses_offered.length > 0);
});

test("GET /compare rejects invalid id counts", async () => {
  const response = await fetch(`${baseUrl}/compare?ids=1`);
  const json = await response.json();

  assert.equal(response.status, 400);
  assert.equal(json.success, false);
});

test("POST /save and GET /saved persist shortlist entries", async () => {
  const saveResponse = await fetch(`${baseUrl}/save`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ college_id: 3 })
  });
  const savedResponse = await fetch(`${baseUrl}/saved`);
  const savedJson = await savedResponse.json();

  assert.equal(saveResponse.status, 201);
  assert.equal(savedResponse.status, 200);
  assert.equal(savedJson.success, true);
  assert.ok(savedJson.data.some((item: { id: number }) => item.id === 3));
});
