import type {
  ApiFailure,
  ApiSuccess,
  College,
  CollegeDetail,
  CollegesMeta,
  PaginatedColleges
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    },
    cache: "no-store",
    signal: AbortSignal.timeout(5000)
  });

  const json = (await response.json()) as ApiSuccess<T> | ApiFailure;

  if (!response.ok || !json.success) {
    throw new Error("message" in json ? json.message : "Request failed");
  }

  return json.data;
}

export async function fetchColleges(params: URLSearchParams) {
  return request<PaginatedColleges>(`/colleges?${params.toString()}`);
}

export async function fetchCollege(id: string) {
  return request<CollegeDetail>(`/colleges/${id}`);
}

export async function fetchCollegesMeta() {
  return request<CollegesMeta>(`/colleges/meta`);
}

export async function fetchComparedColleges(ids: string) {
  return request<College[]>(`/compare?ids=${ids}`);
}

export async function fetchSavedColleges() {
  return request<College[]>(`/saved`);
}

export async function saveCollege(collegeId: number) {
  return request<{ id: number; user_id: string; college_id: number }>(`/save`, {
    method: "POST",
    body: JSON.stringify({ college_id: collegeId })
  });
}
