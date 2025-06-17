// import { useState } from "react";
import DynamicInput from "./DynamicInput";

const TemplateComponent = () => {
	return (
		<div className="space-y-4 ">
			<div>
				<h2 className="text-l font-bold text-gray-800 py-2">
					File upload
				</h2>
				<div className="w-full h-40 flex items-center justify-center bg-gray-100">
					Coming soon...
				</div>
			</div>
			<div>
				<h2 className="text-l font-bold text-gray-800 py-2">
					Plain text
				</h2>
				<DynamicInput
					name="speakingStyle"
					label="Description"
					type="textarea"
					placeholder="Describe the general speaking style of this character"
					rows={5}
				/>
			</div>
		</div>
	);
};

export default TemplateComponent;
