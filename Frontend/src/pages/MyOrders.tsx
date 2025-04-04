import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "@/lib/config";
import { Skeleton } from "@/components/ui/Skeleton";

interface ProductItem {
	product_id: number;
	quantity: number;
	price?: string;
}

interface Order {
	id: number;
	user_id: number;
	products: ProductItem[];
	total_amount: number;
	status: string;
	payment_status: string;
	created_at: string;
	updated_at: string;
}

interface ProductInfo {
	id: number;
	title: string;
	description?: string;
	images: any[];
	price: number;
}

const MyOrders = ({ userId }: { userId: number }) => {
	const [orders, setOrders] = useState<Order[]>([]);
	const [products, setProducts] = useState<Record<number, ProductInfo>>({});
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const token = localStorage.getItem("token");
				if (!token) {
					setError("Please login to view your orders");
					setLoading(false);
					return;
				}

				const response = await axios.get(`${API_BASE_URL}/orders/${userId}`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				const orderData = Array.isArray(response.data)
					? response.data
					: [response.data];
				setOrders(orderData);
				console.log(orderData);

				const productIds = new Set<number>();
				orderData.forEach((order) => {
					order.products.forEach((product: any) => {
						productIds.add(product.product_id);
					});
				});

				await fetchProductDetails(Array.from(productIds), token);
			} catch (error) {
				console.error("Error fetching orders:", error);
				setError("Failed to fetch orders. Please try again later.");
				setLoading(false);
			}
		};

		fetchOrders();
	}, [userId]);

	const fetchProductDetails = async (productIds: number[], token: string) => {
		try {
			const productDetails: Record<number, ProductInfo> = {};
			console.log(productIds);

			for (const id of productIds) {
				try {
					const response = await axios.get(`${API_BASE_URL}/products/${id}`, {
						headers: { Authorization: `Bearer ${token}` },
					});
					productDetails[id] = response.data;
				} catch (err) {
					console.error(`Error fetching product ${id}:`, err);
					productDetails[id] = {
						id,
						title: `Product #${id}`,
						images: [],
						price: 0,
					};
				}
			}
			setProducts(productDetails);
			setLoading(false);
		} catch (error) {
			console.error("Error fetching product details:", error);
			setLoading(false);
		}
	};

	const formatDate = (dateString: string) => {
		const options: Intl.DateTimeFormatOptions = {
			year: "numeric",
			month: "long",
			day: "numeric",
		};
		return new Date(dateString).toLocaleDateString(undefined, options);
	};
	const getStatusColor = (status: string) => {
		switch (status.toLowerCase()) {
			case "delivered":
				return "bg-green-500";
			case "shipped":
				return "bg-blue-500";
			case "processing":
			case "pending":
				return "bg-yellow-500";
			case "cancelled":
				return "bg-red-500";
			default:
				return "bg-gray-500";
		}
	};

	const getPaymentStatusColor = (status: string) => {
		return status.toLowerCase() === "paid"
			? "text-green-500"
			: "text-yellow-500";
	};

	if (loading) {
		return (
			<div className="max-w-4xl mx-auto p-6">
				<Skeleton className="h-10 mb-4" />
				<Skeleton className="h-10 mb-4" />
				<Skeleton className="h-10 mb-4" />
				<Skeleton className="h-10 mb-4" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
				<div className="text-center py-8">
					<h3 className="text-xl font-semibold text-red-500 mb-2">Error</h3>
					<p className="text-gray-600 mb-4">{error}</p>
					<button
						className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
						onClick={() => navigate("/login")}
					>
						Go to Login
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto p-6">
			<h2 className="text-2xl font-bold mb-6 text-blue-600">My Orders</h2>
			{orders.length === 0 ? (
				<div className="bg-white shadow-lg rounded-lg p-8 text-center">
					<svg
						className="w-16 h-16 mx-auto text-gray-400 mb-4"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
						/>
					</svg>
					<h3 className="text-xl font-semibold mb-2">No orders found</h3>
					<p className=" text-gray-600 mb-4">
						You haven't placed any orders yet.
					</p>
					<button
						className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
						onClick={() => navigate("/products")}
					>
						Continue Shopping
					</button>
				</div>
			) : (
				<div className="space-y-6">
					{orders.map((order) => (
						<div
							key={order.id}
							className="bg-white shadow-lg rounded-lg overflow-hidden"
						>
							<div className="bg-gray-50 p-4 border-b flex flex-col md:flex-row justify-between items-start md:items-center">
								<div>
									<span className="text-gray-500 text-sm">Order #</span>
									<span className="font-semibold ml-1">{order.id}</span>
								</div>
								<div>
									<span className="text-gray-500 text-sm">Placed on:</span>
									<span className="font-semibold ml-1">
										{formatDate(order.created_at)}
									</span>
								</div>
								<div
									className={`${getStatusColor(
										order.status
									)} text-white text-sm px-3 py-1 rounded-full font-medium mt-2 md:mt-0`}
								>
									{order.status}
								</div>
							</div>

							<div className="p-4">
								{order.products.map((item, index) => {
									const productInfo = products[item.product_id] || {
										id: item.product_id,
										name: `Product #${item.product_id}`,
										price: parseFloat(item.price || "0"),
									};

									const itemPrice =
										Number(item.price) || productInfo.price || 0;
									return (
										<div
											key={index}
											className="flex flex-col sm:flex-row items-start sm:items-center py-4 border-b last:border-0"
										>
											<div className="w-20 h-20 bg-gray-100 rounded flex-shrink-0 mr-4 mb-4 sm:mb-0">
												<img
													src={
														productInfo.images && productInfo.images.length > 0
															? productInfo.images[0]
															: "/placeholder-product.png"
													}
													alt={productInfo.title}
													className="w-full h-full object-contain p-2"
													onClick={() =>
														navigate(`/products/${productInfo.id}`)
													}
												/>
											</div>
											<div className="flex-grow">
												<h4 className="font-medium">{productInfo.title}</h4>
												<div className="flex flex-wrap gap-4 mt-2">
													<p className="text-gray-600">
														Price: ₹
														{((itemPrice || 0) * item.quantity).toFixed(2)}
													</p>
													<p className="text-gray-600">Qty: {item.quantity}</p>
												</div>
											</div>
											<div className="font-bold text-right mt-2 sm:mt-0">
												₹{(itemPrice * item.quantity).toFixed(2)}
											</div>
										</div>
									);
								})}
							</div>

							<div className="bg-gray-50 p-4 border-t flex flex-col md:flex-row justify-between items-start md:items-center">
								<div className="mb-4 md:mb-0">
									<div className="font-semibold">
										<span className="text-gray-600">Total:</span>
										<span className="text-xl text-blue-600 ml-2">
											₹{(Number(order.total_amount) || 0).toFixed(2)}{" "}
										</span>
									</div>
									<div className="text-sm text-gray-500">
										Payment Status:{" "}
										<span
											className={getPaymentStatusColor(order.payment_status)}
										>
											{order.payment_status}
										</span>
									</div>
									<div className="text-xs text-gray-400 mt-1">
										Last updated: {formatDate(order.updated_at)}
									</div>
								</div>
								<div className="flex space-x-3">
									{/* Additional buttons can be added here */}
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default MyOrders;
