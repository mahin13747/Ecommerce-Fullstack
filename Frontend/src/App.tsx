import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { useEffect, useState, createContext, useContext } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AppRoutes from "./Routes/AppRoutes";

const AuthContext = createContext<any>(null);
// types.ts
export interface User {
	id: number;
	name: string;
	role: string;
	email: string;
	profilePic?: string;
}

// LoginProps.ts
export interface LoginProps {
	setUser: (user: User) => void;
}

const App = () => {
	const [user, setUser] = useState<{
		id: number;
		name: string;
		role: string;
		profilePic?: string;
	} | null>(null);

	useEffect(() => {
		const storedUser = localStorage.getItem("user");
		if (storedUser) {
			setUser(JSON.parse(storedUser));
		}
	}, []);

	const handleLogin = (userData: any) => {
		localStorage.setItem("user", JSON.stringify(userData));
		setUser(userData);
	};

	const handleLogout = () => {
		localStorage.removeItem("user");
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, setUser, handleLogin, handleLogout }}>
			<BrowserRouter>
				<Toaster position="top-right" richColors />
				{user ? (
					<AppRoutes user={user} handleLogout={handleLogout} />
				) : (
					<Routes>
						<Route path="/login" element={<Login setUser={setUser} />} />
						<Route path="/signup" element={<Signup />} />
						<Route path="*" element={<Navigate to="/login" />} />
					</Routes>
				)}
			</BrowserRouter>
		</AuthContext.Provider>
	);
};

export default App;
export const useAuth = () => useContext(AuthContext);
