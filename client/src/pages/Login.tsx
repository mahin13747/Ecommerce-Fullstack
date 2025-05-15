import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../lib/config";
import { toast } from "sonner";

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

const Login: React.FC<LoginProps> = ({ setUser }) => {
	const [formData, setFormData] = useState({ email: "", password: "" });
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [animationState, setAnimationState] = useState(0);
	const navigate = useNavigate();

	useEffect(() => {
		const interval = setInterval(() => {
			setAnimationState((prev) => (prev + 1) % 3);
		}, 3000);
		return () => clearInterval(interval);
	}, []);

	const handleChange = (e: any) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			const { data } = await axios.post(`${API_BASE_URL}/login`, formData);
			console.log("Login Response:", data);

			localStorage.setItem("token", data.token);
			localStorage.setItem("user", JSON.stringify(data.user));
			setUser(data.user);

			toast.success("Login successful! Redirecting...");

			setTimeout(() => {
				navigate(
					data.user.role === "admin" ? "/admin-dashboard" : "/dashboard",
					{
						replace: true,
					}
				);
			}, 1000);
		} catch (err: any) {
			console.error("Login Error:", err);
			if (err.response) {
				setError(err.response.data.message || "Invalid email or password!");
			} else {
				setError("Something went wrong! Please try again.");
			}
		} finally {
			setLoading(false);
		}
	};

	// Animation elements
	const CartoonCharacter = () => {
		// Hide on very small screens
		return (
			<div className="absolute right-2 top-2 w-12 h-12 md:right-4 md:top-4 md:w-16 md:h-16 transition-all duration-500 ease-in-out hidden sm:block">
				{animationState === 0 && (
					<div className="relative">
						<div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
							<div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-black rounded-full absolute top-2 md:top-3 left-2 md:left-3"></div>
							<div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-black rounded-full absolute top-2 md:top-3 right-2 md:right-3"></div>
							<div className="w-3 h-1 md:w-4 md:h-1 bg-black rounded-full absolute top-5 md:top-6 transform rotate-6"></div>
						</div>
						<div className="text-xs mt-1 text-center font-bold text-blue-600">
							Hi there!
						</div>
					</div>
				)}
				{animationState === 1 && (
					<div className="relative">
						<div className="w-10 h-10 md:w-12 md:h-12 bg-blue-400 rounded-full flex items-center justify-center animate-pulse">
							<div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-black rounded-full absolute top-2 md:top-3 left-2 md:left-3"></div>
							<div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-black rounded-full absolute top-2 md:top-3 right-2 md:right-3"></div>
							<div className="w-5 h-1 md:w-6 md:h-1 bg-black rounded-full absolute top-6 md:top-7 transform rotate-12 scale-x-75"></div>
						</div>
						<div className="text-xs mt-1 text-center font-bold text-blue-600">
							Welcome!
						</div>
					</div>
				)}
				{animationState === 2 && (
					<div className="relative">
						<div className="w-10 h-10 md:w-12 md:h-12 bg-green-400 rounded-full flex items-center justify-center animate-spin-slow">
							<div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-black rounded-full absolute top-2 md:top-3 left-2 md:left-3"></div>
							<div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-black rounded-full absolute top-2 md:top-3 right-2 md:right-3"></div>
							<div className="w-5 h-1.5 md:w-6 md:h-2 bg-black rounded-full absolute top-6 md:top-7"></div>
						</div>
						<div className="text-xs mt-1 text-center font-bold text-blue-600">
							Login now!
						</div>
					</div>
				)}
			</div>
		);
	};

	return (
		<div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-50 relative overflow-hidden px-4 py-6">
			{/* Animated Background Elements */}
			<div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
				{/* Reduced number of floating elements on small screens */}
				<div className="absolute w-12 h-12 md:w-16 md:h-16 bg-yellow-200 rounded-full top-1/4 left-1/4 animate-float opacity-40"></div>
				<div className="absolute w-10 h-10 md:w-12 md:h-12 bg-blue-200 rounded-full top-3/4 left-1/3 animate-float-delay opacity-40 hidden sm:block"></div>
				<div className="absolute w-16 h-16 md:w-20 md:h-20 bg-blue-300 rounded-full bottom-1/4 right-1/4 animate-float-slow opacity-40 hidden sm:block"></div>

				{/* Shopping Cart Icon - Smaller and hidden on very small screens */}
				<div className="absolute top-6 left-6 md:top-10 md:left-10 text-blue-600 animate-bounce hidden sm:block">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-8 w-8 md:h-12 md:w-12"
						viewBox="0 0 24 24"
						fill="currentColor"
					>
						<path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
					</svg>
				</div>

				{/* Package Icon - Hidden on small screens */}
				<div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 text-blue-600 animate-pulse hidden md:block">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-8 w-8 md:h-12 md:w-12"
						viewBox="0 0 24 24"
						fill="currentColor"
					>
						<path d="M4 3h16a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1z" />
						<path d="M4 9h16M12 3v18" />
					</svg>
				</div>
			</div>

			<Card className="p-4 sm:p-6 w-full max-w-md shadow-xl bg-white relative z-10 border-2 border-blue-500 rounded-lg">
				<div className="flex justify-center mb-4 sm:mb-6">
					<div className="text-2xl sm:text-3xl font-bold text-blue-600 tracking-tight flex items-center">
						<span className="text-blue-600">Flip</span>
						<span className="text-yellow-500">kart</span>
						<span className="ml-2 text-xs sm:text-base italic font-normal text-gray-500">
							inspired
						</span>
					</div>
				</div>

				<CartoonCharacter />

				<h2 className="text-xl sm:text-2xl font-semibold text-center text-gray-800">
					Welcome Back!
				</h2>
				<p className="text-center text-sm sm:text-base text-gray-500 mt-1 mb-3 sm:mb-4">
					Login to access your account
				</p>

				<form
					onSubmit={handleSubmit}
					className="space-y-3 sm:space-y-4 mt-4 sm:mt-6"
				>
					<div className="relative">
						<Label className="text-blue-700 font-medium text-sm sm:text-base">
							Email
						</Label>
						<Input
							type="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							required
							className="border-2 border-blue-200 focus:border-blue-500 transition-all duration-300 pl-10 h-9 sm:h-10 text-sm sm:text-base"
						/>
						<div className="absolute left-3 bottom-2 sm:bottom-2.5 text-blue-500">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-4 w-4 sm:h-5 sm:w-5"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
								<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
							</svg>
						</div>
					</div>

					<div className="relative">
						<Label className="text-blue-700 font-medium text-sm sm:text-base">
							Password
						</Label>
						<Input
							type="password"
							name="password"
							value={formData.password}
							onChange={handleChange}
							required
							className="border-2 border-blue-200 focus:border-blue-500 transition-all duration-300 pl-10 h-9 sm:h-10 text-sm sm:text-base"
						/>
						<div className="absolute left-3 bottom-2 sm:bottom-2.5 text-blue-500">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-4 w-4 sm:h-5 sm:w-5"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fillRule="evenodd"
									d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
									clipRule="evenodd"
								/>
							</svg>
						</div>
					</div>

					{error && (
						<div className="bg-red-50 p-2 rounded border border-red-200 flex items-center text-red-500 text-xs sm:text-sm animate-pulse">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fillRule="evenodd"
									d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
									clipRule="evenodd"
								/>
							</svg>
							{error}
						</div>
					)}

					<div className="flex flex-col sm:flex-row sm:justify-between text-xs sm:text-sm space-y-2 sm:space-y-0">
						<div className="flex items-center">
							<input
								type="checkbox"
								id="remember"
								className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600"
							/>
							<label htmlFor="remember" className="ml-2 text-gray-600">
								Remember me
							</label>
						</div>
						<a href="#" className="text-blue-600 hover:underline">
							Forgot Password?
						</a>
					</div>

					<Button
						type="submit"
						className="w-full bg-blue-600 hover:bg-blue-700 text-white text-base sm:text-lg py-1.5 sm:py-2 transition-all duration-300 transform hover:scale-105"
						disabled={loading}
					>
						{loading ? (
							<div className="flex items-center justify-center">
								<svg
									className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
								>
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"
									></circle>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									></path>
								</svg>
								Logging in...
							</div>
						) : (
							"Login"
						)}
					</Button>

					<div className="relative flex py-2 sm:py-3 items-center">
						<div className="flex-grow border-t border-gray-300"></div>
						<span className="flex-shrink mx-2 sm:mx-3 text-xs sm:text-sm text-gray-500">
							OR
						</span>
						<div className="flex-grow border-t border-gray-300"></div>
					</div>

					<Button
						variant="outline"
						className="w-full border-2 border-blue-500 text-blue-600 hover:bg-blue-50 font-medium text-sm sm:text-base transition-all duration-300"
						onClick={() => navigate("/signup")}
					>
						New to Flipkart? Create Account
					</Button>
				</form>

				<div className="mt-4 sm:mt-6 flex justify-center space-x-3 sm:space-x-4">
					<div className="p-1.5 sm:p-2 bg-gray-100 rounded-full text-blue-600 transition transform hover:scale-110 cursor-pointer">
						<svg
							className="w-4 h-4 sm:w-6 sm:h-6"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
						</svg>
					</div>
					<div className="p-1.5 sm:p-2 bg-gray-100 rounded-full text-red-500 transition transform hover:scale-110 cursor-pointer">
						<svg
							className="w-4 h-4 sm:w-6 sm:h-6"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<path d="M12 0C5.372 0 0 5.373 0 12s5.372 12 12 12 12-5.373 12-12S18.628 0 12 0zm5.82 17.165l-1.736-1.048c-.457.64-1.145 1.261-2.089 1.261-1.214 0-2.066-.845-2.066-2.581V11.25h4.006v-2.833h-4.006V5.583H9.455v2.833H7.57v2.834h1.885v4.03c0 2.333 1.736 3.904 3.866 3.904 1.643 0 2.813-.609 3.5-1.37l.999-1.649z" />
						</svg>
					</div>
					<div className="p-1.5 sm:p-2 bg-gray-100 rounded-full text-blue-400 transition transform hover:scale-110 cursor-pointer">
						<svg
							className="w-4 h-4 sm:w-6 sm:h-6"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.016 10.016 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
						</svg>
					</div>
					<div className="p-1.5 sm:p-2 bg-gray-100 rounded-full text-green-500 transition transform hover:scale-110 cursor-pointer">
						<svg
							className="w-4 h-4 sm:w-6 sm:h-6"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<path d="M24 11.7c0 6.45-5.27 11.68-11.78 11.68-2.07 0-4-.53-5.7-1.45L0 24l2.13-6.27a11.57 11.57 0 01-1.7-6.04C.44 5.23 5.72 0 12.23 0 18.72 0 24 5.23 24 11.7M12.22 1.85c-5.46 0-9.9 4.41-9.9 9.83 0 2.15.7 4.14 1.88 5.76L2.96 21.1l3.8-1.2a9.9 9.9 0 005.46 1.62c5.46 0 9.9-4.4 9.9-9.83a9.88 9.88 0 00-9.9-9.83m5.95 12.52c-.08-.12-.27-.19-.56-.33-.28-.14-1.7-.84-1.97-.93-.26-.1-.46-.15-.65.14-.2.29-.75.93-.91 1.12-.17.2-.34.22-.63.08-.29-.15-1.22-.45-2.32-1.43a8.63 8.63 0 01-1.6-1.98c-.18-.29-.02-.45.12-.6.13-.13.29-.34.43-.5.15-.17.2-.3.29-.48.1-.2.05-.36-.02-.5-.08-.15-.65-1.56-.9-2.13-.24-.58-.48-.48-.64-.48-.17 0-.37-.03-.56-.03-.2 0-.5.08-.77.36-.26.29-1 .98-1 2.4 0 1.4 1.03 2.76 1.17 2.96.14.19 2 3.17 4.93 4.32 2.94 1.15 2.94.77 3.47.72.53-.05 1.7-.7 1.95-1.36.24-.67.24-1.25.17-1.37" />
						</svg>
					</div>
				</div>
			</Card>
		</div>
	);
};

export default Login;
