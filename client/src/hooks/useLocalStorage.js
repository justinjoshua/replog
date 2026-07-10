import { useCallback, useEffect, useState } from "react";

/**
 * State that persists to localStorage. Used for favorites and recently-used
 * exercises so they survive reloads (and the in-memory DB resets) without
 * needing auth or a backend table.
 */
export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw != null ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* quota / private mode — ignore */
    }
  }, [key, value]);

  return [value, setValue];
}

/** A string[] set with a toggle helper — perfect for favorites by name. */
export function useFavorites(key = "replog.favorites") {
  const [favorites, setFavorites] = useLocalStorage(key, []);

  const toggle = useCallback(
    (name) =>
      setFavorites((f) =>
        f.includes(name) ? f.filter((n) => n !== name) : [...f, name]
      ),
    [setFavorites]
  );

  const isFavorite = useCallback((name) => favorites.includes(name), [favorites]);

  return { favorites, toggle, isFavorite };
}

/**
 * User-defined workout splits (e.g. "Chest + Triceps"), persisted locally.
 * Each split is { key, label, icon, muscles: string[], custom: true } and is
 * used by the day builder exactly like a built-in day.
 */
export function useSplits(key = "replog.splits") {
  const [splits, setSplits] = useLocalStorage(key, []);

  const addSplit = useCallback(
    (split) => setSplits((s) => [...s.filter((x) => x.key !== split.key), split]),
    [setSplits]
  );

  const removeSplit = useCallback(
    (k) => setSplits((s) => s.filter((x) => x.key !== k)),
    [setSplits]
  );

  return { splits, addSplit, removeSplit };
}

/** A most-recently-used list, capped and de-duped (newest first). */
export function useRecent(key = "replog.recent", max = 12) {
  const [recent, setRecent] = useLocalStorage(key, []);

  const push = useCallback(
    (name) =>
      setRecent((r) => [name, ...r.filter((n) => n !== name)].slice(0, max)),
    [setRecent, max]
  );

  return { recent, push };
}
