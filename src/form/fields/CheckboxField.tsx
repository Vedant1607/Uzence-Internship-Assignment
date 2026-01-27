import { FieldWrapper } from "./FieldWrapper";

interface CheckboxFieldProps {
  name: string;
  label: string;
  checked: boolean;
  error?: string;
  description?: string;
  onChange: (checked: boolean) => void;
  onBlur: () => void;
}

export function CheckboxField({
  name,
  label,
  checked,
  error,
  description,
  onChange,
  onBlur,
}: CheckboxFieldProps) {
  const id = `field-${name}`;

  return (
    <FieldWrapper id={id} label={label} error={error} description={description}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        onBlur={onBlur}
        aria-invalid={Boolean(error)}
        className="mr-2"
      />
    </FieldWrapper>
  );
}
