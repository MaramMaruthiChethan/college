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

export interface CollegeDetail extends College {
  decision_tag: string;
  strengths: string[];
  caution_points: string[];
  courses_offered: Array<{
    id: number;
    name: string;
    degree_type: string;
    duration_years: number;
    annual_fees: number;
  }>;
}

export interface PaginatedColleges {
  items: College[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: {
    search: string;
    cities: string[];
    courses: string[];
    maxFees: number | null;
    minRating: number | null;
  };
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

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiFailure {
  success: false;
  message: string;
}
