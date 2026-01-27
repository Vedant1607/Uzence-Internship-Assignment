export type PrimitiveValue = string | number | boolean | null;

export type FormValues = Record<string, PrimitiveValue | PrimitiveValue[]>;

export type FormErrors = Record<string, string | undefined>;

export type FieldType = "text" | "number" | "select" | "checkbox";

export interface BaseValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
}

export interface Condition {
  field: string;
  equals?: PrimitiveValue;
  notEquals?: PrimitiveValue;
  exists?: boolean;
}

export interface BaseFieldSchema {
  name: string;
  label: string;
  type: FieldType;
  description?: string;
  defaultValue?: PrimitiveValue;
  validation?: BaseValidation;
  visibleWhen?: Condition;
  enabledWhen?: Condition;
  requiredWhen?: Condition;
}

export interface TextFieldSchema extends BaseFieldSchema {
  type: "text";
  placeholder?: string;
}

export interface NumberFieldSchema extends BaseFieldSchema {
  type: "number";
  step?: number;
}

export interface CheckboxFieldSchema extends BaseFieldSchema {
  type: "checkbox";
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectFieldSchema extends BaseFieldSchema {
  type: "select";
  options?: SelectOption[];
  asyncOptions?: {
    key: string;
    loader: () => Promise<SelectOption[]>;
  };
}

export type FieldSchema =
  | TextFieldSchema
  | NumberFieldSchema
  | CheckboxFieldSchema
  | SelectFieldSchema;

export type SchemaNode = FieldSchema | FieldGroupSchema | RepeaterSchema;

export interface FieldGroupSchema {
  type: "group";
  name: string;
  label?: string;
  fields: SchemaNode[];
}

export interface RepeaterSchema {
  type: "repeater";
  name: string;
  label?: string;
  minItems?: number;
  maxItems?: number;
  fields: SchemaNode[];
}

export interface FormSchema {
  version: number;
  fields: SchemaNode[];
}
