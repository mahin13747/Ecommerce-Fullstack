import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/lib/config";
import { ChevronLeft, ChevronRight, Search, Heart } from "lucide-react";
import { toast } from "sonner";
import { CategoryFilterSkeleton } from "@/components/ui/CategoryFilterSkeleton";
import { PageLoadingSkeleton } from "@/components/ui/PageLoadingSkeleton";
import LazyLoadSection from "@/components/ui/LazyLoadSection";
import { LazyImage } from "@/components/ui/LazyImage";
import { ProductGridSkeleton } from "@/components/ui/ProductGridSkeleton";

const UserDashboard = ({ userId }: { userId: number }) => {
	const navigate = useNavigate();
	const [user, setUser] = useState({ name: "", email: "", profilePic: "" });
	const [allProducts, setAllProducts] = useState<any>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [loading, setLoading] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [activeCategory, setActiveCategory] = useState("All");
	const [totalProductCount, setTotalProductCount] = useState(0);
	const [isSearchModeActive, setIsSearchModeActive] = useState(false);
	const [categories, setCategories] = useState<any>([]);
	const [categoriesLoading, setCategoriesLoading] = useState(false);
	const [sortOrder, setSortOrder] = useState("");
	const [priceRange, setPriceRange] = useState({ min: 0, max: 100000000 });
	const [likedProducts, setLikedProducts] = useState<number[]>([]);
	const [isWishlistLoading, setIsWishlistLoading] = useState(false);
	const [pageLoaded, setPageLoaded] = useState(false);

	const itemsPerPage = 8;
	useEffect(() => {
		const timer = setTimeout(() => {
			setPageLoaded(true);
		}, 500);

		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				setCategoriesLoading(true);
				const response = await fetch(`${API_BASE_URL}/categories`);
				const data = await response.json();
				setCategories([{ id: "all", category_name: "All" }, ...data]);
			} catch (error) {
				console.error("Error fetching categories:", error);
			} finally {
				setCategoriesLoading(false);
			}
		};

		fetchCategories();
	}, []);

	useEffect(() => {
		console.log(user, totalProductCount);
	}, [totalProductCount]);

	useEffect(() => {
		const storedUser = localStorage.getItem("user");
		if (storedUser) {
			setUser(JSON.parse(storedUser));
		} else {
			navigate("/login");
		}
	}, [navigate]);

	useEffect(() => {
		const fetchAllData = async () => {
			try {
				setLoading(true);
				const productsRes = await axios.get(`${API_BASE_URL}/products`);
				setAllProducts(Array.isArray(productsRes.data) ? productsRes.data : []);
				setTotalProductCount(productsRes.data.length);

				if (userId) {
					setIsWishlistLoading(true);
					const wishlistRes = await axios.get(
						`${API_BASE_URL}/wishlist/${userId}`
					);

					if (Array.isArray(wishlistRes.data)) {
						const likedIds = wishlistRes.data.map((item) => item.id);
						setLikedProducts(likedIds);
					}
				}
			} catch (error) {
				console.error("Error fetching data:", error);
				setAllProducts([]);
			} finally {
				setLoading(false);
				setIsWishlistLoading(false);
			}
		};

		fetchAllData();
	}, [userId]);

	useEffect(() => {
		setIsSearchModeActive(!!searchQuery || activeCategory !== "All");
		setCurrentPage(1);
	}, [searchQuery, activeCategory]);

	const filteredProducts = useMemo(() => {
		let filtered = [...allProducts];

		if (searchQuery) {
			filtered = filtered.filter((product) =>
				product.title?.toLowerCase().includes(searchQuery.toLowerCase())
			);
		}

		if (activeCategory !== "All") {
			const selectedCategory = categories.find(
				(cat: any) =>
					cat.category_name.toLowerCase().trim() ===
					activeCategory.toLowerCase().trim()
			);

			if (selectedCategory) {
				const subCategoryIds = categories
					.filter(
						(cat: any) =>
							cat.parent_category === selectedCategory.id ||
							cat.id === selectedCategory.id
					)
					.map((cat: any) => cat.id);

				filtered = filtered.filter((product) => {
					return subCategoryIds.includes(product.category_id);
				});
			}
		}

		filtered = filtered.filter(
			(product) =>
				product.price >= priceRange.min && product.price <= priceRange.max
		);

		if (sortOrder === "low-to-high") {
			filtered.sort((a, b) => a.price - b.price);
		} else if (sortOrder === "high-to-low") {
			filtered.sort((a, b) => b.price - a.price);
		}

		return filtered;
	}, [
		searchQuery,
		activeCategory,
		allProducts.length,
		categories.length,
		sortOrder,
		priceRange,
	]);

	const totalPages = useMemo(() => {
		return Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
	}, [filteredProducts]);

	const displayProducts = useMemo(() => {
		const startIndex = (currentPage - 1) * itemsPerPage;
		return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
	}, [currentPage, filteredProducts]);

	const handleSearch = (e: any) => {
		setSearchQuery(e.target.value);
	};

	const handleCategoryChange = (category: any) => {
		setActiveCategory(category.category_name);
	};

	const nextPage = () =>
		setCurrentPage((prev) => Math.min(prev + 1, totalPages));
	const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

	const toggleWishlist = async (productId: number, event: React.MouseEvent) => {
		event.stopPropagation();

		if (!userId) {
			toast.error("Please login to add items to your wishlist");
			return;
		}

		try {
			setIsWishlistLoading(true);

			const isLiked = likedProducts.includes(productId);

			if (isLiked) {
				await axios.delete(`${API_BASE_URL}/wishlist/${userId}/${productId}`);
				setLikedProducts((prev) => prev.filter((id) => id !== productId));
				toast.success("Removed from wishlist");
			} else {
				await axios.post(`${API_BASE_URL}/wishlist`, {
					user_id: userId,
					product_id: productId,
				});
				setLikedProducts((prev) => [...prev, productId]);
				toast.success("Added to wishlist");
			}
		} catch (error) {
			console.error("Wishlist operation failed:", error);

			if (axios.isAxiosError(error) && error.response?.status === 409) {
				toast.info("Product is already in your wishlist");
			} else {
				toast.error("Failed to update wishlist");
			}
		} finally {
			setIsWishlistLoading(false);
		}
	};

	const handleAddToCart = async (productId: number) => {
		try {
			const response = await axios.post(`${API_BASE_URL}/cart`, {
				user_id: userId,
				product_id: productId,
				quantity: 1,
			});
			console.log("Added to cart:", response.data);
			toast.success("Product Added to cart");
		} catch (error) {
			console.error("Error adding to cart:", error);
			toast.error("Failed to add to cart");
		}
	};

	return (
		<>
			{!pageLoaded ? (
				<PageLoadingSkeleton />
			) : (
				<div className="min-h-screen">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
						<div className="rounded-xl shadow-md overflow-hidden border-gray-400">
							<div className="p-6 border-b border-gray-400 bg-white-50">
								<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
									<h3 className="text-2xl font-semibold text-blue-900">
										{isSearchModeActive
											? "Search Results"
											: "Recommended Products"}
									</h3>

									<div className="relative w-full md:w-80">
										<Search className="h-5 w-5 text-gray-400 absolute left-4 top-3" />
										<input
											type="text"
											placeholder="Search products..."
											className="pl-12 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-gray-800 placeholder-gray-500"
											value={searchQuery}
											onChange={handleSearch}
										/>
									</div>
								</div>

								<LazyLoadSection className="mt-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
									<div className="mt-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
										{categoriesLoading ? (
											<CategoryFilterSkeleton count={8} />
										) : (
											<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 w-full">
												{categories.map((category: any) => (
													<button
														key={category.id}
														onClick={() => handleCategoryChange(category)}
														className={`px-4 py-2 rounded-full text-sm font-medium transition ${
															activeCategory === category.category_name
																? "bg-yellow-400 text-white shadow-md"
																: "bg-gray-100 text-gray-800 hover:bg-gray-200"
														}`}
													>
														{category.category_name}
													</button>
												))}
											</div>
										)}

										<select
											className="border px-4 py-2 rounded-lg text-gray-700 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
											onChange={(e) => setSortOrder(e.target.value)}
										>
											<option value="">Sort By</option>
											<option value="low-to-high">Price: Low to High</option>
											<option value="high-to-low">Price: High to Low</option>
										</select>

										<div className="flex items-center gap-2">
											<input
												type="number"
												className="border p-2 rounded-lg w-24 text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
												placeholder="Min ₹"
												value={priceRange.min}
												onChange={(e) =>
													setPriceRange({
														...priceRange,
														min: Number(e.target.value) || 0,
													})
												}
											/>
											<span className="text-gray-500">-</span>
											<input
												type="number"
												className="border p-2 rounded-lg w-32 text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
												placeholder="Max ₹"
												value={priceRange.max}
												onChange={(e) =>
													setPriceRange({
														...priceRange,
														max: Math.min(
															Number(e.target.value) || 0,
															100000000
														),
													})
												}
											/>
										</div>
									</div>
								</LazyLoadSection>
							</div>

							<div className="p-6">
								{loading ? (
									<ProductGridSkeleton count={itemsPerPage} />
								) : displayProducts.length > 0 ? (
									<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
										{displayProducts.map((product: any) => (
											<div
												key={product.id}
												className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
											>
												<div className="relative">
													<LazyImage
														src={
															product.images?.[0] || "/api/placeholder/300/225"
														}
														alt={product.title || "Product Image"}
														onClick={() => navigate(`/products/${product.id}`)}
														className="rounded-lg shadow-md"
													/>

													<button
														className="absolute top-2 left-2 bg-white p-1 rounded-full shadow-md transition-all duration-200 hover:scale-110"
														onClick={(e) => toggleWishlist(product.id, e)}
														disabled={isWishlistLoading}
													>
														<Heart
															className={`h-5 w-5 ${
																likedProducts.includes(product.id)
																	? "fill-red-500 text-red-500"
																	: "text-gray-400"
															}`}
														/>
													</button>

													{product.discount && (
														<span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
															-{product.discount}%
														</span>
													)}
												</div>

												<div className="p-4">
													<div className="text-xs text-yellow-600 font-medium mb-1">
														{product.category_name}
													</div>
													<h4 className="text-blue-900 font-medium mb-1 line-clamp-1">
														{product.title || "Product Title"}
													</h4>
													<div className="flex items-center">
														<span className="text-blue-900 font-bold">
															₹{product.price || "N/A"}
														</span>
														{product.oldPrice && (
															<span className="ml-2 text-gray-400 line-through text-sm">
																₹{product.oldPrice}
															</span>
														)}
													</div>
													<div className="flex items-center mt-2">
														<div className="flex text-yellow-400">
															{"★".repeat(Math.floor(product.rating || 0))}
															{"☆".repeat(5 - Math.floor(product.rating || 0))}
														</div>
														<span className="text-gray-500 text-xs ml-1">
															({Math.floor(product.rating || 0)}/5)
														</span>
													</div>
													<button
														className="w-full mt-3 bg-yellow-500 text-black font-bold py-2 rounded-md hover:bg-yellow-600 transition-transform transform hover:scale-105"
														onClick={() => handleAddToCart(product.id)}
													>
														Add to Cart
													</button>
												</div>
											</div>
										))}
									</div>
								) : (
									<p className="text-gray-500 text-center py-8">
										{searchQuery
											? "No products match your search. Try different keywords."
											: "No products available."}
									</p>
								)}

								<div className="mt-8 flex items-center justify-between">
									<Button
										variant="outline"
										onClick={prevPage}
										disabled={currentPage === 1}
										className="flex items-center hover:bg-gray-100 rounded-lg transition-all duration-200 text-blue-900 border-blue-300"
									>
										<ChevronLeft className="h-4 w-4 mr-1" />
										Previous
									</Button>
									<span className="text-blue-900 font-medium">
										Page {currentPage} of {totalPages}
									</span>
									<Button
										variant="outline"
										onClick={nextPage}
										disabled={currentPage >= totalPages}
										className="flex items-center hover:bg-gray-100 rounded-lg transition-all duration-200 text-blue-900 border-blue-300"
									>
										Next
										<ChevronRight className="h-4 w-4 ml-1" />
									</Button>
								</div>
							</div>
						</div>
					</div>

					<footer className="bg-blue-600 mt-12 py-8">
						<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
							<div className="md:flex md:justify-between">
								<div className="mb-6 md:mb-0">
									<span className="text-xl font-bold text-yellow-400">
										ShopHub
									</span>
									<p className="mt-2 text-sm text-white">
										Your trusted shopping companion.
									</p>
								</div>
								<div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
									<div>
										<h3 className="text-sm font-semibold text-white mb-4">
											Shop
										</h3>
										<ul className="text-white text-sm space-y-2">
											<li>New Arrivals</li>
											<li>Best Sellers</li>
											<li>Discounts</li>
										</ul>
									</div>
									<div>
										<h3 className="text-sm font-semibold text-white mb-4">
											Support
										</h3>
										<ul className="text-white text-sm space-y-2">
											<li>FAQ</li>
											<li>Contact Us</li>
											<li>Shipping</li>
										</ul>
									</div>
									<div>
										<h3 className="text-sm font-semibold text-white mb-4">
											Legal
										</h3>
										<ul className="text-white text-sm space-y-2">
											<li>Privacy Policy</li>
											<li>Terms of Service</li>
											<li>Returns Policy</li>
										</ul>
									</div>
								</div>
							</div>
							<hr className="my-6 border-blue-700" />
							<div className="flex flex-col md:flex-row md:items-center md:justify-between">
								<div className="text-sm text-white">
									© 2025 ShopHub. All rights reserved.
								</div>
								<div className="flex space-x-6 mt-4 md:mt-0">
									<a href="#" className="text-white hover:text-yellow-400">
										<span className="sr-only">Facebook</span>
										<svg
											className="h-5 w-5"
											fill="currentColor"
											viewBox="0 0 24 24"
											aria-hidden="true"
										>
											<path
												fillRule="evenodd"
												d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
												clipRule="evenodd"
											/>
										</svg>
									</a>
									<a href="#" className="text-white hover:text-yellow-400">
										<span className="sr-only">Instagram</span>
										<svg
											className="h-5 w-5"
											fill="currentColor"
											viewBox="0 0 24 24"
											aria-hidden="true"
										>
											<path
												fillRule="evenodd"
												d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
												clipRule="evenodd"
											/>
										</svg>
									</a>
									<a href="#" className="text-white hover:text-yellow-400">
										<span className="sr-only">Twitter</span>
										<svg
											className="h-5 w-5"
											fill="currentColor"
											viewBox="0 0 24 24"
											aria-hidden="true"
										>
											<path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
										</svg>
									</a>
								</div>
							</div>
						</div>
					</footer>
				</div>
			)}
		</>
	);
};

export default UserDashboard;
