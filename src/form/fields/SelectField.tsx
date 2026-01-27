import { FieldWrapper } from "./FieldWrapper";
import type { SelectOption } from "../schema";

interface SelectFieldProps {
  name: string;
  label: string;
  value: string | null;
  options: SelectOption[];
  error?: string;
  description?: string;
  onChange: (value: string) => void;
  onBlur: () => void;
}

export function SelectField({
  name,
  label,
  value,
  options,
  error,
  description,
  onChange,
  onBlur,
}: SelectFieldProps) {
  const id = `field-${name}`;

  return (
    <FieldWrapper id={id} label={label} error={error} description={description}>
      <select
        id={id}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error ? `${id}-error` : description ? `${id}-desc` : undefined
        }
        className="w-full border rounded px-3 py-2"
      >
        <option value="">Select an option</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FieldWrapper>
  );
}
