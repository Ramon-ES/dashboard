// components/DynamicInput.jsx
import { useFormContext } from "react-hook-form";

export default function DynamicInput({
	name,
	label,
	type = "text",
	placeholder,
	options = [],
	rows = 4,
	resizable = false,
	className = "",
	...rest
}) {
	const {
		register,
		formState: { errors },
	} = useFormContext();

	const error = errors[name];

	const baseClass =
		"w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
	const errorClass = error ? "border-red-500" : "border-gray-300";

	const inputProps = {
		id: name,
		...register(name),
		...rest,
	};

	const renderInput = () => {
		switch (type) {
			case "textarea":
				return (
					<textarea
						placeholder={placeholder}
						rows={rows}
						className={`${baseClass} ${errorClass} ${
							resizable ? "" : "resize-none"
						}`}
						{...inputProps}
					/>
				);

			case "select":
				return (
					<select
						className={`${baseClass} ${errorClass}`}
						{...inputProps}
					>
						<option value="">Select...</option>
						{options.map((opt) => (
							<option key={opt.value} value={opt.value}>
								{opt.label}
							</option>
						))}
					</select>
				);

			case "checkbox":
				return (
					<div className="flex items-center gap-2">
						<input
							type="checkbox"
							className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
							{...inputProps}
						/>
						<label
							htmlFor={name}
							className="text-sm font-medium text-gray-700"
						>
							{label}
						</label>
					</div>
				);

			case "number":
				return (
					<input
						type="number"
						placeholder={placeholder}
						className={`${baseClass} ${errorClass}`}
						{...inputProps}
					/>
				);

			default:
				return (
					<input
						type={type}
						placeholder={placeholder}
						className={`${baseClass} ${errorClass}`}
						{...inputProps}
					/>
				);
		}
	};

	return (
		<div
			className={`mb-4 ${
				type === "checkbox" ? "flex items-center" : ""
			} ${className}`}
		>
			{type !== "checkbox" && label && (
				<label
					htmlFor={name}
					className="block text-sm font-medium text-gray-700 mb-1"
				>
					{label}
				</label>
			)}
			{renderInput()}
			{error && (
				<p className="text-sm text-red-600 mt-1">{error.message}</p>
			)}
		</div>
	);
}
