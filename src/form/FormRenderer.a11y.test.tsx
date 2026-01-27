import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import axe from "axe-core";

import { FormRenderer } from "./FormRenderer";
import type { FormSchema } from "./schema";

const schema: FormSchema = {
  version: 1,
  fields: [
    {
      type: "text",
      name: "email",
      label: "Email",
      validation: { required: true },
    },
    {
      type: "checkbox",
      name: "agree",
      label: "Agree to terms",
    },
  ],
};

describe("FormRenderer accessibility", () => {
  it("has no axe accessibility violations", async () => {
    const { container } = render(
      <FormRenderer schema={schema} onSubmit={() => {}} />
    );

    const results = await axe.run(container);
    expect(results.violations.length).toBe(0);
  });
});
