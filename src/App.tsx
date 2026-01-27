import { FormRenderer } from "./form/FormRenderer";
import type { FormSchema } from "./form/schema";

const schema: FormSchema = {
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
    {
      type: "select",
      name: "country",
      label: "Country",
      options: [
        { label: "India", value: "in" },
        { label: "USA", value: "us" },
      ],
    },
  ],
};

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-xl font-semibold mb-4">
          Schema Driven Form Demo
        </h1>

        <FormRenderer
          schema={schema}
          onSubmit={(values) => {
            console.log("Submitted values:", values);
            alert(JSON.stringify(values, null, 2));
          }}
        />
      </div>
    </div>
  );
}
export default App;