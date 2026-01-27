import { FieldWrapper } from "./FieldWrapper";
import type { PrimitiveValue } from "../schema";

interface NumberFieldProps {
  name: string;
  label: string;
  value: PrimitiveValue;
  error?: string;
  description?: string;
  onChange: (value: number | null) => void;
  onBlur: () => void;
}

export function NumberField({
  name,
  label,
  value,
  error,
  description,
  onChange,
  onBlur,
}: NumberFieldProps) {
  const id = `field-${name}`;

  return (
    <FieldWrapper id={id} label={label} error={error} description={description}>
      <input
        id={id}
        type="number"
        value={typeof value === "number" ? value : ""}
        onChange={(e) =>
          onChange(e.target.value === "" ? null : Number(e.target.value))
        }
        onBlur={onBlur}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error ? `${id}-error` : description ? `${id}-desc` : undefined
        }
        className="w-full border rounded px-3 py-2"
      />
    </FieldWrapper>
  );
}
