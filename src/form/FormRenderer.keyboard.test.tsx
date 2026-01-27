import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormRenderer } from "./FormRenderer";
import type { FormSchema } from "./schema";
import test from "node:test";
import { expect } from "storybook/test";

const schema: FormSchema = {
  version: 1,
  fields: [
    { type: "text", name: "name", label: "Name" },
    { type: "checkbox", name: "subscribe", label: "Subscribe" },
  ],
};

test("form is fully operable with keyboard only", async () => {
  const user = userEvent.setup();
  render(<FormRenderer schema={schema} onSubmit={() => {}} />);

  await user.tab();
  expect(screen.getByLabelText("Name")).toHaveFocus();

  await user.keyboard("John");
  await user.tab();

  expect(screen.getByLabelText("Subscribe")).toHaveFocus();
});
