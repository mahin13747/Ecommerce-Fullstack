import { useState, useEffect, Suspense, lazy } from "react";
import { API_BASE_URL } from "@/lib/config";
import axios from "axios";
import { Skeleton } from "@/components/ui/Skeleton";

interface Order {
	order_id: number;
	id: number;
	customer_name: string;
	customer_email: string;
	total_amount: number;
	status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
	created_at: string;
	items: OrderItem[];
}

interface OrderItem {
	id: number;
	product_id: number;
	product_name: string;
	quantity: number;
	price: number;
}

const OrderDetailsModal = lazy(() => import("./OrderDetailsModel"));

export default function OrderManagement() {
	const [orders, setOrders] = useState<Order[]>([]);
	const [newOrder, setNewOrder] = useState<any>({
		customer_name: "",
		customer_email: "",
		order_date: "",
		products: [],
	});
	const [editingOrder, setEditingOrder] = useState<Order | null>(null);
	const [products, setProducts] = useState<any[]>([]);
	const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
	const [productQuantity, setProductQuantity] = useState<number>(1);
	const [users, setUsers] = useState([]);
	const [selectedUser, setSelectedUser] = useState<any>({});
	const [loading, setLoading] = useState(true);
	const [render, setrender] = useState(false);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await axios.get(`${API_BASE_URL}/users`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				});
				setUsers(response.data);
			} catch (error) {
				console.error("Error fetching users:", error);
			}
		};

		fetchUsers();
	}, []);

	useEffect(() => {
		const fetchInitialData = async () => {
			setLoading(true);
			try {
				const [productsResponse, ordersResponse] = await Promise.all([
					axios.get(`${API_BASE_URL}/products`),
					axios.get(`${API_BASE_URL}/orders`, {
						headers: {
							Authorization: `Bearer ${localStorage.getItem("token")}`,
						},
					}),
				]);

				setProducts(productsResponse.data);
				setOrders(ordersResponse.data);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching initial data:", error);
				setLoading(false);
			}
		};

		fetchInitialData();
	}, [render]);

	const addProductToOrder = () => {
		if (!selectedProduct || productQuantity <= 0) return;

		const product = products.find((p) => p.id === selectedProduct);
		if (!product) return;

		setNewOrder((prev: any) => {
			const existingProduct = prev.products.find(
				(p: any) => p.product_id === product.id
			);
			let updatedProducts;

			if (existingProduct) {
				updatedProducts = prev.products.map((p: any) =>
					p.product_id === product.id
						? { ...p, quantity: p.quantity + productQuantity }
						: p
				);
			} else {
				updatedProducts = [
					...prev.products,
					{ product_id: product.id, quantity: productQuantity },
				];
			}

			const updatedTotal = updatedProducts.reduce((sum: any, p: any) => {
				const productInfo = products.find((prod) => prod.id === p.product_id);
				return sum + (productInfo ? productInfo.price * p.quantity : 0);
			}, 0);

			return { ...prev, products: updatedProducts, total_amount: updatedTotal };
		});

		setSelectedProduct(null);
		setProductQuantity(1);
	};

	const createOrder = async (user: any) => {
		if (!user || newOrder.products.length === 0) {
			alert("User ID and at least one product are required.");
			return;
		}

		try {
			const response = await axios.post(
				`${API_BASE_URL}/orders`,
				{
					...newOrder,
					user_id: user,
					status: "Pending",
					payment_status: "Unpaid",
				},
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				}
			);

			setOrders([...orders, response.data]);

			setNewOrder({
				user_id: user,
				products: [],
				total_amount: 0,
				status: "Pending",
				payment_status: "Unpaid",
			});
			setrender(true);
		} catch (error) {
			console.error("Error creating order:", error);
		}
	};

	const updateOrderStatus = async (
		orderId: number,
		newStatus: Order["status"]
	) => {
		try {
			const response = await axios.patch(
				`${API_BASE_URL}/orders/${orderId}/status`,
				{ status: newStatus },
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				}
			);

			if (response.status === 200) {
				setOrders((prevOrders) =>
					prevOrders.map((order) =>
						order.order_id === orderId ? { ...order, status: newStatus } : order
					)
				);
			}
		} catch (error) {
			console.error("Error updating order status:", error);
		}
	};

	const deleteOrder = async (orderId: number) => {
		try {
			await axios.delete(`${API_BASE_URL}/orders/${orderId}`, {
				headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
			});

			setOrders((prevOrders) =>
				prevOrders.filter((order) => order.order_id !== orderId)
			);
		} catch (error) {
			console.error("Error deleting order:", error);
		}
	};

	if (loading) {
		return <OrderManagementSkeleton />;
	}

	return (
		<div className="container mx-auto px-4 py-6">
			<h2 className="text-xl md:text-2xl font-semibold mb-4 text-center md:text-left">
				Order Management
			</h2>

			<div className="bg-white rounded-xl shadow-md p-4 mb-6">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
					<div className="space-y-3">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							<select
								value={selectedUser || ""}
								onChange={(e: any) => setSelectedUser(e.target.value)}
								className="w-full p-2 border rounded"
							>
								<option value="">Select User</option>
								{users.map((user: any) => (
									<option key={user.id} value={user.id}>
										{user.name}
									</option>
								))}
							</select>
							<select
								value={selectedUser || ""}
								onChange={(e: any) => setSelectedUser(e.target.value)}
								className="w-full p-2 border rounded"
							>
								<option value="">Select email</option>
								{users.map((user: any) => (
									<option key={user.id} value={user.id}>
										{user.email}
									</option>
								))}
							</select>
						</div>
						<input
							type="date"
							placeholder="Order Date"
							value={newOrder.order_date}
							onChange={(e) =>
								setNewOrder((prev: any) => ({
									...prev,
									order_date: e.target.value,
								}))
							}
							className="w-full p-2 sm:p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					<div className="space-y-3">
						<div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
							<select
								value={selectedProduct || ""}
								onChange={(e) => setSelectedProduct(Number(e.target.value))}
								className="flex-grow p-2 sm:p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								<option value="">Select Product</option>
								{products.map((product) => (
									<option key={product.id} value={product.id}>
										{product.title} (₹{product.price})
									</option>
								))}
							</select>
							<div className="flex items-center gap-2">
								<input
									type="number"
									value={productQuantity}
									onChange={(e) => setProductQuantity(Number(e.target.value))}
									min="1"
									className="w-20 p-2 sm:p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
								<button
									onClick={addProductToOrder}
									className="bg-blue-500 text-white px-3 sm:px-4 py-2 rounded-md hover:bg-blue-600 transition"
								>
									Add
								</button>
							</div>
						</div>

						<div className="max-h-40 overflow-y-auto">
							{newOrder.products.map((item: any, index: any) => {
								const product = products.find((p) => p.id === item.product_id);
								return (
									<div
										key={index}
										className="flex justify-between items-center bg-gray-100 p-2 sm:p-3 rounded-md shadow-sm mb-2"
									>
										<span className="truncate mr-2">{product?.title}</span>
										<span className="font-semibold">Qty: {item.quantity}</span>
									</div>
								);
							})}
						</div>
					</div>
				</div>

				<button
					onClick={() => createOrder(selectedUser)}
					className="w-full mt-4 bg-green-500 text-white p-2 sm:p-3 rounded-md 
        disabled:opacity-50 hover:bg-green-600 transition"
				>
					Create Order
				</button>
			</div>

			<div className="bg-white rounded-xl shadow-md overflow-x-auto">
				<table className="w-full min-w-[800px]">
					<thead>
						<tr className="bg-gray-200">
							<th className="p-2 sm:p-3 border">Order ID</th>
							<th className="p-2 sm:p-3 border">Customer</th>
							<th className="p-2 sm:p-3 border">Total Amount</th>
							<th className="p-2 sm:p-3 border">Status</th>
							<th className="p-2 sm:p-3 border">Date</th>
							<th className="p-2 sm:p-3 border">Actions</th>
						</tr>
					</thead>
					<tbody>
						{orders.map((order) => (
							<tr key={order.id} className="text-center hover:bg-gray-50">
								<td className="p-2 sm:p-3 border">{order.order_id}</td>
								<td className="p-2 sm:p-3 border truncate max-w-[150px]">
									{order.customer_name}
								</td>
								<td className="p-2 sm:p-3 border">
									₹{Number(order.total_amount).toFixed(2)}
								</td>
								<td className="p-2 sm:p-3 border">
									<select
										value={order.status}
										onChange={(e) =>
											updateOrderStatus(
												order.order_id,
												e.target.value as Order["status"]
											)
										}
										className="w-full bg-transparent"
									>
										<option value="Pending">Pending</option>
										<option value="Shipped">Shipped</option>
										<option value="Delivered">Delivered</option>
									</select>
								</td>
								<td className="p-2 sm:p-3 border">
									{new Date(order.created_at).toLocaleDateString()}
								</td>
								<td className="p-2 sm:p-3 border space-x-2">
									<div className="flex flex-col sm:flex-row gap-2 justify-center">
										<button
											onClick={() => deleteOrder(order.order_id)}
											className="bg-red-500 text-white px-2 py-1 rounded text-xs sm:text-sm"
										>
											Delete
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{editingOrder && (
				<Suspense fallback={<ModalSkeleton />}>
					<OrderDetailsModal
						order={editingOrder}
						onClose={() => setEditingOrder(null)}
					/>
				</Suspense>
			)}
		</div>
	);
}

export function OrderManagementSkeleton() {
	return (
		<div className="container mx-auto px-4 py-6">
			<Skeleton className="h-8 w-48 mb-4" />

			<div className="bg-white rounded-xl shadow-md p-4 mb-6">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
					<div className="space-y-3">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							<Skeleton className="h-10 w-full" />
							<Skeleton className="h-10 w-full" />
						</div>
						<Skeleton className="h-10 w-full" />
					</div>

					<div className="space-y-3">
						<div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
							<Skeleton className="h-10 w-full flex-grow" />
							<div className="flex items-center gap-2">
								<Skeleton className="h-10 w-20" />
								<Skeleton className="h-10 w-16" />
							</div>
						</div>

						<div className="max-h-40">
							<Skeleton className="h-10 w-full mb-2" />
							<Skeleton className="h-10 w-full mb-2" />
						</div>
					</div>
				</div>

				<Skeleton className="h-10 w-full mt-4" />
			</div>

			<div className="bg-white rounded-xl shadow-md overflow-x-auto">
				<div className="h-12 bg-gray-200 w-full"></div>
				{[1, 2, 3, 4].map((i) => (
					<div key={i} className="flex w-full">
						<Skeleton className="h-16 w-full" />
					</div>
				))}
			</div>
		</div>
	);
}

function ModalSkeleton() {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
			<div className="bg-white w-full max-w-md rounded-lg shadow-lg p-4 sm:p-6 max-h-[90vh]">
				<Skeleton className="h-8 w-40 mb-4" />
				<div className="space-y-2">
					<Skeleton className="h-6 w-full" />
					<Skeleton className="h-6 w-full" />
					<Skeleton className="h-6 w-full" />
					<Skeleton className="h-6 w-full" />
				</div>
				<Skeleton className="h-8 w-40 mt-4 mb-2" />
				<div className="space-y-2">
					<Skeleton className="h-12 w-full" />
					<Skeleton className="h-12 w-full" />
				</div>
				<Skeleton className="h-10 w-full mt-4" />
			</div>
		</div>
	);
}
