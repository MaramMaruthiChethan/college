import type {
  ApiFailure,
  ApiSuccess,
  College,
  CollegeDetail,
  CollegesMeta,
  PaginatedColleges
} from "./types";
import { getUserIdFromCookieString, type AuthUser } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

interface RequestOptions extends RequestInit {
  nextOptions?: {
    revalidate?: number;
  };
}

async function resolveHeaders(initHeaders?: HeadersInit) {
  const headers = new Headers(initHeaders);
  headers.set("Content-Type", "application/json");

  if (typeof window === "undefined") {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const userId = cookieStore.get("college_user_id")?.value;

    if (userId) {
      headers.set("x-user-id", userId);
    }

    return headers;
  }

  const userId = getUserIdFromCookieString(document.cookie);
  if (userId) {
    headers.set("x-user-id", userId);
  }

  return headers;
}

async function request<T>(path: string, init?: RequestOptions): Promise<T> {
  const headers = await resolveHeaders(init?.headers);
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
    cache: init?.cache ?? "no-store",
    next: init?.nextOptions,
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
  return request<CollegesMeta>(`/colleges/meta`, {
    cache: "force-cache",
    nextOptions: { revalidate: 300 }
  });
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

export async function loginUser(payload: { name: string; email: string }) {
  return request<AuthUser>(`/auth/login`, {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function fetchCurrentUser() {
  return request<AuthUser>(`/auth/me`);
}
