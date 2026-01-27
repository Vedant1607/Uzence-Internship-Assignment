import { FieldWrapper } from "./FieldWrapper";

interface TextFieldProps {
  name: string;
  label: string;
  value: string | null;
  disabled?: boolean;
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
  disabled,
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
        disabled={disabled}
        aria-disabled={!disabled ? undefined : true}
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
