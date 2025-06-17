import React from "react";
import { Outlet } from "react-router-dom";
import Header from "@components/Header";
import Sidebar from "@components/Sidebar";
import "../index.css";

// const { user } = useAuth();

// useEffect(() => {
//   fetch(`/api/data?companyId=${user.companyId}`, {
//     headers: { Authorization: `Bearer ${token}` },
//   })
//     .then(res => res.json())
//     .then(setData);
// }, []);

const DashboardLayout = () => {
	return (
		<div>
			<div className="flex flex-col w-full h-screen bg-gray-50">
				<Header /> {/* takes natural height */}
				{/* content area fills remaining space */}
				<div className="flex flex-1 overflow-auto">
					<Sidebar className="flex-none" />

					<div className="flex flex-grow overflow-hidden">
						<div className="flex-grow overflow-y-auto bg-amber-100">
							<Outlet />
						</div>
						<div className="w-1/3 bg-white border-l overflow-auto">
							{/* <ChatPreview /> */}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DashboardLayout;
