import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ role, children }) {
	const { user, loading } = useAuth();

	if (loading) return <div>Loading...</div>; // or a spinner

	if (!user) return <Navigate to="/login" replace />;

	// role can be string or array
	if (role) {
		const rolesAllowed = Array.isArray(role) ? role : [role];
		if (!rolesAllowed.includes(user.role)) {
			return <Navigate to="/unauthorized" replace />;
		}
	}

	return children;
}
