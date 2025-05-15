import OrderManagement from "@/components/ui/OrderManagement";
// import Products from "../components/ui/ProductManagement";

export default function AdminDashboard() {
	return (
		<div className="flex justify-center items-center min-h-screen bg-[#FCE4EC] p-4 md:p-6">
			<div className="w-full max-w-7xl">
				<OrderManagement />
			</div>
		</div>
	);
}
