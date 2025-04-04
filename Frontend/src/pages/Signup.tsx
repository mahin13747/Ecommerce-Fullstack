import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../lib/config";
import { toast } from "sonner";

const Signup = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		role: "user",
		address: "",
		phone_number: "",
	});
	const [error, setError] = useState("");
	const [step, setStep] = useState(1);
	const [animationFrame, setAnimationFrame] = useState(0);
	const navigate = useNavigate();

	useEffect(() => {
		const interval = setInterval(() => {
			setAnimationFrame((prev) => (prev + 1) % 3);
		}, 3000);
		return () => clearInterval(interval);
	}, []);

	const handleChange = (e: any) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		try {
			await axios.post(`${API_BASE_URL}/register`, formData);
			toast.success("Signup successful! Please login.");

			setTimeout(() => navigate("/login"), 1500);
		} catch (err) {
			setError("Signup failed! Try again.");
		}
	};

	const nextStep = () => {
		if (step === 1) {
			if (!formData.name || !formData.email || !formData.password) {
				setError("Please fill all required fields");
				return;
			}
			setError("");
		}
		setStep(step + 1);
	};

	const prevStep = () => {
		setStep(step - 1);
	};

	const CartoonCharacter = () => {
		return (
			<div className="absolute right-2 sm:right-4 top-2 sm:top-4 w-12 sm:w-16 h-12 sm:h-16 transition-all duration-500 ease-in-out">
				{animationFrame === 0 && (
					<div className="relative">
						<div className="w-10 sm:w-12 h-10 sm:h-12 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
							<div className="w-2 h-2 bg-black rounded-full absolute top-3 left-3"></div>
							<div className="w-2 h-2 bg-black rounded-full absolute top-3 right-3"></div>
							<div className="w-4 h-1 bg-black rounded-full absolute top-6 transform rotate-6"></div>
						</div>
						<div className="text-xs mt-1 text-center font-bold text-blue-600 hidden sm:block">
							Join us!
						</div>
					</div>
				)}
				{animationFrame === 1 && (
					<div className="relative">
						<div className="w-10 sm:w-12 h-10 sm:h-12 bg-blue-400 rounded-full flex items-center justify-center animate-pulse">
							<div className="w-2 h-2 bg-black rounded-full absolute top-3 left-3"></div>
							<div className="w-2 h-2 bg-black rounded-full absolute top-3 right-3"></div>
							<div className="w-6 h-1 bg-black rounded-full absolute top-6 transform rotate-180 scale-x-75"></div>
						</div>
						<div className="text-xs mt-1 text-center font-bold text-blue-600 hidden sm:block">
							Fill in!
						</div>
					</div>
				)}
				{animationFrame === 2 && (
					<div className="relative">
						<div className="w-10 sm:w-12 h-10 sm:h-12 bg-green-400 rounded-full flex items-center justify-center animate-wiggle">
							<div className="w-2 h-2 bg-black rounded-full absolute top-3 left-3"></div>
							<div className="w-2 h-2 bg-black rounded-full absolute top-3 right-3"></div>
							<div className="w-5 sm:w-6 h-2 bg-black rounded-full absolute top-6 transform rotate-0 scale-75"></div>
						</div>
						<div className="text-xs mt-1 text-center font-bold text-blue-600 hidden sm:block">
							Almost done!
						</div>
					</div>
				)}
			</div>
		);
	};

	return (
		<div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-50 relative overflow-hidden px-4 py-6">
			{/* Animated Background Elements - Hidden on small screens to improve performance */}
			<div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 hidden sm:block">
				<div className="absolute w-16 h-16 bg-yellow-200 rounded-full top-1/4 left-1/4 animate-float opacity-40"></div>
				<div className="absolute w-12 h-12 bg-blue-200 rounded-full top-3/4 left-1/3 animate-float-delay opacity-40"></div>
				<div className="absolute w-20 h-20 bg-blue-300 rounded-full bottom-1/4 right-1/4 animate-float-slow opacity-40"></div>

				{/* Shopping Bag Icon */}
				<div className="absolute top-10 right-10 text-blue-600 animate-pulse">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-12 sm:h-16 w-12 sm:w-16"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={1.5}
							d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
						/>
					</svg>
				</div>

				{/* Mobile Phone Icon */}
				<div className="absolute bottom-10 left-10 text-blue-600 animate-bounce">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-8 sm:h-12 w-8 sm:w-12"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={1.5}
							d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
						/>
					</svg>
				</div>
			</div>

			{/* Celebration Animation (hidden initially) */}
			<div
				id="celebration"
				className="absolute inset-0 z-20 hidden flex-col items-center justify-center bg-black bg-opacity-50"
			>
				<div className="flex">
					{[...Array(8)].map((_, i) => (
						<div
							key={i}
							className="mx-1 animate-confetti"
							style={{
								animationDelay: `${i * 0.1}s`,
								backgroundColor: ["#FF9800", "#2196F3", "#4CAF50", "#E91E63"][
									i % 4
								],
							}}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-4 sm:h-6 w-4 sm:w-6 text-white"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fillRule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clipRule="evenodd"
								/>
							</svg>
						</div>
					))}
				</div>
				<div className="text-xl sm:text-3xl font-bold text-white mt-4 animate-bounce">
					Welcome to Flipkart!
				</div>
			</div>

			<Card className="p-4 sm:p-6 w-full max-w-sm sm:max-w-md shadow-xl bg-white relative z-10 border-2 border-blue-500 rounded-lg">
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
					{step === 1 ? "Create Account" : "Additional Details"}
				</h2>
				<p className="text-center text-gray-500 mt-1 mb-2 sm:mb-4 text-sm sm:text-base">
					{step === 1
						? "Join to start shopping!"
						: "Just a few more details..."}
				</p>

				<form
					onSubmit={handleSubmit}
					className="space-y-3 sm:space-y-4 mt-4 sm:mt-6"
				>
					{step === 1 ? (
						<>
							<div className="relative">
								<Label className="text-blue-700 font-medium text-sm sm:text-base">
									Full Name
								</Label>
								<Input
									type="text"
									name="name"
									value={formData.name}
									onChange={handleChange}
									required
									className="border-2 border-blue-200 focus:border-blue-500 transition-all duration-300 pl-10 h-10 text-sm sm:text-base"
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
											d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
											clipRule="evenodd"
										/>
									</svg>
								</div>
							</div>

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
									className="border-2 border-blue-200 focus:border-blue-500 transition-all duration-300 pl-10 h-10 text-sm sm:text-base"
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
									className="border-2 border-blue-200 focus:border-blue-500 transition-all duration-300 pl-10 h-10 text-sm sm:text-base"
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
						</>
					) : (
						<>
							<div className="relative">
								<Label className="text-blue-700 font-medium text-sm sm:text-base">
									Address
								</Label>
								<Input
									type="text"
									name="address"
									value={formData.address}
									onChange={handleChange}
									required
									className="border-2 border-blue-200 focus:border-blue-500 transition-all duration-300 pl-10 h-10 text-sm sm:text-base"
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
											d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
											clipRule="evenodd"
										/>
									</svg>
								</div>
							</div>

							<div className="relative">
								<Label className="text-blue-700 font-medium text-sm sm:text-base">
									Phone Number
								</Label>
								<Input
									type="text"
									name="phone_number"
									value={formData.phone_number}
									onChange={handleChange}
									required
									className="border-2 border-blue-200 focus:border-blue-500 transition-all duration-300 pl-10 h-10 text-sm sm:text-base"
								/>
								<div className="absolute left-3 bottom-2 sm:bottom-2.5 text-blue-500">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-4 w-4 sm:h-5 sm:w-5"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
									</svg>
								</div>
							</div>

							<div>
								<Label className="text-blue-700 font-medium text-sm sm:text-base">
									Role
								</Label>
								<div className="relative">
									<select
										name="role"
										value={formData.role}
										onChange={handleChange}
										className="w-full p-2 text-sm sm:text-base border-2 border-blue-200 focus:border-blue-500 rounded-md pl-10 h-10"
									>
										<option value="user">User</option>
										<option value="admin">Admin</option>
									</select>
									<div className="absolute left-3 top-2.5 text-blue-500">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4 sm:h-5 sm:w-5"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fillRule="evenodd"
												d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
												clipRule="evenodd"
											/>
										</svg>
									</div>
								</div>
								{formData.role === "admin" && (
									<div className="flex items-center mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md text-xs sm:text-sm">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 mr-1 sm:mr-2 flex-shrink-0"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fillRule="evenodd"
												d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
												clipRule="evenodd"
											/>
										</svg>
										Only an existing admin can create a new admin.
									</div>
								)}
							</div>
						</>
					)}

					{error && (
						<div className="bg-red-50 p-2 rounded border border-red-200 flex items-center text-red-500 text-xs sm:text-sm animate-pulse">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 flex-shrink-0"
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

					<div className="flex space-x-2 pt-1 sm:pt-2">
						{step === 2 && (
							<Button
								type="button"
								variant="outline"
								className="flex-1 text-xs sm:text-sm border-2 border-blue-300 text-blue-600 h-9 sm:h-10"
								onClick={prevStep}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-4 w-4 sm:h-5 sm:w-5 mr-1"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fillRule="evenodd"
										d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
										clipRule="evenodd"
									/>
								</svg>
								Back
							</Button>
						)}

						{step === 1 ? (
							<Button
								type="button"
								className="flex-1 text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 h-9 sm:h-10"
								onClick={nextStep}
							>
								Next
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-4 w-4 sm:h-5 sm:w-5 ml-1"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fillRule="evenodd"
										d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
										clipRule="evenodd"
									/>
								</svg>
							</Button>
						) : (
							<Button
								type="submit"
								className="flex-1 text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 h-9 sm:h-10"
							>
								Create Account
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-4 w-4 sm:h-5 sm:w-5 ml-1"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fillRule="evenodd"
										d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
										clipRule="evenodd"
									/>
								</svg>
							</Button>
						)}
					</div>

					{step === 1 && (
						<div className="relative flex py-2 sm:py-3 items-center">
							<div className="flex-grow border-t border-gray-300"></div>
							<span className="flex-shrink mx-3 text-gray-500 text-xs sm:text-sm">
								OR
							</span>
							<div className="flex-grow border-t border-gray-300"></div>
						</div>
					)}

					{step === 1 && (
						<Button
							variant="outline"
							className="w-full text-xs sm:text-sm border-2 border-blue-500 text-blue-600 hover:bg-blue-50 transition-all duration-300 h-9 sm:h-10"
							onClick={() => navigate("/login")}
						>
							Already have an account? Login
						</Button>
					)}
				</form>

				{/* Progress indicator */}
				<div className="mt-4 sm:mt-6 flex justify-center">
					<div className="flex space-x-2">
						<div
							className={`h-1.5 sm:h-2 w-6 sm:w-8 rounded-full ${
								step === 1 ? "bg-blue-600" : "bg-blue-200"
							}`}
						></div>
						<div
							className={`h-1.5 sm:h-2 w-6 sm:w-8 rounded-full ${
								step === 2 ? "bg-blue-600" : "bg-blue-200"
							}`}
						></div>
					</div>
				</div>

				{step === 1 && (
					<div className="mt-4 sm:mt-6 flex justify-center space-x-4">
						{/* Social login buttons - hidden on smallest screens */}
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
								<path d="M12 0C5.372 0 0 5.373 0 12s5.372 12 12 12 12-5.373 12-12S18.628 0 12 0zm-2.285 22.143c-5.566-.133-10.03-4.708-9.971-10.285.059-5.577 4.53-10.02 10.114-10L10 17.103l-.143 5.04z" />
							</svg>
						</div>
						<div className="p-1.5 sm:p-2 bg-gray-100 rounded-full text-blue-400 transition transform hover:scale-110 cursor-pointer">
							<svg
								className="w-4 h-4 sm:w-6 sm:h-6"
								fill="currentColor"
								viewBox="0 0 24 24"
							>
								<path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z" />
							</svg>
						</div>
					</div>
				)}
			</Card>
		</div>
	);
};

export default Signup;
