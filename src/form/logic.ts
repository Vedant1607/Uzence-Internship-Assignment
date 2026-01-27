import type {
  Condition,
  FieldSchema,
  FormValues,
  SchemaNode,
} from "./schema";

export function evaluateCondition(
  condition: Condition | undefined,
  values: FormValues
): boolean {
  if (!condition) return true;

  const value = values[condition.field];

  if (condition.exists !== undefined) {
    return condition.exists ? value !== undefined : value === undefined;
  }

  if (condition.equals !== undefined) {
    return value === condition.equals;
  }

  if (condition.notEquals !== undefined) {
    return value !== condition.notEquals;
  }

  return true;
}

export interface ResolvedFieldState {
  visible: boolean;
  enabled: boolean;
  required: boolean;
}

export function resolveFieldState(
  field: FieldSchema,
  values: FormValues
): ResolvedFieldState {
  const visible = evaluateCondition(field.visibleWhen, values);
  const enabled = evaluateCondition(field.enabledWhen, values);

  const required =
    visible &&
    enabled &&
    (field.validation?.required === true ||
      evaluateCondition(field.requiredWhen, values));

  return {
    visible,
    enabled,
    required,
  };
}

export function isNodeVisible(
  node: SchemaNode,
  values: FormValues
): boolean {
  if ("type" in node && "fields" in node) {
    return true;
  }

  return resolveFieldState(node as FieldSchema, values).visible;
}
