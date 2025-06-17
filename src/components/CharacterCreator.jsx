import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import SelectAdd from "./SelectAdd";
import Persona from "./Persona";
import LanguageSpeech from "./LanguageSpeech";
import Personality from "./Personality";
import KnowledgeBank from "./KnowledgeBank";
import useSaveForm from "../hooks/useSaveForm";
import { useAuth } from "../context/AuthContext";
import FormGenerator from "./FormGenerator";

// const tabs = ["Persona", "Language & speech", "Personality", "Knowledge bank"];
const baseUrl = import.meta.env.VITE_API_BASE_URL;

export default function CharacterCreator() {
	const { user } = useAuth();
	const [clientData, setClientData] = useState([]);
	const [defaultOptions, setDefaultOptions] = useState([]);
	const [tabs, setTabs] = useState([]);
	const [tabKeys, setTabKeys] = useState([]);

	const [character, setCharacter] = useState("");
	const [activeTab, setActiveTab] = useState("");

	// const oldOptions = [
	// 	{ label: "One", value: "one" },
	// 	{ label: "Two", value: "two" },
	// 	{ label: "Three", value: "three", default: true },
	// ];

	useEffect(() => {
		fetch(`${baseUrl}/client/data/${user?.company}`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		})
			.then((res) => res.json())
			.then((data) => {
				data = data.subjects.characterCreator;
				setClientData(data);
				// options filled with api data
				const options = Object.keys(data)
					.filter((key) => key !== "defaultCharacter")
					.map((key) => ({
						label: key,
						value: key,
					}));
				setDefaultOptions(options);
			})
			.catch(console.error);
	}, []);

	const saveFormData = useSaveForm("characterCreator", character);

	const methods = useForm();

	const selectionChanged = (event) => {
		console.log("Character changed:", event);
		setCharacter(event?.value);

		// if clientData[event.value] does not exist, it means a new character was created.
		if (!clientData[event.value]) {
			clientData[event.value] = { ...clientData.default };
		}

		// set tabs
		const TabKeysParsed = Object.keys(clientData[event.value])
			.filter(
				(key) => !key.includes("updated") && !key.includes("deletable")
			)
			.map((key) => {
				console.log(key);
				const label = key
					.replace(/([a-z])([A-Z])/g, "$1 $2")
					.replace(/And/g, "&")
					.toLowerCase();
				return label.charAt(0).toUpperCase() + label.slice(1);
			});
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
		if (!character) {
			alert("Please select a character before saving.");
			return;
		}

		// Deep clone the original structure
		const updatedCharacterData = JSON.parse(
			JSON.stringify(clientData[character])
		);

		// Walk through all tab sections and fields
		for (const tabKey in updatedCharacterData) {
			// Skip metadata
			if (tabKey.includes("updated")) continue;

			const section = updatedCharacterData[tabKey];
			for (const sectionKey in section) {
				const groups = section[sectionKey]; // this is the array you're trying to `.forEach`
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
			const result = await saveFormData(updatedCharacterData);
			console.log("Saved structured data:", result);
			alert("Character saved!");
		} catch (err) {
			console.error("Save failed:", err);
			alert("Failed to save: " + err.message);
		}
	};

	// Add this inside your component:
	const handleDelete = async () => {
		if (!character) return;

		const confirmed = window.confirm(
			`Are you sure you want to delete character "${character}"?`
		);
		if (!confirmed) return;

		try {
			const res = await fetch(
				`${baseUrl}/client/delete/characterCreator/${character}`,
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

			alert(`Character "${character}" deleted successfully!`);

			// Remove deleted character from clientData and defaultOptions
			const newClientData = { ...clientData };
			delete newClientData[character];
			setClientData(newClientData);

			const newOptions = Object.keys(newClientData)
				.filter((key) => key !== "default")
				.map((key) => ({ label: key, value: key }));
			setDefaultOptions(newOptions);

			setCharacter("");
			setTabs([]);
			setTabKeys([]);
			setActiveTab("");
		} catch (error) {
			console.error(error);
			alert("Failed to delete character: " + error.message);
		}
	};

	const renderTabContent = () => {
		if (!activeTab || !character) return null;
		const tabIndex = tabs.findIndex((tab) => tab === activeTab);
		// console.log(`Index of ${activeTab} in tabs array: ${tabIndex}`);
		console.log("rendering tab content");
		console.log(character);
		return (
			<FormGenerator tabData={clientData[character][tabKeys[tabIndex]]} />
		);

		// switch (activeTab) {
		// 	case "Persona":
		// 		return <Persona />;
		// 	case "Language & speech":
		// 		return <LanguageSpeech />;
		// 	case "Personality":
		// 		return <Personality />;
		// 	case "Knowledge bank":
		// 		return <KnowledgeBank />;
		// 	default:
		// 		return <div>Unknown tab: {activeTab}</div>;
		// }
	};

	return (
		<FormProvider {...methods}>
			<form
				onSubmit={methods.handleSubmit(onSubmit)}
				className="bg-white p-6 rounded-lg shadow border border-gray-200 h-full flex flex-col"
			>
				{/* Top Bar */}
				<div className="flex justify-between items-center mb-4 flex-shrink-0">
					<h2 className="text-xl font-semibold">Character Creator</h2>
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
						{clientData[character]?.deletable === true && (
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
				{character && (
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
							{/* {activeTab === "Persona" && <Persona />}
							{activeTab === "Language & speech" && (
								<LanguageSpeech />
							)}
							{activeTab === "Personality" && <Personality />}
							{activeTab === "Knowledge bank" && (
								<KnowledgeBank />
							)} */}

							{renderTabContent()}
						</div>
					</>
				)}
			</form>
		</FormProvider>
	);
}
