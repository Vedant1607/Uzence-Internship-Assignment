import { Fragment, type JSX } from "react";
import type { FormSchema, SchemaNode, FieldSchema } from "./schema";
import { useFormEngine } from "./useFormEngine";

import { TextField } from "./fields/TextField";
import { NumberField } from "./fields/NumberField";
import { CheckboxField } from "./fields/CheckboxField";
import { SelectField } from "./fields/SelectField";
import { resolveFieldState } from "./logic";
import { useAsyncOptions } from "./asyncOptions";

interface FormRendererProps {
  schema: FormSchema;
  onSubmit: (values: unknown) => void;
}

function renderField(
  field: FieldSchema,
  engine: ReturnType<typeof useFormEngine>,
): JSX.Element | null {
  const { values, errors, setValue, setTouched } = engine;

  const rawValue = values[field.name];
  const state = resolveFieldState(field, values);
  if (!state.visible) return null;

  const common = {
    name: field.name,
    label: field.label,
    error: errors[field.name],
    description: field.description,
    onBlur: () => setTouched(field.name),
  };

  switch (field.type) {
    case "text": {
      const value = typeof rawValue === "string" ? rawValue : null;

      return (
        <TextField
          {...common}
          value={value}
          onChange={(v) => setValue(field.name, v)}
          disabled={!state.enabled}
        />
      );
    }

    case "number": {
      const value = typeof rawValue === "number" ? rawValue : null;

      return (
        <NumberField
          {...common}
          value={value}
          onChange={(v) => setValue(field.name, v)}
        />
      );
    }

    case "checkbox": {
      const checked = rawValue === true;

      return (
        <CheckboxField
          {...common}
          checked={checked}
          onChange={(v) => setValue(field.name, v)}
        />
      );
    }

    case "select": {
      const value = typeof rawValue === "string" ? rawValue : null;

      const { options, loading, error } = field.asyncOptions
        ? useAsyncOptions(field.asyncOptions.key, field.asyncOptions.loader)
        : { options: field.options ?? [], loading: false, error: null };

      return (
        <SelectField
          {...common}
          value={value}
          options={options}
          loading={loading}
          error={error ?? common.error}
          onChange={(v) => setValue(field.name, v)}
        />
      );
    }

    default:
      return null;
  }
}

function renderNode(
  node: SchemaNode,
  engine: ReturnType<typeof useFormEngine>,
): JSX.Element | null {
  if (node.type === "group") {
    return (
      <fieldset className="border p-4 mb-4">
        {node.label && (
          <legend className="font-semibold mb-2">{node.label}</legend>
        )}
        {node.fields.map((child) => (
          <Fragment key={child.name}>{renderNode(child, engine)}</Fragment>
        ))}
      </fieldset>
    );
  }

  if (node.type === "repeater") {
    const items = engine.values[node.name];

    return (
      <div className="mb-4">
        {node.label && <h3 className="font-semibold mb-2">{node.label}</h3>}

        {Array.isArray(items) &&
          items.map((_, index) => (
            <div key={index} className="border p-3 mb-2">
              {node.fields.map((child) => (
                <Fragment key={child.name}>
                  {renderNode(child, engine)}
                </Fragment>
              ))}
            </div>
          ))}
      </div>
    );
  }

  return renderField(node as FieldSchema, engine);
}

export function FormRenderer({ schema, onSubmit }: FormRendererProps) {
  const engine = useFormEngine(schema);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (engine.validate()) {
      onSubmit(engine.values);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {schema.fields.map((node) => (
        <Fragment key={node.name}>{renderNode(node, engine)}</Fragment>
      ))}

      <button
        type="submit"
        className="mt-4 px-4 py-2 rounded bg-black text-white"
      >
        Submit
      </button>
    </form>
  );
}
