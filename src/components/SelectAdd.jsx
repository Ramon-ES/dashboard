import React, { useState, useEffect } from "react";
import CreatableSelect from "react-select/creatable";

export default function SelectAdd({ passedOptions, selectionChanged }) {
	const [isLoading, setIsLoading] = useState(false);
	const [options, setOptions] = useState([]);
	const [value, setValue] = useState(null);

	// Sync passedOptions to internal state when it changes
	useEffect(() => {
		if (Array.isArray(passedOptions)) {
			setOptions(passedOptions);
		}
	}, [passedOptions]);

	const handleCreate = (inputValue) => {
		setIsLoading(true);
		setTimeout(() => {
			const newOption = {
				label: inputValue,
				value: inputValue.toLowerCase().replace(/\W/g, ""),
			};
			setIsLoading(false);
			setOptions((prev) => [...prev, newOption]);
			setValue(newOption);
			selectionChanged(newOption); // Notify parent of new value
		}, 1000);
	};

	const handleChange = (selectedValue) => {
		setValue(selectedValue);
		selectionChanged(selectedValue);
	};

	return (
		<CreatableSelect
			isClearable
			isDisabled={isLoading}
			isLoading={isLoading}
			onChange={handleChange}
			onCreateOption={handleCreate}
			options={options}
			value={value}
		/>
	);
}
