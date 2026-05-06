"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import type { AuthUser } from "@/lib/auth";

interface AuthContextValue {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const STORAGE_KEY = "college-decision-user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return;
    }

    try {
      setUserState(JSON.parse(stored) as AuthUser);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  function setUser(userValue: AuthUser | null) {
    setUserState(userValue);

    if (userValue) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(userValue));
      document.cookie = `college_user_id=${encodeURIComponent(userValue.id)}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
      return;
    }

    window.localStorage.removeItem(STORAGE_KEY);
    document.cookie = "college_user_id=; path=/; max-age=0; samesite=lax";
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      setUser,
      logout: () => setUser(null)
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
