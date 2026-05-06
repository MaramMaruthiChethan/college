import test from "node:test";
import assert from "node:assert/strict";
import { getUserIdFromCookieString } from "../lib/auth.js";
import {
  formatCurrency,
  formatPercentage,
  formatRating,
  getDecisionScore
} from "../lib/format.js";

test("format helpers return fallback text for missing values", () => {
  assert.equal(formatCurrency(null), "Data not available");
  assert.equal(formatPercentage(null), "Data not available");
});

test("formatRating produces fixed-point text", () => {
  assert.equal(formatRating(4.37), "4.4 / 5");
});

test("decision score rewards stronger outcomes", () => {
  const stronger = getDecisionScore({
    fees_range: 140000,
    rating: 4.8,
    placement_percentage: 95,
    avg_package: 1600000
  });
  const weaker = getDecisionScore({
    fees_range: 420000,
    rating: 4.0,
    placement_percentage: 70,
    avg_package: 600000
  });

  assert.ok(stronger > weaker);
});

test("cookie parsing extracts the authenticated user id", () => {
  assert.equal(
    getUserIdFromCookieString("foo=bar; college_user_id=user_123; theme=light"),
    "user_123"
  );
});
