import { useEffect, useRef, useState } from "react";
import type { AsyncValidation, PrimitiveValue } from "./schema";

export function useAsyncValidation(
  validator: AsyncValidation | undefined,
  value: PrimitiveValue,
  enabled: boolean
) {
  const [error, setError] = useState<string | null>(null);
  const [validating, setValidating] = useState(false);

  const timerRef = useRef<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!validator || !enabled) {
      setError(null);
      return;
    }

    abortRef.current?.abort();
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(() => {
      const controller = new AbortController();
      abortRef.current = controller;

      setValidating(true);

      validator
        .validate(value)
        .then((result) => {
          if (!controller.signal.aborted) {
            setError(result);
          }
        })
        .catch(() => {
          if (!controller.signal.aborted) {
            setError("Validation failed");
          }
        })
        .finally(() => {
          if (!controller.signal.aborted) {
            setValidating(false);
          }
        });
    }, validator.debounceMs ?? 300);

    return () => {
      abortRef.current?.abort();
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, [validator, value, enabled]);

  return { error, validating };
}
