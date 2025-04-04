import React from "react";

const OrderDetailsModal: React.FC<any> = ({ order, onClose }) => {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
			<div className="bg-white w-full max-w-md rounded-lg shadow-lg p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
				<h3 className="text-lg sm:text-xl font-semibold mb-4">Order Details</h3>
				<div className="space-y-2">
					<p className="flex justify-between">
						<span className="font-medium">Customer Name:</span>
						<span>{order.customer_name}</span>
					</p>
					<p className="flex justify-between">
						<span className="font-medium">Customer Email:</span>
						<span>{order.customer_email}</span>
					</p>
					<p className="flex justify-between">
						<span className="font-medium">Total Amount:</span>
						<span>₹{order.total_amount.toFixed(2)}</span>
					</p>
					<p className="flex justify-between">
						<span className="font-medium">Status:</span>
						<span>{order.status}</span>
					</p>
					<p className="flex justify-between">
						<span className="font-medium">Order Date:</span>
						<span>{new Date(order.created_at).toLocaleDateString()}</span>
					</p>
				</div>
				<h4 className="mt-4 font-semibold text-lg">Items:</h4>
				<ul className="space-y-2 max-h-[40vh] overflow-y-auto">
					{order.items.map((item: any) => (
						<li
							key={item.id}
							className="flex justify-between bg-gray-100 p-2 rounded"
						>
							<span>{item.product_name}</span>
							<span>
								Qty: {item.quantity} - ₹{item.price.toFixed(2)}
							</span>
						</li>
					))}
				</ul>
				<button
					onClick={onClose}
					className="mt-4 w-full bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
				>
					Close
				</button>
			</div>
		</div>
	);
};

export default OrderDetailsModal;
