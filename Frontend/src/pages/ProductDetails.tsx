import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "@/lib/config";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/Skeleton";
import { LazyImage } from "@/components/ui/LazyImage";

interface Product {
	id: number;
	title: string;
	price: number;
	description: string;
	images: string[];
	rating: number;
	stock: number;
}

const ProductDetails = ({ userId }: { userId: number }) => {
	const { id } = useParams<{ id: string }>();
	const [product, setProduct] = useState<Product | null>(null);
	const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
	const [loadingProduct, setLoadingProduct] = useState(true);
	const [loadingRelated, setLoadingRelated] = useState(false);
	const [mainImage, setMainImage] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		const fetchProduct = async () => {
			setLoadingProduct(true);
			try {
				const response = await axios.get(`${API_BASE_URL}/products/${id}`);
				setProduct(response.data);
				setMainImage(response.data.images?.[0] || "");
			} catch (error) {
				console.error("Error fetching product:", error);
			} finally {
				setLoadingProduct(false);
			}
		};

		fetchProduct();
	}, [id]);

	useEffect(() => {
		const fetchRelatedProducts = async () => {
			if (product) {
				setLoadingRelated(true);
				try {
					const allProductsResponse = await axios.get(
						`${API_BASE_URL}/products`
					);
					const allProducts: Product[] = allProductsResponse.data;
					const currentIndex = allProducts.findIndex(
						(p) => p.id === Number(id)
					);
					const nextProducts = allProducts.slice(
						currentIndex + 1,
						currentIndex + 5
					);
					setRelatedProducts(nextProducts);
				} catch (error) {
					console.error("Error fetching related products:", error);
				} finally {
					setLoadingRelated(false);
				}
			}
		};

		fetchRelatedProducts();
	}, [product, id]);

	if (loadingProduct) {
		return (
			<div className="w-full max-w-6xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-md flex flex-col items-center justify-center min-h-screen">
				<Skeleton className="w-full h-80 mb-4" />
				<Skeleton className="w-3/4 h-8 mb-2" />
				<Skeleton className="w-1/3 h-6 mb-2" />
				<Skeleton className="w-full h-4 mb-2" />
				<Skeleton className="w-1/3 h-6 mb-2" />
				<Skeleton className="w-full h-10" />
			</div>
		);
	}

	if (!product) {
		return <div className="text-center py-10">Product not found</div>;
	}

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
			alert("Failed to add to cart.");
		}
	};

	return (
		<div className="w-full max-w-6xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-md flex flex-col items-center justify-center min-h-screen">
			<div className="flex flex-col md:flex-row w-full gap-6 md:gap-10">
				<div className="w-full md:w-2/3 flex flex-col items-center">
					<div className="w-full max-w-md">
						<LazyImage
							src={mainImage}
							alt={product.title}
							className="w-full h-64 sm:h-80 md:h-96 object-contain rounded-lg shadow-md transition-all duration-300"
						/>
					</div>
					<div className="flex gap-2 mt-4 w-full max-w-md overflow-x-auto justify-center pb-2">
						{product.images?.map((image, index) => (
							<LazyImage
								key={index}
								src={image}
								alt={`${product.title} ${index + 1}`}
								className={`w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-md cursor-pointer border-2 ${
									mainImage === image
										? "border-indigo-600 scale-110"
										: "border-gray-300"
								} transition-transform duration-300 flex-shrink-0`}
								onClick={() => setMainImage(image)}
							/>
						))}
					</div>
				</div>

				<div className="w-full md:w-1/3 space-y-4 text-center md:text-left">
					<h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
						{product.title}
					</h1>
					<p className="text-gray-600 text-xl sm:text-2xl font-semibold">
						₹{Number(product.price).toFixed(2)}
					</p>

					<div className="flex justify-center md:justify-start items-center mt-2">
						<div className="flex text-yellow-400 text-lg">
							{"★".repeat(Math.floor(Number(product.rating)))}
							{"☆".repeat(5 - Math.floor(Number(product.rating)))}
						</div>
						<span className="text-gray-500 text-sm ml-2">
							({Number(product.rating).toFixed(1)})
						</span>
					</div>

					<p className="text-gray-700">{product.description}</p>
					<p className="text-gray-600 font-medium">Stock: {product.stock}</p>

					<button
						className="w-full max-w-xs mx-auto md:mx-0 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-transform transform hover:scale-105"
						onClick={() => {
							handleAddToCart(product.id);
						}}
					>
						Add to Cart
					</button>
				</div>
			</div>

			{loadingRelated ? (
				<div className="mt-8 sm:mt-10 w-full">
					<Skeleton className="h-24 sm:h-32 mb-4" />
					<Skeleton className="h-24 sm:h-32 mb-4" />
					<Skeleton className="h-24 sm:h-32 mb-4" />
				</div>
			) : relatedProducts.length > 0 ? (
				<div className="mt-8 sm:mt-10 w-full">
					<h2 className="text-xl sm:text-2xl font-bold text-center mb-4">
						Related Products
					</h2>
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 w-full">
						{relatedProducts.map((item) => (
							<div
								key={item.id}
								className="bg-gray-100 p-2 sm:p-3 rounded-lg shadow-md"
							>
								<LazyImage
									src={item.images[0]}
									alt={item.title}
									className="w-full h-24 sm:h-32 object-contain rounded-md"
								/>
								<h3 className="text-xs sm:text-sm font-semibold mt-2 truncate">
									{item.title}
								</h3>
								<p className="text-gray-600 text-xs sm:text-sm">
									₹{Number(item.price).toFixed(2)}
								</p>
								<button
									className="w-full mt-2 bg-indigo-500 text-white text-xs sm:text-sm py-1 rounded-md hover:bg-indigo-600"
									onClick={() => navigate(`/products/${item.id}`)}
								>
									View
								</button>
							</div>
						))}
					</div>
				</div>
			) : (
				<div className="mt-8 sm:mt-10 w-full">
					<p className="text-center">No related products found.</p>
				</div>
			)}
		</div>
	);
};

export default ProductDetails;
