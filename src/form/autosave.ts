import type { FormSchema, FormValues } from "./schema";

interface AutosavePayload {
  version: number;
  savedAt: number;
  values: FormValues;
}

export function getAutosaveKey(schema: FormSchema): string {
  return `form-autosave-v${schema.version}`;
}

export function loadAutosave(schema: FormSchema): FormValues | null {
  const key = getAutosaveKey(schema);
  const raw = localStorage.getItem(key);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as AutosavePayload;

    if (parsed.version !== schema.version) return null;

    return parsed.values;
  } catch {
    return null;
  }
}

export function saveAutosave(
  schema: FormSchema,
  values: FormValues
): void {
  const key = getAutosaveKey(schema);

  const payload: AutosavePayload = {
    version: schema.version,
    savedAt: Date.now(),
    values,
  };

  localStorage.setItem(key, JSON.stringify(payload));
}

export function clearAutosave(schema: FormSchema): void {
  localStorage.removeItem(getAutosaveKey(schema));
}
