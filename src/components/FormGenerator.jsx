import { useEffect, useState } from "react";
import DynamicInput from "./DynamicInput";

const FormGenerator = ({ tabData }) => {
	const [formData, setFormData] = useState({});

	// Sync formData with incoming tabData
	useEffect(() => {
		const clone = JSON.parse(JSON.stringify(tabData)); // deep copy to avoid mutating props
		setFormData(clone);
	}, [tabData]);

	const handleInputChange = (sectionName, groupIndex, fieldName, value) => {
		setFormData((prev) => {
			const updated = { ...prev };
			updated[sectionName] = [...updated[sectionName]];
			const group = { ...updated[sectionName][groupIndex] };
			const field = { ...group[fieldName], value };

			group[fieldName] = field;
			updated[sectionName][groupIndex] = group;
			return updated;
		});
	};

	const renderGroup = (group, groupIndex, sectionName) => {
		const fields = Object.entries(group);
		const renderedFields = [];

		let inlineBatch = [];

		const flushInlineBatch = () => {
			if (inlineBatch.length > 0) {
				renderedFields.push(
					<div
						className="flex flex-wrap gap-5"
						key={`inline-${groupIndex}-${renderedFields.length}`}
					>
						{inlineBatch.map(([fieldName, fieldProps]) => (
							<DynamicInput
								key={fieldName}
								name={fieldName}
								label={fieldProps.label}
								type={fieldProps.type}
								placeholder={fieldProps.placeholder}
								options={
									fieldProps.type === "select"
										? fieldProps.list.map((item) => ({
												value: item.toLowerCase(),
												label: item,
										  }))
										: []
								}
								rows={fieldProps.type === "textarea" ? 4 : undefined}
								value={fieldProps.value}
								onChange={(e) =>
									handleInputChange(
										sectionName,
										groupIndex,
										fieldName,
										e.target.value
									)
								}
							/>
						))}
					</div>
				);
				inlineBatch = [];
			}
		};

		fields.forEach(([fieldName, fieldProps]) => {
			if (fieldProps.inline) {
				inlineBatch.push([fieldName, fieldProps]);
			} else {
				flushInlineBatch();
				renderedFields.push(
					<DynamicInput
						key={fieldName}
						name={fieldName}
						label={fieldProps.label}
						type={fieldProps.type}
						placeholder={fieldProps.placeholder}
						options={
							fieldProps.type === "select"
								? fieldProps.list.map((item) => ({
										value: item.toLowerCase(),
										label: item,
								  }))
								: []
						}
						rows={fieldProps.type === "textarea" ? 4 : undefined}
						resizable={fieldProps.type === "textarea" ? true : undefined}
						value={fieldProps.value}
						onChange={(e) =>
							handleInputChange(
								sectionName,
								groupIndex,
								fieldName,
								e.target.value
							)
						}
					/>
				);
			}
		});

		flushInlineBatch();

		return <div key={groupIndex}>{renderedFields}</div>;
	};

	return (
		<div>
			{Object.entries(formData).map(([sectionName, groups]) => (
				<div key={sectionName}>
					<h2 className="text-l font-bold text-gray-800 py-2 capitalize">
						{sectionName}
					</h2>
					{groups.map((group, groupIndex) =>
						renderGroup(group, groupIndex, sectionName)
					)}
				</div>
			))}
		</div>
	);
};

export default FormGenerator;
