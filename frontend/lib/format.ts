export function formatCurrency(value: number | null, compact = false) {
  if (value === null) {
    return "Data not available";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: 1
  }).format(value);
}

export function formatPercentage(value: number | null) {
  if (value === null) {
    return "Data not available";
  }

  return `${value}%`;
}

export function formatRating(value: number) {
  return `${value.toFixed(1)} / 5`;
}

export function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("en-IN", {
    notation: "compact",
    maximumFractionDigits: 1
  }).format(value);
}

export function getDecisionScore(college: {
  fees_range: number;
  rating: number;
  placement_percentage: number | null;
  avg_package: number | null;
}) {
  const ratingScore = college.rating * 20;
  const placementScore = college.placement_percentage ?? 65;
  const packageScore = college.avg_package ? Math.min(100, college.avg_package / 15000) : 50;
  const affordabilityScore = Math.max(30, 100 - college.fees_range / 6000);

  return Math.round((ratingScore + placementScore + packageScore + affordabilityScore) / 4);
}

export function getBestValueLabel(college: {
  fees_range: number;
  rating: number;
  placement_percentage: number | null;
  avg_package: number | null;
}) {
  if (college.placement_percentage !== null && college.placement_percentage >= 90) {
    return "High placement";
  }

  if (college.fees_range <= 150000) {
    return "Affordable";
  }

  if (college.avg_package !== null && college.avg_package >= 1000000) {
    return "Salary upside";
  }

  if (college.rating >= 4.4) {
    return "Top rated";
  }

  return "Balanced choice";
}
