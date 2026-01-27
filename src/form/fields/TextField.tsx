import { FieldWrapper } from "./FieldWrapper";

interface TextFieldProps {
  name: string;
  label: string;
  value: string | null;
  error?: string;
  description?: string;
  onChange: (value: string) => void;
  onBlur: () => void;
}

export function TextField({
  name,
  label,
  value,
  error,
  description,
  onChange,
  onBlur,
}: TextFieldProps) {
  const id = `field-${name}`;

  return (
    <FieldWrapper id={id} label={label} error={error} description={description}>
      <input
        id={id}
        type="text"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
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
