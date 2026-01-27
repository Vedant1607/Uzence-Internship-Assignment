import type { ReactNode } from "react";

interface FieldWrapperProps {
  id: string;
  label: string;
  description?: string;
  error?: string;
  children: ReactNode;
}

export function FieldWrapper({
  id,
  label,
  description,
  error,
  children,
}: FieldWrapperProps) {
  const descriptionId = description ? `${id}-desc` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block font-medium mb-1">
        {label}
      </label>

      {children}

      {description && (
        <p id={descriptionId} className="text-sm text-gray-600 mt-1">
          {description}
        </p>
      )}

      {error && (
        <p
          id={errorId}
          className="text-sm text-red-600 mt-1"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
