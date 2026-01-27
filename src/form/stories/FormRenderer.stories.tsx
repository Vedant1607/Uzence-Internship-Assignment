import type { Meta, StoryObj } from "@storybook/react";
import { FormRenderer } from "../FormRenderer";
import type { FormSchema } from "../schema";

const meta: Meta<typeof FormRenderer> = {
  title: "Form/FormRenderer",
  component: FormRenderer,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof FormRenderer>;

const baseSchema: FormSchema = {
  version: 1,
  fields: [
    {
      type: "text",
      name: "username",
      label: "Username",
      validation: { required: true, minLength: 3 },
    },
    {
      type: "number",
      name: "age",
      label: "Age",
      validation: { min: 18 },
    },
    {
      type: "checkbox",
      name: "newsletter",
      label: "Subscribe to newsletter",
    },
  ],
};

export const BasicForm: Story = {
  args: {
    schema: baseSchema,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  },
};

export const ValidationErrors: Story = {
  args: {
    schema: baseSchema,
    onSubmit: () => {},
  },
};

export const ConditionalFields: Story = {
  args: {
    schema: {
      version: 1,
      fields: [
        {
          type: "checkbox",
          name: "hasCompany",
          label: "I own a company",
        },
        {
          type: "text",
          name: "companyName",
          label: "Company Name",
          visibleWhen: { field: "hasCompany", equals: true },
          validation: { required: true },
        },
      ],
    },
    onSubmit: () => {},
  },
};

export const AsyncSelectLoading: Story = {
  args: {
    schema: {
      version: 1,
      fields: [
        {
          type: "select",
          name: "country",
          label: "Country",
          asyncOptions: {
            key: "countries",
            loader: async () => {
              await new Promise((r) => setTimeout(r, 1500));
              return [
                { label: "India", value: "in" },
                { label: "USA", value: "us" },
              ];
            },
          },
        },
      ],
    },
    onSubmit: () => {},
  },
};

export const AsyncSelectFailure: Story = {
  args: {
    schema: {
      version: 1,
      fields: [
        {
          type: "select",
          name: "city",
          label: "City",
          asyncOptions: {
            key: "cities",
            loader: async () => {
              await new Promise((r) => setTimeout(r, 1000));
              throw new Error("Network error");
            },
          },
        },
      ],
    },
    onSubmit: () => {},
  },
};

export const AutosaveResume: Story = {
  args: {
    schema: {
      version: 99, // unique to avoid clashes
      fields: [
        {
          type: "text",
          name: "draft",
          label: "Draft Message",
        },
      ],
    },
    onSubmit: () => {},
  },
};
