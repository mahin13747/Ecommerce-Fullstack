import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	LogOut,
	Menu,
	X,
	Home,
	Settings,
	Users,
	ShoppingCart,
	Package,
	Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
	user: {
		id: number;
		name: string;
		role: string;
		profilePic?: string;
	} | null;
	handleLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, handleLogout }) => {
	const navigate = useNavigate();
	const [menuOpen, setMenuOpen] = useState(false);
	const [adminMenuOpen, setAdminMenuOpen] = useState(false);

	const handleNavigation = (path: string) => {
		navigate(path);
		setMenuOpen(false);
		setAdminMenuOpen(false);
	};

	const AdminManagementMenu = () => (
		<div
			className={`${
				user?.role === "admin" ? "block" : "hidden"
			} absolute right-0 top-full mt-2 bg-gray-700 rounded-lg p-2 space-y-2 shadow-lg z-50 w-56`}
		>
			<Button
				variant="ghost"
				onClick={() => handleNavigation("/admin/users")}
				className="w-full justify-start text-white hover:bg-gray-600 rounded-lg transition-all duration-200 flex items-center"
			>
				<Users className="h-4 w-4 mr-2" />
				User Management
			</Button>
			<Button
				variant="ghost"
				onClick={() => handleNavigation("/admin/products")}
				className="w-full justify-start text-white hover:bg-gray-600 rounded-lg transition-all duration-200 flex items-center"
			>
				<Package className="h-4 w-4 mr-2" />
				Product Management
			</Button>
			<Button
				variant="ghost"
				onClick={() => handleNavigation("/admin/category")}
				className="w-full justify-start text-white hover:bg-gray-600 rounded-lg transition-all duration-200 flex items-center"
			>
				<Layers className="h-4 w-4 mr-2" />
				Category Management
			</Button>
			<Button
				variant="ghost"
				onClick={() => handleNavigation("/admin/orders")}
				className="w-full justify-start text-white hover:bg-gray-600 rounded-lg transition-all duration-200 flex items-center"
			>
				<ShoppingCart className="h-4 w-4 mr-2" />
				Order Management
			</Button>
		</div>
	);

	return (
		<>
			<nav
				className={`shadow-sm ${
					user?.role === "admin" ? "bg-gray-800" : "bg-blue-600"
				}`}
			>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between h-16 items-center">
						<span className="text-xl font-bold text-yellow-400">ShopHub</span>

						{/* Desktop Navigation */}
						<div className="hidden md:flex items-center space-x-4">
							<Button
								variant="ghost"
								onClick={() =>
									handleNavigation(
										user?.role === "admin" ? "/admin-dashboard" : "/dashboard"
									)
								}
								className="text-white hover:bg-blue-700 rounded-lg transition-all duration-200 flex items-center"
							>
								<Home className="h-4 w-4 mr-2" />
								Home
							</Button>

							{user?.role === "admin" ? (
								<div className="relative">
									<Button
										variant="ghost"
										onClick={() => setAdminMenuOpen(!adminMenuOpen)}
										className="text-white hover:bg-gray-700 rounded-lg transition-all duration-200 flex items-center"
									>
										<Settings className="h-4 w-4 mr-2" />
										Admin Panel
									</Button>
									{adminMenuOpen && <AdminManagementMenu />}
								</div>
							) : (
								<>
									<Button
										variant="ghost"
										onClick={() => handleNavigation("/wishlist")}
										className="text-white hover:bg-blue-700 rounded-lg transition-all duration-200"
									>
										Wishlist
									</Button>
									<Button
										variant="ghost"
										onClick={() => handleNavigation("/cart")}
										className="text-white hover:bg-blue-700 rounded-lg transition-all duration-200"
									>
										Cart
									</Button>
									<Button
										variant="ghost"
										onClick={() => handleNavigation("/myorders")}
										className="text-white hover:bg-blue-700 rounded-lg transition-all duration-200"
									>
										<ShoppingCart className="h-4 w-4 " />
										MyOrders
									</Button>
								</>
							)}

							<Button
								variant="outline"
								onClick={handleLogout}
								className="text-red-600 border-red-200 hover:bg-red-50 rounded-lg transition-all duration-200"
							>
								<LogOut className="h-4 w-4 mr-2" />
								Logout
							</Button>

							<div className="relative flex items-center">
								{user?.profilePic ? (
									<img
										src={user.profilePic}
										alt="Profile"
										className="w-8 h-8 rounded-full border-2 border-yellow-400"
									/>
								) : (
									<div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-blue-600 font-bold">
										{user?.name ? user.name.charAt(0).toUpperCase() : "U"}
									</div>
								)}
							</div>
						</div>

						{/* Mobile Menu Toggle */}
						<button
							className="md:hidden p-2 hover:bg-blue-700 rounded-lg transition-all duration-200 text-white"
							onClick={() => setMenuOpen(!menuOpen)}
						>
							{menuOpen ? (
								<X className="h-6 w-6" />
							) : (
								<Menu className="h-6 w-6" />
							)}
						</button>
					</div>
				</div>

				{/* Mobile Navigation */}
				<div
					className={`md:hidden fixed inset-0 bg-blue-600 transition-transform duration-300 ease-in-out ${
						menuOpen ? "translate-x-0" : "-translate-x-full"
					} z-50`}
				>
					<div className="flex justify-between p-4">
						<span className="text-xl font-bold text-yellow-400">ShopHub</span>
						<button
							className="p-2 text-white"
							onClick={() => setMenuOpen(false)}
						>
							<X className="h-6 w-6" />
						</button>
					</div>
					<div className="flex flex-col space-y-4 p-4">
						<Button
							variant="ghost"
							onClick={() =>
								handleNavigation(
									user?.role === "admin" ? "/admin-dashboard" : "/dashboard"
								)
							}
							className="text-white hover:bg-blue-700 rounded-lg transition-all duration-200 flex items-center"
						>
							<Home className="h-4 w-4 mr-2" />
							Home
						</Button>

						{user?.role === "admin" ? (
							<>
								<Button
									variant="ghost"
									onClick={() => handleNavigation("/admin/users")}
									className="text-white hover:bg-gray-700 rounded-lg transition-all duration-200 flex items-center"
								>
									<Users className="h-4 w-4 mr-2" />
									User Management
								</Button>
								<Button
									variant="ghost"
									onClick={() => handleNavigation("/admin/products")}
									className="text-white hover:bg-gray-700 rounded-lg transition-all duration-200 flex items-center"
								>
									<Package className="h-4 w-4 mr-2" />
									Product Management
								</Button>
								<Button
									variant="ghost"
									onClick={() => handleNavigation("/admin/category")}
									className="text-white hover:bg-gray-700 rounded-lg transition-all duration-200 flex items-center"
								>
									<Layers className="h-4 w-4 mr-2" />
									Category Management
								</Button>
								<Button
									variant="ghost"
									onClick={() => handleNavigation("/admin/orders")}
									className="text-white hover:bg-gray-700 rounded-lg transition-all duration-200 flex items-center"
								>
									<ShoppingCart className="h-4 w-4 mr-2" />
									Order Management
								</Button>
							</>
						) : (
							<>
								<Button
									variant="ghost"
									onClick={() => handleNavigation("/wishlist")}
									className="text-white hover:bg-blue-700 rounded-lg transition-all duration-200"
								>
									Wishlist
								</Button>
								<Button
									variant="ghost"
									onClick={() => handleNavigation("/cart")}
									className="text-white hover:bg-blue-700 rounded-lg transition-all duration-200"
								>
									Cart
								</Button>
								<Button
									variant="ghost"
									onClick={() => handleNavigation("/myorders")}
									className="text-white hover:bg-blue-700 rounded-lg transition-all duration-200"
								>
									<ShoppingCart className="h-4 w-4 " />
									MyOrders
								</Button>
							</>
						)}

						<Button
							variant="outline"
							onClick={handleLogout}
							className="text-red-600 border-red-200 hover:bg-red-50 rounded-lg transition-all duration-200"
						>
							<LogOut className="h-4 w-4 mr-2" />
							Logout
						</Button>

						<div className="flex items-center space-x-2">
							{user?.profilePic ? (
								<img
									src={user.profilePic}
									alt="Profile"
									className="w-8 h-8 rounded-full border-2 border-yellow-400"
								/>
							) : (
								<div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-blue-600 font-bold">
									{user?.name ? user.name.charAt(0).toUpperCase() : "U"}
								</div>
							)}
							<span className="text-white">{user?.name || "User"}</span>
						</div>
					</div>
				</div>
			</nav>
		</>
	);
};

export default Header;
