// import { useState } from "react";
import DynamicInput from "./DynamicInput";

const TemplateComponent = () => {
	return (
		<div className="space-y-4 ">
			<div>
				<h2 className="text-l font-bold text-gray-800 py-2">
					Speaking style
				</h2>

				<DynamicInput
					name="speakingStyle"
					label="Description"
					type="textarea"
					placeholder="Describe the general speaking style of this character"
					rows={5}
				/>

				<DynamicInput
					name="exampleMonologue"
					label="Example monologue"
					type="textarea"
					placeholder="Provide an example monologue from this character"
					rows={5}
				/>
			</div>
			<div>
				<h2 className="text-l font-bold text-gray-800 py-2">Voice</h2>

				<DynamicInput
					name="voice"
					label="The voice of this character"
					type="select"
					options={[
						{ value: "voice1", label: "voice1" },
						{ value: "voice2", label: "voice2" },
						{ value: "voice3", label: "voice3" },
					]}
				/>
			</div>
		</div>
	);
};

export default TemplateComponent;
