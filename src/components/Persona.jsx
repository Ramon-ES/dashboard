import { useState } from "react";
import DynamicInput from "./DynamicInput";
import { useAuth } from "../context/AuthContext";
import { Dialog } from "@headlessui/react";
import { Pencil, Plus } from "lucide-react";

const Persona = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [customFields, setCustomFields] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const defaultField = {
    name: "",
    label: "",
    type: "text",
    rows: 3,
    options: [{ value: "", label: "" }]
  };
  const [form, setForm] = useState(defaultField);

  const openModal = (index = null) => {
    if (index !== null) {
      setEditIndex(index);
      setForm(customFields[index]);
    } else {
      setEditIndex(null);
      setForm(defaultField);
    }
    setModalOpen(true);
  };

  const saveField = () => {
    const newFields = [...customFields];
    if (editIndex !== null) {
      newFields[editIndex] = form;
    } else {
      newFields.push(form);
    }
    setCustomFields(newFields);
    setModalOpen(false);
  };

  const deleteField = () => {
    const newFields = customFields.filter((_, i) => i !== editIndex);
    setCustomFields(newFields);
    setModalOpen(false);
  };

  const updateOption = (index, key, value) => {
    const updatedOptions = [...form.options];
    updatedOptions[index][key] = value;
    setForm({ ...form, options: updatedOptions });
  };

  const addOption = () => {
    setForm({ ...form, options: [...form.options, { value: "", label: "" }] });
  };

  const removeOption = (index) => {
    const newOptions = form.options.filter((_, i) => i !== index);
    setForm({ ...form, options: newOptions });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-l font-bold text-gray-800 py-2">Background</h2>
      <div className="flex space-x-5">
        <DynamicInput name="age" label="Age" type="number" />
        <DynamicInput name="occupation" label="Occupation" />
        <DynamicInput name="gender" label="Gender" type="select" options={[
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },
          { value: "other", label: "Other" },
        ]} />
      </div>
      <DynamicInput name="characterBackground" label="Character background" type="textarea" rows={5} />
      
      <h2 className="text-l font-bold text-gray-800 py-2">Behaviour</h2>
      <DynamicInput name="characterBehaviour" label="Character behaviour" type="textarea" rows={5} />

      {customFields.map((field, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <DynamicInput {...field} />
          {isAdmin && (
            <button type="button" onClick={() => openModal(idx)}>
              <Pencil size={16} />
            </button>
          )}
        </div>
      ))}

      {isAdmin && (
        <button
          type="button"
          onClick={() => openModal()}
          className="flex items-center gap-1 text-blue-600 hover:underline mt-4"
        >
          <Plus size={16} /> Add field
        </button>
      )}

      {/* Modal for adding/editing fields */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md space-y-4">
            <Dialog.Title className="text-lg font-bold">
              {editIndex !== null ? "Edit Field" : "Add Field"}
            </Dialog.Title>

            <input
              type="text"
              placeholder="Label"
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
              className="w-full border rounded px-2 py-1"
            />
            <input
              type="text"
              placeholder="Name (unique key)"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border rounded px-2 py-1"
            />
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full border rounded px-2 py-1"
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="textarea">Textarea</option>
              <option value="select">Select</option>
            </select>

            {form.type === "textarea" && (
              <input
                type="number"
                min="1"
                value={form.rows}
                onChange={(e) => setForm({ ...form, rows: parseInt(e.target.value) })}
                className="w-full border rounded px-2 py-1"
                placeholder="Rows"
              />
            )}

            {form.type === "select" && (
              <div className="space-y-2">
                <label className="block font-medium">Options</label>
                {form.options.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Value"
                      value={option.value}
                      onChange={(e) => updateOption(index, "value", e.target.value)}
                      className="w-1/2 border rounded px-2 py-1"
                    />
                    <input
                      type="text"
                      placeholder="Label"
                      value={option.label}
                      onChange={(e) => updateOption(index, "label", e.target.value)}
                      className="w-1/2 border rounded px-2 py-1"
                    />
                    <button onClick={() => removeOption(index)} className="text-red-500">✕</button>
                  </div>
                ))}
                <button onClick={addOption} className="text-blue-600 mt-1">+ Add option</button>
              </div>
            )}

            <div className="flex justify-between pt-4">
              {editIndex !== null && (
                <button onClick={deleteField} className="text-red-500">
                  Delete
                </button>
              )}
              <button onClick={saveField} className="ml-auto bg-blue-600 text-white px-4 py-1 rounded">
                Save
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default Persona;
