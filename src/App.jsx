// import { useState } from 'react'
import "./App.css";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
// import Dashboard from './pages/Dashboard';

function App() {
	return (
		<div className="flex flex-col w-full h-screen bg-gray-50">
			<Header />
			<div className="flex h-full">
				<Sidebar className="flex-none" />
				<main className="flex-grow overflow-y-auto bg-amber-100">
					<div>test</div>
				</main>
			</div>
			{/* <Dashboard /> */}
		</div>
	);
}

export default App;
