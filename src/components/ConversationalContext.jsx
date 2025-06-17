import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import SelectAdd from "./SelectAdd";
import useSaveForm from "../hooks/useSaveForm";
import { useAuth } from "../context/AuthContext";
import FormGenerator from "./FormGenerator";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export default function ConversationalContext() {
    const { user } = useAuth();
    const [clientData, setClientData] = useState([]);
    const [defaultOptions, setDefaultOptions] = useState([]);
    const [tabs, setTabs] = useState([]);
    const [tabKeys, setTabKeys] = useState([]);

    const [conversation, setConversation] = useState("");
    const [activeTab, setActiveTab] = useState("");

    useEffect(() => {
        fetch(`${baseUrl}/client/data/${user?.company}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                data = data.subjects.conversationalContext;
                setClientData(data);
                // options filled with api data
                const options = Object.keys(data)
                    .filter((key) => key !== "default")
                    .map((key) => ({
                        label: key,
                        value: key,
                    }));
                setDefaultOptions(options);
            })
            .catch(console.error);
    }, []);

    const saveFormData = useSaveForm("conversationalContext", conversation);

    const methods = useForm();

    const selectionChanged = (event) => {
        console.log("conversation changed:", event);
        setConversation(event?.value);

        // if clientData[event.value] does not exist, it means a new conversation was created.
        if (!clientData[event.value]) {
            clientData[event.value] = { ...clientData.default };
        }

        // set tabs
        const TabKeysParsed = Object.keys(clientData[event.value]).filter(key => !key.includes("updated") && !key.includes("deletable")).map(
            (key) => {
                    console.log(key);
                const label = key
                    .replace(/([a-z])([A-Z])/g, "$1 $2")
                    .replace(/And/g, "&")
                    .toLowerCase();
                return label.charAt(0).toUpperCase() + label.slice(1);
            }
        );
        setTabs(TabKeysParsed);
        // console.log(clientData[event.value]);
        const tabKeysOriginal = Object.keys(clientData[event.value]).map(
            (key) => {
                // console.log(key);
                return key;
            }
        );
        setTabKeys(tabKeysOriginal);
        setActiveTab(TabKeysParsed[0]);
    };

    const onSubmit = async (formData) => {
        if (!conversation) {
            alert("Please select a conversation before saving.");
            return;
        }

        // Deep clone the original structure
        const updatedConversationData = JSON.parse(
            JSON.stringify(clientData[conversation])
        );

        // Walk through all tab sections and fields
        for (const tabKey in updatedConversationData) {
            // Skip metadata
            if (tabKey.includes("updated") || tabKey.includes("deletable")) continue;

            const section = updatedConversationData[tabKey];
            for (const sectionKey in section) {
                const groups = section[sectionKey];
                if (!Array.isArray(groups)) continue;

                groups.forEach((group) => {
                    for (const fieldName in group) {
                        if (
                            Object.prototype.hasOwnProperty.call(
                                formData,
                                fieldName
                            )
                        ) {
                            group[fieldName].value = formData[fieldName];
                        }
                    }
                });
            }
        }

        try {
            const result = await saveFormData(updatedConversationData);
            console.log("Saved structured data:", result);
            alert("conversation saved!");
        } catch (err) {
            console.error("Save failed:", err);
            alert("Failed to save: " + err.message);
        }
    };

    // Add this inside your component:
    const handleDelete = async () => {
        if (!conversation) return;

        const confirmed = window.confirm(
            `Are you sure you want to delete conversation "${conversation}"?`
        );
        if (!confirmed) return;

        try {
            const res = await fetch(
                `${baseUrl}/client/delete/conversationalContext/${conversation}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!res.ok) {
                throw new Error(`Delete failed: ${res.statusText}`);
            }

            alert(`Conversation "${conversation}" deleted successfully!`);

            // Remove deleted character from clientData and defaultOptions
            const newClientData = { ...clientData };
            delete newClientData[conversation];
            setClientData(newClientData);

            const newOptions = Object.keys(newClientData)
                .filter((key) => key !== "defaultConversation")
                .map((key) => ({ label: key, value: key }));
            setDefaultOptions(newOptions);

            setConversation("");
            setTabs([]);
            setTabKeys([]);
            setActiveTab("");
        } catch (error) {
            console.error(error);
            alert("Failed to delete conversation: " + error.message);
        }
    };

    const renderTabContent = () => {
        if (!activeTab || !conversation) return null;
        const tabIndex = tabs.findIndex((tab) => tab === activeTab);
        // console.log(`Index of ${activeTab} in tabs array: ${tabIndex}`);
        console.log("rendering tab content");
        console.log(conversation);
        return (
            <FormGenerator tabData={clientData[conversation][tabKeys[tabIndex]]} />
        );
    };

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={methods.handleSubmit(onSubmit)}
                className="bg-white p-6 rounded-lg shadow border border-gray-200 h-full flex flex-col"
            >
                {/* Top Bar */}
                <div className="flex justify-between items-center mb-4 flex-shrink-0">
                    <h2 className="text-xl font-semibold">Conversational Context</h2>
                    <div className="flex space-x-5 items-center w-1/2">
                        <div className="w-full">
                            <SelectAdd
                                {...{
                                    passedOptions: defaultOptions,
                                    selectionChanged,
                                }}
                                className=""
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                        >
                            Save
                        </button>
                        {clientData[conversation]?.deletable === true && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                {conversation && (
                    <>
                        <div className="flex border-b mb-4 flex-shrink-0">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    type="button"
                                    onClick={() => {
                                        setActiveTab(tab);
                                    }}
                                    className={`px-4 py-2 font-medium ${
                                        activeTab === tab
                                            ? "border-b-2 border-blue-600 text-blue-600"
                                            : "text-gray-500 hover:text-gray-700"
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Tab Panels */}
                        <div className="flex-grow overflow-auto">

                            {renderTabContent()}
                        </div>
                    </>
                )}
            </form>
        </FormProvider>
    );
}
