import type { SortingState } from "@tanstack/react-table";

type SortPreferences = Record<string, SortingState>;

export function getSortPreference(
  raw: unknown,
  key: string,
  fallback: SortingState
): SortingState {
  if (!raw || typeof raw !== "object") return fallback;
  const prefs = raw as SortPreferences;
  const value = prefs[key];
  return Array.isArray(value) ? value : fallback;
}

export function updateSortPreferenceObject(
  raw: unknown,
  key: string,
  sorting: SortingState
) {
  const current = raw && typeof raw === "object" ? (raw as SortPreferences) : {};
  return { ...current, [key]: sorting };
}
