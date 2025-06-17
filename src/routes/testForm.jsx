import Form from "@rjsf/core";

const schema = {
  title: "Character Background",
  type: "object",
  properties: {
    age: { type: "string", title: "Age" },
    occupation: { type: "string", title: "Occupation" },
    gender: {
      type: "string",
      title: "Gender",
      enum: ["Male", "Female", "Other"]
    },
    characterBackground: {
      type: "string",
      title: "Character background"
    }
  },
  required: ["age", "occupation", "gender", "characterBackground"]
};

const uiSchema = {
  gender: {
    "ui:widget": "select",
    "ui:placeholder": "select gender"
  },
  characterBackground: {
    "ui:widget": "textarea"
  }
};

<Form schema={schema} uiSchema={uiSchema} onSubmit={console.log} />;
