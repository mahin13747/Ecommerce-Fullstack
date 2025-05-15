import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "@/lib/config";
import { Heart, ShoppingCart, Trash2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/Skeleton"; // Import your skeleton component

const Wishlist = () => {
	const [wishlistItems, setWishlistItems] = useState<any[]>([]);
	const [userId, setUserId] = useState<number | null>(null);
	const [loading, setLoading] = useState(true);
	const [isWishlistLoading, setIsWishlistLoading] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const storedUser = localStorage.getItem("user");
		if (storedUser) {
			const parsedUser = JSON.parse(storedUser);
			setUserId(parsedUser.id);
		} else {
			navigate("/login");
		}
	}, [navigate]);

	useEffect(() => {
		if (userId) {
			fetchWishlist();
		}
	}, [userId]);

	const fetchWishlist = async () => {
		try {
			setLoading(true);
			const response = await axios.get(`${API_BASE_URL}/wishlist/${userId}`);
			if (Array.isArray(response.data)) {
				setWishlistItems(response.data);
			} else {
				setWishlistItems([]);
				toast.error("Invalid wishlist data format");
			}
		} catch (error) {
			console.error("Error fetching wishlist:", error);
			toast.error("Failed to load your wishlist");
			setWishlistItems([]);
		} finally {
			setLoading(false);
		}
	};

	const removeFromWishlist = async (
		productId: number,
		event: React.MouseEvent
	) => {
		event.stopPropagation();
		if (!userId) {
			toast.error("Please login to manage your wishlist");
			return;
		}
		try {
			setIsWishlistLoading(true);
			const response = await axios.delete(
				`${API_BASE_URL}/wishlist/${userId}/${productId}`
			);
			if (response.status === 200) {
				setWishlistItems((prev) =>
					prev.filter((item) => (item.product_id || item.id) !== productId)
				);
				toast.success("Item removed from wishlist");
			} else {
				throw new Error("Failed to remove from wishlist");
			}
		} catch (error) {
			console.error("Failed to remove from wishlist:", error);
			toast.error("Failed to remove item from wishlist");
		} finally {
			setIsWishlistLoading(false);
		}
	};

	const addToCart = async (productId: number, event: React.MouseEvent) => {
		event.stopPropagation();
		if (!userId) {
			toast.error("Please login to add items to your cart");
			return;
		}
		try {
			await axios.post(`${API_BASE_URL}/cart`, {
				user_id: userId,
				product_id: productId,
				quantity: 1,
			});
			toast.success("Product added to cart");
		} catch (error) {
			console.error("Error adding to cart:", error);
			if (axios.isAxiosError(error) && error.response?.status === 409) {
				toast.info("Product is already in your cart");
			} else {
				toast.error("Failed to add product to cart");
			}
		}
	};

	const navigateToProduct = (productId: number) => {
		navigate(`/products/${productId}`);
	};

	const EmptyWishlist = () => (
		<div className="flex flex-col items-center justify-center py-16">
			<Heart className="h-24 w-24 text-gray-300 mb-4" />
			<h3 className="text-2xl font-medium text-gray-700">
				Your wishlist is empty
			</h3>
			<p className="text-gray-500 mt-2 mb-6">
				Items added to your wishlist will appear here
			</p>
			<Button
				className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
				onClick={() => navigate("/")}
			>
				<ArrowLeft className="mr-2 h-4 w-4" />
				Continue Shopping
			</Button>
		</div>
	);

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between mb-8">
					<h1 className="text-3xl font-bold text-blue-900">My Wishlist</h1>
					<Button
						variant="outline"
						className="border-blue-300 text-blue-900 hover:bg-blue-50"
						onClick={() => navigate("/")}
					>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to Shop
					</Button>
				</div>

				{loading ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{Array.from({ length: 4 }).map((_, index) => (
							<div
								key={index}
								className="bg-white border border-gray-200 rounded-lg overflow-hidden"
							>
								<Skeleton className="h-32" />
								<div className="p-4">
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
						{wishlistItems.length === 0 ? (
							<EmptyWishlist />
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
								{wishlistItems.map((item) => {
									const productId = item.product_id || item.id;
									return (
										<div
											key={productId}
											className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
											onClick={() => navigateToProduct(productId)}
										>
											<div className="relative pb-[75%] bg-gray-100">
												<img
													src={item.images?.[0] || "/api/placeholder/300/225"}
													alt={item.title || "Product Image"}
													className="absolute inset-0 w-full h-full object-contain"
												/>
												<button
													className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md transition-all duration-200 hover:scale-110"
													onClick={(e) => removeFromWishlist(productId, e)}
													disabled={isWishlistLoading}
												>
													<Trash2 className="h-5 w-5 text-red-500" />
												</button>
											</div>
											<div className="p-4">
												<h4 className="text-blue-900 font-medium mb-1 line-clamp-1">
													{item.title || "Product Title"}
												</h4>
												<div className="flex items-center justify-between">
													<span className="text-blue-900 font-bold">
														₹{item.price || "N/A"}
													</span>
												</div>
												<button
													className="w-full mt-3 bg-yellow-500 text-black font-bold py-2 rounded-md hover:bg-yellow-600 transition-transform transform hover:scale-105 flex items-center justify-center"
													onClick={(e) => addToCart(productId, e)}
												>
													<ShoppingCart className="h-4 w-4 mr-2" />
													Add to Cart
												</button>
											</div>
										</div>
									);
								})}
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
};

export default Wishlist;
