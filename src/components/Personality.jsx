// import { useState } from "react";
import DynamicInput from "./DynamicInput";

const TemplateComponent = () => {
	return (
		<div className="space-y-4 ">
			<div>
				<h2 className="text-l font-bold text-gray-800 py-2">Presets</h2>

				<DynamicInput
					name="personalityPreset"
					label="Personality presets"
					type="select"
					options={[
						{ value: "personality1", label: "personality1" },
						{ value: "personality2", label: "personality2" },
						{ value: "personality3", label: "personality3" },
					]}
				/>
			</div>
			<div>
				<h2 className="text-l font-bold text-gray-800 py-2">
					Customisable traits
				</h2>
				
                <div className="w-full h-40 flex items-center justify-center bg-gray-100">
                    Coming soon...
                </div>
                <div className="w-full h-40 flex items-center justify-center bg-gray-100">
                    Coming soon...
                </div>
			</div>
		</div>
	);
};

export default TemplateComponent;
