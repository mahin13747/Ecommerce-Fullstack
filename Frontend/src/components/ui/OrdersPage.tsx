import { useEffect, useState } from "react";

function Orders() {
	const [orders, setOrders] = useState([]);

	useEffect(() => {
		fetch("/api/orders", {
			headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
		})
			.then((res) => res.json())
			.then((data) => setOrders(data))
			.catch((err) => console.error(err));
	}, []);

	return (
		<div className="bg-white p-4 rounded-xl shadow-md">
			<h2 className="text-2xl font-semibold mb-4">Orders</h2>
			<div className="overflow-x-auto">
				<table className="min-w-full bg-white border border-gray-300">
					<thead>
						<tr className="bg-gray-200">
							<th className="px-4 py-2 border">ID</th>
							<th className="px-4 py-2 border">User ID</th>
							<th className="px-4 py-2 border">Products</th>
							<th className="px-4 py-2 border">Total Amount</th>
							<th className="px-4 py-2 border">Status</th>
							<th className="px-4 py-2 border">Payment</th>
							<th className="px-4 py-2 border">Created At</th>
						</tr>
					</thead>
					<tbody>
						{orders.map((order: any) => (
							<tr key={order.id} className="text-center">
								<td className="border px-4 py-2">{order.id}</td>
								<td className="border px-4 py-2">{order.user_id}</td>
								<td className="border px-4 py-2">
									{order.products.map((p: any) => p.name).join(", ")}
								</td>
								<td className="border px-4 py-2">₹{order.total_amount}</td>
								<td className="border px-4 py-2">{order.status}</td>
								<td className="border px-4 py-2">{order.payment_status}</td>
								<td className="border px-4 py-2">
									{new Date(order.created_at).toLocaleDateString()}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default Orders;
