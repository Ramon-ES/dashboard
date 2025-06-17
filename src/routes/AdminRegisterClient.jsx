import AdminRegisterClient from "@components/AdminRegisterClient";
import Header from "@components/Header";

export default function Home() {
	return (
		<div>
			<div className="flex flex-col w-full h-screen bg-gray-50">
				<Header /> {/* takes natural height */}
				{/* content area fills remaining space */}
				<div className="flex flex-1 overflow-auto">
					<AdminRegisterClient />
				</div>
			</div>
		</div>
	);
}
