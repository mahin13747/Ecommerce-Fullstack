import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/lib/config";
import axios from "axios";
import { OrderManagementSkeleton } from "./OrderManagement";

export default function Products() {
	const [products, setProducts] = useState<any>([]);
	const [newProduct, setNewProduct] = useState<Omit<any, "id">>({
		title: "",
		description: "",
		price: null,
		category_id: null,
		stock: null,
		images: [],
		rating: null,
	});
	const [editingProduct, setEditingProduct] = useState<any | null>(null);
	const [imageUrl, setImageUrl] = useState("");
	const [categories, setCategories] = useState<any>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const response = await axios.get(`${API_BASE_URL}/categories`);
				setCategories(response.data);
			} catch (error) {
				console.error("Error fetching categories:", error);
			}
		};
		fetchCategories();
	}, []);

	useEffect(() => {
		setLoading(true);

		fetchProducts();
		setTimeout(() => {
			setLoading(false);
		}, 200);
	}, []);

	const fetchProducts = async () => {
		try {
			const res = await fetch(`${API_BASE_URL}/products`, {
				headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
			});
			const data = await res.json();
			setProducts(data);
		} catch (err) {
			console.error(err);
		}
	};

	const handleInputChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const { name, value } = e.target;
		setNewProduct((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleAddImageUrl = () => {
		if (imageUrl.trim()) {
			setNewProduct({
				...newProduct,
				images: [...newProduct.images, imageUrl],
			});
			setImageUrl("");
		}
	};
	const addProduct = async () => {
		try {
			const productData = {
				...newProduct,
				price: Number(newProduct.price),
				category_id: Number(newProduct.category_id),
				stock: Number(newProduct.stock),
				rating: newProduct.rating ? Number(newProduct.rating) : null,
				images: Array.isArray(newProduct.images)
					? newProduct.images
					: [newProduct.images], // Convert string to array
			};

			console.log("Sending Product Data:", productData);

			const res = await fetch(`${API_BASE_URL}/products`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
				body: JSON.stringify(productData),
			});

			const data = await res.json();
			console.log("API Response:", data);

			if (res.ok) {
				fetchProducts();
				setNewProduct({
					title: "",
					description: "",
					price: 0,
					category_id: 0,
					stock: 0,
					images: [],
					rating: 0,
				});
			} else {
				console.error("Error adding product:", data.message);
			}
		} catch (err) {
			console.error("Error adding product:", err);
		}
	};

	const deleteProduct = async (id: number) => {
		try {
			await fetch(`${API_BASE_URL}/products/${id}`, {
				method: "DELETE",
				headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
			});
			fetchProducts();
		} catch (err) {
			console.error(err);
		}
	};

	const updateProduct = async () => {
		if (!editingProduct) return;
		try {
			await fetch(`${API_BASE_URL}/products/${editingProduct.id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
				body: JSON.stringify({
					...editingProduct,
					images: JSON.stringify(editingProduct.images), // Convert array to JSON string
				}),
			});
			setEditingProduct(null);
			fetchProducts();
		} catch (error) {
			console.error("Error updating product:", error);
		}
	};

	if (loading) {
		return <OrderManagementSkeleton />;
	}

	return (
		<div className="flex justify-center items-center min-h-screen bg-[#FCE4EC] p-4 md:p-6">
			<div className="w-full max-w-7xl">
				<div className="bg-white p-4 rounded-xl shadow-md">
					<h2 className="text-2xl font-semibold mb-4">Products</h2>

					{/* Add Product Form */}
					<div className="mb-4 space-y-2">
						<input
							type="text"
							name="title"
							placeholder="Title"
							value={newProduct.title}
							onChange={handleInputChange}
							className="border p-2 w-full"
						/>
						<textarea
							name="description"
							placeholder="Description"
							value={newProduct.description}
							onChange={handleInputChange}
							className="border p-2 w-full"
						></textarea>
						<input
							type="number"
							name="price"
							placeholder="Price"
							value={newProduct.price}
							onChange={handleInputChange}
							className="border p-2 w-full"
						/>
						<select
							name="category_id"
							value={newProduct.category_id}
							onChange={handleInputChange}
							className="border p-2 w-full"
						>
							<option value="">Select Category</option>
							{categories.map((category: any) => (
								<option key={category.id} value={category.id}>
									{[category.category_name, "-", category.id]}
								</option>
							))}
						</select>
						<input
							type="number"
							name="stock"
							placeholder="Stock"
							value={newProduct.stock}
							onChange={handleInputChange}
							className="border p-2 w-full"
						/>
						<input
							type="text"
							name="imageUrl"
							placeholder="Enter Image URL"
							value={imageUrl}
							onChange={(e) => setImageUrl(e.target.value)}
							className="border p-2 w-full"
						/>
						<button
							onClick={handleAddImageUrl}
							className="bg-blue-500 text-white px-4 py-2 rounded w-full"
						>
							Add Image URL
						</button>
						<div className="mt-2">
							{newProduct.images.map((url: any, index: any) => (
								<div key={index} className="flex items-center gap-2">
									<img
										src={url}
										alt={`Image ${index + 1}`}
										className="w-16 h-16 object-cover border"
									/>
									<span className="text-sm">{url}</span>
								</div>
							))}
						</div>

						<input
							type="number"
							name="rating"
							placeholder="Rating (0-5)"
							value={newProduct.rating}
							onChange={handleInputChange}
							min="0"
							max="5"
							step="0.1"
							className="border p-2 w-full"
						/>
						<button
							onClick={addProduct}
							className="bg-pink-500 text-white px-4 py-2 rounded w-full"
						>
							Add Product
						</button>
					</div>

					{/* Products Table */}
					<div className="overflow-x-auto">
						<table className="min-w-full bg-white border border-gray-300">
							<thead>
								<tr className="bg-gray-200">
									<th className="px-4 py-2 border">ID</th>
									<th className="px-4 py-2 border">Title</th>
									<th className="px-4 py-2 border">Price</th>
									<th className="px-4 py-2 border">Category</th>
									<th className="px-4 py-2 border">Stock</th>
									<th className="px-4 py-2 border">Actions</th>
								</tr>
							</thead>
							<tbody>
								{products.map((product: any) => (
									<tr key={product.id} className="text-center">
										<td className="border px-4 py-2">{product.id}</td>
										<td className="border px-4 py-2">
											{editingProduct?.id === product.id ? (
												<input
													type="text"
													value={editingProduct.title}
													onChange={(e) =>
														setEditingProduct({
															...editingProduct,
															title: e.target.value,
														})
													}
													className="border p-1"
												/>
											) : (
												product.title
											)}
										</td>
										<td className="border px-4 py-2">₹{product.price}</td>
										<td className="border px-4 py-2">
											{product.category_name}
										</td>
										<td className="border px-4 py-2">{product.stock}</td>
										<td className="border px-4 py-2">
											{editingProduct?.id === product.id ? (
												<>
													<button
														onClick={updateProduct}
														className="bg-green-500 text-white px-2 py-1 rounded mr-2"
													>
														Save
													</button>
													<button
														onClick={() => setEditingProduct(null)}
														className="bg-gray-500 text-white px-2 py-1 rounded"
													>
														Cancel
													</button>
												</>
											) : (
												<>
													<button
														onClick={() => setEditingProduct(product)}
														className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
													>
														Edit
													</button>
													<button
														onClick={() => deleteProduct(product.id)}
														className="bg-red-500 text-white px-2 py-1 rounded"
													>
														Delete
													</button>
												</>
											)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					{/* Edit Product Modal */}
					{editingProduct && (
						<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
							<div className="bg-white p-6 rounded-lg w-96">
								<h2 className="text-xl font-bold mb-4">Edit Product</h2>
								<input
									type="text"
									placeholder="Title"
									value={editingProduct.title}
									onChange={(e) =>
										setEditingProduct({
											...editingProduct,
											title: e.target.value,
										})
									}
									className="w-full p-2 border rounded mb-2"
								/>
								<input
									type="text"
									placeholder="Description"
									value={editingProduct.description}
									onChange={(e) =>
										setEditingProduct({
											...editingProduct,
											description: e.target.value,
										})
									}
									className="w-full p-2 border rounded mb-2"
								/>
								<input
									type="number"
									placeholder="Price"
									value={editingProduct.price}
									onChange={(e) =>
										setEditingProduct({
											...editingProduct,
											price: parseFloat(e.target.value),
										})
									}
									className="w-full p-2 border rounded mb-2"
								/>

								<div className="flex justify-end gap-2">
									<button
										onClick={() => setEditingProduct(null)}
										className="bg-gray-400 px-4 py-2 rounded text-white"
									>
										Cancel
									</button>
									<button
										onClick={updateProduct}
										className="bg-blue-500 px-4 py-2 rounded text-white"
									>
										Update
									</button>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
