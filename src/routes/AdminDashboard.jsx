import { useEffect, useState } from "react";
const baseUrl = import.meta.env.VITE_API_BASE_URL;
const DEFAULT_KEY = "default";
const DEFAULT_CHARACTER_DATA = {
        "persona": {
            "background": [
                {
                    "age": {
                        "type": "number",
                        "label": "Age",
                        "placeholder": "",
                        "required": true,
                        "value": "",
                        "inline": true
                    },
                    "occupation": {
                        "type": "text",
                        "label": "Occupation",
                        "placeholder": "",
                        "required": true,
                        "value": "",
                        "inline": true
                    },
                    "gender": {
                        "type": "select",
                        "label": "Gender",
                        "list": [
                            "Male",
                            "Female",
                            "Other"
                        ],
                        "placeholder": "select gender",
                        "required": true,
                        "value": "",
                        "inline": true
                    }
                },
                {
                    "characterBackground": {
                        "type": "textarea",
                        "label": "Character background",
                        "placeholder": "Describe the general background of this character",
                        "required": true,
                        "value": ""
                    }
                }
            ],
            "behaviour": [
                {
                    "characterBehaviour": {
                        "type": "textarea",
                        "label": "Character behaviour",
                        "placeholder": "Describe the general behaviour of this character",
                        "required": true,
                        "value": ""
                    }
                }
            ]
        },
        "languageAndSpeech": {
            "speekingStyle": [
                {
                    "description": {
                        "type": "textarea",
                        "label": "Speaking style",
                        "placeholder": "Describe the general speaking style from this character",
                        "required": true,
                        "value": ""
                    },
                    "exampleMonologue": {
                        "type": "textarea",
                        "label": "Example monologue",
                        "placeholder": "provide an example monologue from this character",
                        "required": true,
                        "value": ""
                    }
                }
            ],
            "voice": [
                {
                    "characterVoice": {
                        "type": "select",
                        "label": "The voice of this character",
                        "list": [
                            "voiceID1",
                            "voiceID2"
                        ],
                        "placeholder": "select voice",
                        "required": true,
                        "value": ""
                    }
                }
            ]
        },
        "personality": {
            "presets": [
                {
                    "personalityPresets": {
                        "type": "select",
                        "label": "Personality preset",
                        "list": [
                            "personality1",
                            "personality2"
                        ],
                        "placeholder": "select personality",
                        "required": true,
                        "value": ""
                    }
                }
            ],
            "customisableTraits": []
        },
        "knowledgeBank": {
            "fileUpload": [
                {
                    "comingSoon": {}
                }
            ],
            "plainText": [
                {
                    "comingSoon": {}
                }
            ]
        }
    };

