export const AUTH_COOKIE = "college_user_id";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export function getUserIdFromCookieString(cookieString: string) {
  const match = cookieString.match(/(?:^|;\s*)college_user_id=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}
