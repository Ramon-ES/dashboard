import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
	createBrowserRouter,
	RouterProvider,
	Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
// import "./index.css";
import Home from "@routes/Home";
import NotFound from "@routes/NotFound";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./routes/Login";
import AdminRegisterClient from "./routes/AdminRegisterClient";
import AdminDashboard from "./routes/AdminDashboard";
import CharacterCreator from "./components/CharacterCreator";
import ConversationalContext from "./components/ConversationalContext";
// import TestForm from "./routes/testForm"

const router = createBrowserRouter([
	{
		path: "*",
		element: <NotFound />,
	},
	// {
	// 	path: "/test-form",
	// 	element: <TestForm />,
	// },
	{
		path: "/login",
		element: <Login />,
	},
	{
		path: "/register-client",
		element: (
			<ProtectedRoute role="admin">
				<AdminRegisterClient />
			</ProtectedRoute>
		),
	},
	{
		path: "/admin",
		element: (
			<ProtectedRoute role="admin">
				<AdminDashboard />
			</ProtectedRoute>
		),
	},
	{
		path: "/dashboard",
		element: (
			<ProtectedRoute role={["client", "admin"]}>
				<DashboardLayout />
			</ProtectedRoute>
		),
		children: [
			{
				index: true,
				element: <Navigate to="character-creator" replace />,
			},
			{ path: "character-creator", element: <CharacterCreator /> },
			{
				path: "conversational-context",
				element: <ConversationalContext />,
			},
			{ path: "custom-tabs", element: <div>Custom Tabs</div> },
			{
				path: "interaction-history",
				element: <div>Interaction History</div>,
			},
		],
	},
	{
		path: "/test",
		element: <div>test</div>,
	},
]);

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<AuthProvider>
			<RouterProvider router={router} />
		</AuthProvider>
	</StrictMode>
);
