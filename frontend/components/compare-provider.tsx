"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";

interface CompareContextValue {
  compareIds: number[];
  toggleCompare: (id: number) => void;
  isSelected: (id: number) => boolean;
  clearCompare: () => void;
}

const CompareContext = createContext<CompareContextValue | null>(null);
const STORAGE_KEY = "college-decision-compare";

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareIds, setCompareIds] = useState<number[]>([]);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return;
    }

    try {
      const parsed = JSON.parse(stored) as number[];
      setCompareIds(parsed.slice(0, 3));
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(compareIds));
  }, [compareIds]);

  const value = useMemo<CompareContextValue>(
    () => ({
      compareIds,
      toggleCompare: (id: number) => {
        setCompareIds((current) => {
          if (current.includes(id)) {
            return current.filter((item) => item !== id);
          }

          if (current.length >= 3) {
            return [...current.slice(1), id];
          }

          return [...current, id];
        });
      },
      isSelected: (id: number) => compareIds.includes(id),
      clearCompare: () => setCompareIds([])
    }),
    [compareIds]
  );

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare() {
  const context = useContext(CompareContext);

  if (!context) {
    throw new Error("useCompare must be used inside CompareProvider");
  }

  return context;
}