export default function AdminDashboard() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [editableJson, setEditableJson] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [newEntryName, setNewEntryName] = useState("");

  useEffect(() => {
    fetch(`${baseUrl}/client/data`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then(setClients)
      .catch(console.error);
  }, []);

  const selectedClientData = clients.find((c) => c._id === selectedClient);

  useEffect(() => {
    if (!selectedSubject) return;

    const data = { ...selectedSubject.data };

    if (!data[DEFAULT_KEY]) {
      data[DEFAULT_KEY] = DEFAULT_CHARACTER_DATA;
      setSelectedSubject((prev) => ({
        ...prev,
        data,
      }));
      setSelectedCharacter(DEFAULT_KEY);
      setEditableJson(JSON.stringify(DEFAULT_CHARACTER_DATA, null, 2));
    } else {
      const firstCharKey = Object.keys(data)[0];
      if (!selectedCharacter || !(selectedCharacter in data)) {
        setSelectedCharacter(firstCharKey);
        setEditableJson(JSON.stringify(data[firstCharKey], null, 2));
      } else {
        setEditableJson(JSON.stringify(data[selectedCharacter], null, 2));
      }
    }
  }, [selectedSubject]);

  useEffect(() => {
    if (
      selectedSubject &&
      selectedCharacter &&
      selectedSubject.data[selectedCharacter]
    ) {
      setEditableJson(
        JSON.stringify(selectedSubject.data[selectedCharacter], null, 2)
      );
    }
  }, [selectedCharacter, selectedSubject]);

  const characters =
    selectedSubject && typeof selectedSubject.data === "object"
      ? Object.entries(selectedSubject.data)
      : [];

  function handleJsonChange(e) {
    setEditableJson(e.target.value);
  }

  async function handleSave(characterKey = selectedCharacter, json = editableJson) {
    setSaving(true);
    setError(null);
    setSuccess(null);

    let parsedData;
    try {
      parsedData = JSON.parse(json);
    } catch (err) {
      setError("Invalid JSON. Please fix the errors.", err);
      setSaving(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${baseUrl}/client/admin/save/${selectedClientData.name}/${selectedSubject.key}/${characterKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ data: parsedData }),
        }
      );

      const result = await response.json();

      if (result.success) {
        setSuccess("Saved successfully!");

        setSelectedSubject((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            data: {
              ...prev.data,
              [characterKey]: {
                ...parsedData,
                updatedAt: new Date().toISOString(),
              },
            },
          };
        });

        setClients((prevClients) =>
          prevClients.map((client) => {
            if (client._id !== selectedClient) return client;
            return {
              ...client,
              subjects: {
                ...client.subjects,
                [selectedSubject.key]: {
                  ...client.subjects[selectedSubject.key],
                  [characterKey]: {
                    ...parsedData,
                    updatedAt: new Date().toISOString(),
                  },
                },
              },
            };
          })
        );
      } else {
        setError("Failed to save. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error(err);
    }

    setSaving(false);
  }

  async function handleAddCharacter() {
    if (!newEntryName.trim()) return;

    const data = { ...selectedSubject.data };

    if (data[newEntryName]) {
      setError("Character with this name already exists.");
      return;
    }

    const baseData = data[DEFAULT_KEY]
      ? JSON.parse(JSON.stringify(data[DEFAULT_KEY]))
      : { ...DEFAULT_CHARACTER_DATA };

    const newCharData = {
      ...baseData,
      updatedAt: new Date().toISOString(),
    };

    await handleSave(newEntryName, JSON.stringify(newCharData, null, 2));

    setSelectedCharacter(newEntryName);
    setEditableJson(JSON.stringify(newCharData, null, 2));
    setNewEntryName("");
    setSuccess(`Character "${newEntryName}" added.`);
    setError(null);
  }

  async function handleDeleteCharacter(charKey) {
    if (!window.confirm(`Delete character "${charKey}"? This cannot be undone.`)) return;

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${baseUrl}/client/admin/delete/${selectedClientData.name}/${selectedSubject.key}/${charKey}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();
      if (result.success) {
        const newData = { ...selectedSubject.data };
        delete newData[charKey];

        setSelectedSubject((prev) => ({
          ...prev,
          data: newData,
        }));

        if (selectedCharacter === charKey) {
          const nextKey = Object.keys(newData)[0];
          setSelectedCharacter(nextKey);
          if (nextKey) {
            setEditableJson(JSON.stringify(newData[nextKey], null, 2));
          } else {
            setEditableJson("");
          }
        }

        setSuccess(`Character "${charKey}" deleted.`);
      } else {
        setError("Failed to delete character.");
      }
    } catch (err) {
      console.error(err);
      setError("Network error during deletion.");
    }
  }

  return (
    <div className="flex h-screen">
      <aside className="w-1/4 p-4 border-r overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Clients</h2>
        {clients.map((client) => (
          <div
            key={client._id}
            className={`cursor-pointer p-2 rounded ${
              client._id === selectedClient ? "bg-blue-100" : ""
            }`}
            onClick={() => {
              setSelectedClient(client._id);
              setSelectedSubject(null);
              setSelectedCharacter(null);
              setEditableJson("");
              setSuccess(null);
              setError(null);
            }}
          >
            {client.name}
          </div>
        ))}
      </aside>

      <main className="flex-1 p-4 flex flex-col">
        {selectedClientData ? (
          <>
            <h2 className="text-lg font-semibold">
              Subjects of {selectedClientData.name}
            </h2>
            <div className="flex gap-2 mt-2 mb-4">
              {Object.entries(selectedClientData.subjects || {}).map(
                ([key, data]) => (
                  <button
                    key={key}
                    className={`px-3 py-1 rounded border ${
                      selectedSubject?.key === key
                        ? "bg-blue-500 text-white"
                        : "bg-white"
                    }`}
                    onClick={() => {
                      setSelectedSubject({ key, name: key, data });
                      setSelectedCharacter(null);
                      setEditableJson("");
                      setSuccess(null);
                      setError(null);
                    }}
                  >
                    {key}
                  </button>
                )
              )}
            </div>

            {selectedSubject ? (
              <>
                <h3 className="text-md font-bold mb-2">
                  Entries in subject: {selectedSubject.name}
                </h3>

                <div className="flex gap-2 items-center mb-4">
                  <input
                    type="text"
                    placeholder="New entry name"
                    value={newEntryName}
                    onChange={(e) => setNewEntryName(e.target.value)}
                    className="border px-2 py-1 rounded"
                  />
                  <button
                    onClick={handleAddCharacter}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Add new
                  </button>
                </div>

                <div className="flex gap-2 mb-4 flex-wrap">
                  {characters.map(([charKey]) => (
                    <div key={charKey} className="flex items-center gap-1">
                      <button
                        className={`px-3 py-1 rounded border ${
                          selectedCharacter === charKey
                            ? "bg-green-500 text-white"
                            : "bg-white"
                        }`}
                        onClick={() => {
                          setSelectedCharacter(charKey);
                          setSuccess(null);
                          setError(null);
                        }}
                      >
                        {charKey}
                      </button>
                      {charKey !== DEFAULT_KEY && (
                        <button
                        onClick={() => handleDeleteCharacter(charKey)}
                        className="text-red-500 text-sm px-1 hover:text-red-700"
                      >
                        ✕
                      </button>
                      )}
                    </div>
                  ))}
                </div>

                {selectedCharacter ? (
                  <div className="border p-4 rounded shadow bg-white flex flex-col flex-1 max-h-[500px]">
                    <h4 className="font-semibold mb-2">
                      Edit configuration for character: {selectedCharacter}
                    </h4>
                    <textarea
                      className="flex-1 p-2 border rounded font-mono text-sm bg-gray-50"
                      value={editableJson}
                      onChange={handleJsonChange}
                      spellCheck={false}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      (JSON is editable)
                    </p>

                    <button
                      onClick={() => handleSave()}
                      disabled={saving}
                      className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                      {saving ? "Saving..." : "Save"}
                    </button>

                    {error && <p className="text-red-600 mt-2">{error}</p>}
                    {success && <p className="text-green-600 mt-2">{success}</p>}
                  </div>
                ) : (
                  <p>Select a character to view/edit configuration.</p>
                )}
              </>
            ) : (
              <p>Select a subject to view its characters.</p>
            )}
          </>
        ) : (
          <p>Select a client to view their subjects.</p>
        )}
      </main>
    </div>
  );
}
