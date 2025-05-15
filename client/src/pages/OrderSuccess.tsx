import { Link } from "react-router-dom";

const OrderSuccess = () => {
	return (
		<div className="flex flex-col items-center justify-center h-screen m-4">
			<h2 className="text-3xl font-bold mb-4 justify-center ml-6">
				Order Placed Successfully! 🎉
			</h2>
			<p className="mb-4 justify-center">
				Thank you for your purchase. You will receive a confirmation email soon.
			</p>
			<Link to="/" className="bg-blue-600 text-white px-6 py-2 rounded-md">
				Go to Home
			</Link>
		</div>
	);
};

export default OrderSuccess;
