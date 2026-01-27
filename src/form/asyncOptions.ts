import { useEffect, useRef, useState } from "react";
import type { SelectOption } from "./schema";

const optionsCache = new Map<string, SelectOption[]>();

export function useAsyncOptions(
  key: string | undefined,
  loader: (() => Promise<SelectOption[]>) | undefined
) {
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!key || !loader) return;

    // Serve from cache
    if (optionsCache.has(key)) {
      setOptions(optionsCache.get(key)!);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    loader()
      .then((result) => {
        if (controller.signal.aborted) return;

        optionsCache.set(key, result);
        setOptions(result);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : "Failed to load options");
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [key, loader]);

  return { options, loading, error };
}
