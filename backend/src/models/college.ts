export interface College {
  id: number;
  name: string;
  city: string;
  state: string;
  fees_range: number;
  rating: number;
  placement_percentage: number | null;
  avg_package: number | null;
  ranking: number | null;
  courses: string[];
  decision_tags: string[];
}

export interface SavedCollegeRecord {
  id: number;
  user_id: string;
  college_id: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface SavedCollege extends College {
  saved_id: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CollegesListResult {
  items: College[];
  pagination: PaginationMeta;
  filters: {
    search: string;
    cities: string[];
    courses: string[];
    maxFees: number | null;
    minRating: number | null;
  };
}

export interface CollegeFilters {
  search: string;
  cities: string[];
  courses: string[];
  maxFees: number | null;
  minRating: number | null;
  limit: number;
  page: number;
}

export interface Course {
  id: number;
  name: string;
  degree_type: string;
  duration_years: number;
}

export interface CollegeCourse extends Course {
  annual_fees: number;
}

export interface CollegeDetail extends College {
  decision_tag: string;
  strengths: string[];
  caution_points: string[];
  courses_offered: CollegeCourse[];
}

export interface CollegesMeta {
  filters: {
    cities: string[];
    courses: string[];
  };
  stats: {
    totalColleges: number;
    averageRating: number;
    averageFees: number;
    highestPlacement: number | null;
  };
}
