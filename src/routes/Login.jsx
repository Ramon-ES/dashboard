import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
const baseUrl = import.meta.env.VITE_API_BASE_URL;

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { login } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const res = await fetch(`${baseUrl}/auth/login`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, password }),
		});

		const data = await res.json();
		console.log(data);
		console.log(res);
		if (res.ok) {
			login(data.token);
			const payload = JSON.parse(atob(data.token.split(".")[1]));
			if (payload.role === "admin") {
				navigate("/admin");
			} else {
				navigate("/dashboard");
			}
		} else {
			alert("Login failed");
		}
	};

	return (
		<div className="flex justify-center items-center h-screen">
			<form
				onSubmit={handleSubmit}
				className="p-10 max-w-md mx-auto space-y-4 bg-white shadow-lg rounded-lg"
			>
				<h2 className="text-2xl font-bold mb-6">Login</h2>
				<input
					type="email"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
					className="w-full p-2 border rounded"
				/>
				<input
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
					className="w-full p-2 border rounded"
				/>
				<button
					type="submit"
					className="px-4 py-2 bg-blue-600 text-white w-full rounded hover:bg-blue-700"
				>
					Login
				</button>
			</form>
		</div>
	);
}
