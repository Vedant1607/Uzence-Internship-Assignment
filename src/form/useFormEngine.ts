import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  FormErrors,
  FormSchema,
  FormValues,
  PrimitiveValue,
} from "./schema";
import { validateForm } from "./validate";
import { loadAutosave, saveAutosave, clearAutosave } from "./autosave";

export interface FormEngine {
  values: FormValues;
  errors: FormErrors;
  asyncErrors: Record<string, string | null>;
  touched: Record<string, boolean>;
  isDirty: boolean;

  setValue: (name: string, value: PrimitiveValue | PrimitiveValue[]) => void;
  setTouched: (name: string) => void;
  validate: () => boolean;
  reset: () => void;
}

function resolveInitialValues(schema: FormSchema): FormValues {
  const values: FormValues = {};

  const walk = (nodes: FormSchema["fields"]) => {
    nodes.forEach((node) => {
      if (node.type === "group") {
        walk(node.fields);
        return;
      }

      if (node.type === "repeater") {
        values[node.name] = [];
        return;
      }

      values[node.name] =
        node.defaultValue !== undefined ? node.defaultValue : null;
    });
  };

  walk(schema.fields);
  return values;
}

export function useFormEngine(schema: FormSchema): FormEngine {
  const [values, setValues] = useState<FormValues>(() => {
    const saved = loadAutosave(schema);
    return saved ?? resolveInitialValues(schema);
  });

  const [touched, setTouchedState] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [asyncErrors, setAsyncErrors] = useState<Record<string, string | null>>(
    {},
  );

  const isDirty = useMemo(() => {
    return Object.values(touched).some(Boolean);
  }, [touched]);

  useEffect(() => {
    if (!isDirty) return;
    saveAutosave(schema, values);
  }, [values, isDirty, schema]);

  const setValue = useCallback(
    (name: string, value: PrimitiveValue | PrimitiveValue[]) => {
      setValues(
        (prev): FormValues => ({
          ...prev,
          [name]: value,
        }),
      );
    },
    [],
  );

  const setTouched = useCallback((name: string) => {
    setTouchedState((prev) => ({
      ...prev,
      [name]: true,
    }));
  }, []);

  const validate = useCallback(() => {
    const validationErrors = validateForm(schema, values);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, [schema, values]);

  const reset = useCallback(() => {
    setValues(resolveInitialValues(schema));
    setTouchedState({});
    setErrors({});
    setAsyncErrors({});
    clearAutosave(schema);
  }, [schema]);

  return {
    values,
    errors,
    asyncErrors,
    touched,
    isDirty,
    setValue,
    setTouched,
    validate,
    reset,
  };
}
