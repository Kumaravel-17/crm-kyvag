"use client";

import { useCallback, useEffect, useRef, useState, type DependencyList } from "react";
import { errorMessage } from "./api";

/**
 * Runs an API call when the deps change and keeps its result. Only the latest call's result is kept, so a slow
 * response for an old search can't overwrite a newer one. `data` stays on screen while a reload runs.
 */
export function useApi<T>(call: () => Promise<T>, deps: DependencyList) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const latest = useRef(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps -- the caller lists what the call depends on
  const run = useCallback(call, deps);

  const reload = useCallback(() => {
    const id = ++latest.current;
    setLoading(true);
    setError(null);
    run().then(
      (result) => { if (id === latest.current) { setData(result); setLoading(false); } },
      (e) => { if (id === latest.current) { setError(errorMessage(e)); setLoading(false); } },
    );
  }, [run]);

  useEffect(reload, [reload]);

  return { data, error, loading, reload, setData };
}

/** The value after it has stopped changing for `ms`, for search boxes */
export function useDebounced<T>(value: T, ms = 250) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return debounced;
}
