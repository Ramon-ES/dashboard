import { useState, useEffect } from "react";

const FieldModal = ({ initialData, onSave, onDelete, onClose }) => {
  const [name, setName] = useState("");
  const [label, setLabel] = useState("");
  const [type, setType] = useState("text");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setLabel(initialData.label);
      setType(initialData.type);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, label, type });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 w-96 shadow-lg space-y-4">
        <h2 className="text-lg font-semibold">Configure Field</h2>
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            className="w-full border rounded px-2 py-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Label</label>
          <input
            className="w-full border rounded px-2 py-1"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Type</label>
          <select
            className="w-full border rounded px-2 py-1"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="select">Select</option>
            <option value="textarea">Textarea</option>
          </select>
        </div>

        <div className="flex justify-between mt-4">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Save
          </button>
          {initialData && (
            <button
              type="button"
              onClick={onDelete}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          )}
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default FieldModal;
