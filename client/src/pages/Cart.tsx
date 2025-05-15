import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/lib/config";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/Skeleton";

interface CartItem {
	id: number;
	product_id: number;
	title: string;
	image: string;
	price: number;
	quantity: number;
}

const Cart = ({ userId }: { userId: number }) => {
	const [cartItems, setCartItems] = useState<CartItem[]>([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchCart = async () => {
			try {
				const { data } = await axios.get(`${API_BASE_URL}/cart/${userId}`);
				setCartItems(data);
			} catch (error) {
				console.error("Error fetching cart:", error);
			} finally {
				setLoading(false);
			}
		};
		if (userId) fetchCart();
	}, [userId]);

	const updateQuantity = async (productId: number, quantity: number) => {
		if (quantity < 1) return;
		try {
			const { data } = await axios.put(`${API_BASE_URL}/cart`, {
				user_id: userId,
				product_id: productId,
				quantity,
			});
			setCartItems((prev) =>
				prev.map((item) =>
					item.product_id === productId
						? { ...item, quantity: data.quantity }
						: item
				)
			);
		} catch (error) {
			console.error("Error updating quantity:", error);
		}
	};

	const removeItem = async (productId: number) => {
		try {
			await axios.delete(`${API_BASE_URL}/cart`, {
				data: { user_id: userId, product_id: productId },
			});
			setCartItems((prev) =>
				prev.filter((item) => item.product_id !== productId)
			);
		} catch (error) {
			console.error("Error removing item:", error);
		}
	};

	const totalPrice = cartItems.reduce(
		(acc, item) => acc + item.price * item.quantity,
		0
	);

	return (
		<div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
			<h2 className="text-2xl font-bold text-blue-900 border-b pb-2 mb-4">
				🛒 Your Cart ({cartItems.length} items)
			</h2>

			{loading ? (
				<div className="space-y-4">
					{Array.from({ length: 3 }).map((_, index) => (
						<div
							key={index}
							className="flex items-center gap-4 border-b pb-3 last:border-0"
						>
							<Skeleton className="w-16 h-16" />
							<div className="flex-1">
								<Skeleton className="h-6 mb-2" />
								<Skeleton className="h-4 mb-2" />
								<Skeleton className="h-4 mb-2" />
								<Skeleton className="h-8" />
							</div>
						</div>
					))}
				</div>
			) : (
				<>
					{cartItems.length === 0 ? (
						<p className="text-gray-500 text-center">Your cart is empty.</p>
					) : (
						<div className="space-y-4">
							{cartItems.map((item) => (
								<div
									key={item.product_id}
									className="flex items-center gap-4 border-b pb-3 last:border-0"
								>
									<img
										src={item.image}
										alt={item.title}
										className="w-16 h-16 object-contain rounded-md"
										onClick={() => navigate(`/products/${item.product_id}`)}
									/>
									<div className="flex-1">
										<h3 className="text-lg font-medium text-gray-900">
											{item.title}
										</h3>
										<p className="text-blue-700 font-bold">₹{item.price}</p>
										<div className="flex items-center gap-2 mt-2">
											<button
												className="bg-gray-200 px-3 py-1 rounded-l hover:bg-gray-300"
												onClick={() =>
													updateQuantity(item.product_id, item.quantity - 1)
												}
											>
												-
											</button>
											<span className="w-10 text-center bg-gray-100 py-1 font-semibold text-lg">
												{item.quantity}
											</span>
											<button
												className={`bg-gray-200 px-3 py-1 rounded-l hover:bg-gray-300 ${
													item.quantity === 1
														? "opacity-50 cursor-not-allowed"
														: ""
												}`}
												onClick={() =>
													updateQuantity(item.product_id, item.quantity + 1)
												}
											>
												+
											</button>
										</div>
									</div>
									<button
										onClick={() => removeItem(item.product_id)}
										className="p-2 rounded-md hover:bg-red-100"
									>
										<Trash2 className="text-red-500 hover:text-red-700" />
									</button>
								</div>
							))}
						</div>
					)}
				</>
			)}

			{cartItems.length > 0 && (
				<div className="mt-6 border-t pt-4">
					<h3 className="text-lg font-bold text-gray-900">
						Total: <span className="text-blue-700">₹{totalPrice}</span>
					</h3>
					<button
						className="w-full bg-yellow-500 text-black font-bold py-3 mt-3 rounded-md hover:bg-yellow-600 transition"
						onClick={() => navigate("/checkout")}
					>
						Proceed to Checkout
					</button>
				</div>
			)}
		</div>
	);
};

export default Cart;
