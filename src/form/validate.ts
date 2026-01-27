import type { BaseValidation, Condition, FieldSchema, FormErrors, FormSchema, FormValues, SchemaNode } from "./schema";

function evaluateCondition(
  condition: Condition | undefined,
  values: FormValues
): boolean {
  if (!condition) return true;

  const targetValue = values[condition.field];

  if ("exists" in condition) {
    return condition.exists ? targetValue !== undefined : targetValue === undefined;
  }

  if ("equals" in condition) {
    return targetValue === condition.equals;
  }

  if ("notEquals" in condition) {
    return targetValue !== condition.notEquals;
  }

  return true;
}


function validateValue(
  value: unknown,
  rules: BaseValidation
): string | undefined {
  if (rules.required) {
    if (value === null || value === undefined || value === "") {
      return "This field is required";
    }
  }

  if (typeof value === "string") {
    if (rules.minLength !== undefined && value.length < rules.minLength) {
      return `Must be at least ${rules.minLength} characters`;
    }
    if (rules.maxLength !== undefined && value.length > rules.maxLength) {
      return `Must be at most ${rules.maxLength} characters`;
    }
    if (rules.pattern && !rules.pattern.test(value)) {
      return "Invalid format";
    }
  }

  if (typeof value === "number") {
    if (rules.min !== undefined && value < rules.min) {
      return `Must be ≥ ${rules.min}`;
    }
    if (rules.max !== undefined && value > rules.max) {
      return `Must be ≤ ${rules.max}`;
    }
  }

  return undefined;
}

function validateNode(
  node: SchemaNode,
  values: FormValues,
  errors: FormErrors
): void {
  if ("fields" in node && node.type === "group") {
    node.fields.forEach((child) => validateNode(child, values, errors));
    return;
  }

  if ("fields" in node && node.type === "repeater") {
    const list = values[node.name];
    if (Array.isArray(list)) {
      list.forEach(() => {
        node.fields.forEach((child) => validateNode(child, values, errors));
      });
    }
    return;
  }

  const field = node as FieldSchema;

  const isVisible = evaluateCondition(field.visibleWhen, values);
  const isEnabled = evaluateCondition(field.enabledWhen, values);

  // 🚨 NO hidden required fields
  if (!isVisible || !isEnabled) {
    return;
  }

  const isRequired =
    field.validation?.required ||
    evaluateCondition(field.requiredWhen, values);

  const value = values[field.name];

  const error = validateValue(value, {
    ...field.validation,
    required: isRequired,
  });

  if (error) {
    errors[field.name] = error;
  }
}

export function validateForm(
  schema: FormSchema,
  values: FormValues
): FormErrors {
  const errors: FormErrors = {};

  schema.fields.forEach((node) =>
    validateNode(node, values, errors)
  );

  return errors;
}
