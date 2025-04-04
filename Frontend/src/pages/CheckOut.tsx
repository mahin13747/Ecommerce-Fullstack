import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "@/lib/config";

const Checkout = ({ userId }: { userId: number }) => {
	const [cartItems, setCartItems] = useState([]);
	const [totalAmount, setTotalAmount] = useState(0);
	const [paymentMethod, setPaymentMethod] = useState("COD");
	const navigate = useNavigate();
	const { register, handleSubmit } = useForm();

	useEffect(() => {
		const fetchCartItems = async () => {
			try {
				const token = localStorage.getItem("token");
				const response = await axios.get(`${API_BASE_URL}/cart/${userId}`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				setCartItems(response.data);
				const total = response.data.reduce(
					(acc: number, item: any) => acc + item.price * item.quantity,
					0
				);
				setTotalAmount(total);
			} catch (error) {
				console.error("Error fetching cart:", error);
			}
		};
		fetchCartItems();
	}, []);

	const onSubmit = async (data: any) => {
		try {
			const token = localStorage.getItem("token");
			const orderData = {
				user_id: userId,
				products: cartItems.map((item: any) => ({
					product_id: item.product_id,
					quantity: item.quantity,
				})),
				total_amount: totalAmount,
				status: "Pending",
				payment_status: "Unpaid",
				shipping_details: data,
			};

			const response = await axios.post(`${API_BASE_URL}/orders`, orderData, {
				headers: { Authorization: `Bearer ${token}` },
			});
			console.log(response.data);

			if (response.status === 201) {
				navigate("/order-success");
			}
		} catch (error) {
			console.error("Error creating order:", error);
		}
	};

	return (
		<div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
			<h2 className="text-2xl font-bold mb-4">Checkout</h2>

			{/* Shipping Details */}
			<form onSubmit={handleSubmit(onSubmit)}>
				<h3 className="text-lg font-semibold mb-2">Shipping Details</h3>
				<input
					{...register("address")}
					placeholder="Address"
					className="border p-2 w-full mb-2"
				/>
				<input
					{...register("city")}
					placeholder="City"
					className="border p-2 w-full mb-2"
				/>
				<input
					{...register("postalCode")}
					placeholder="Postal Code"
					className="border p-2 w-full mb-2"
				/>
				<input
					{...register("country")}
					placeholder="Country"
					className="border p-2 w-full mb-4"
				/>

				{/* Payment Method */}
				<h3 className="text-lg font-semibold mb-2">Payment Method</h3>
				<select
					className="border p-2 w-full mb-4"
					value={paymentMethod}
					onChange={(e) => setPaymentMethod(e.target.value)}
				>
					<option value="COD">Cash on Delivery</option>
					<option value="Razorpay">Razorpay</option>
					<option value="Stripe">Stripe</option>
				</select>

				{/* Order Summary */}
				<h3 className="text-lg font-semibold mb-2">Order Summary</h3>
				<div className="p-4 border rounded-md mb-4">
					<p>Total: ₹{totalAmount.toFixed(2)}</p>
					<p>Shipping: ₹50</p>
					<p className="font-bold">
						Grand Total: ₹{(totalAmount + 50).toFixed(2)}
					</p>
				</div>

				{/* Place Order Button */}
				<button
					type="submit"
					className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
					onClick={() => navigate("/order-success")}
				>
					Place Order
				</button>
			</form>
		</div>
	);
};

export default Checkout;
