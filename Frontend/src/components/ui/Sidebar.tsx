import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Sidebar = () => {
	const [isOpen, setIsOpen] = useState(false);
	const location = useLocation();

	const menuItems = [
		{ name: "Dashboard", path: "/dashboard" },
		{ name: "Orders", path: "/orders" },
		{ name: "Users", path: "/users" },
		{ name: "Products", path: "/products" },
		{ name: "Categories", path: "/categories" },
	];

	return (
		<div className="flex">
			{/* Sidebar */}
			<div
				className={`bg-[#9f167f] text-white h-screen w-64 fixed top-0 left-0 p-5 transition-all ${
					isOpen ? "translate-x-0" : "-translate-x-full"
				} md:translate-x-0 z-50`}
			>
				<div className="flex justify-between items-center">
					<h2 className="text-2xl font-bold">Admin Panel</h2>
					<X
						className="md:hidden cursor-pointer"
						onClick={() => setIsOpen(false)}
					/>
				</div>
				<nav className="mt-10">
					{menuItems.map((item) => (
						<Link
							key={item.path}
							to={item.path}
							className={`block py-2 px-4 rounded-md ${
								location.pathname === item.path
									? "bg-white text-[#9f167f]"
									: "hover:bg-[#b41e91]"
							}`}
						>
							{item.name}
						</Link>
					))}
				</nav>
			</div>

			{/* Mobile Toggle Button */}
			<button
				className="md:hidden fixed top-5 left-5 bg-[#9f167f] p-2 rounded text-white z-50"
				onClick={() => setIsOpen(true)}
			>
				<Menu />
			</button>
		</div>
	);
};

export default Sidebar;
