import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import UserDashboard from "../pages/userDashboard";
import AdminDashboard from "../pages/adminDashboard";
import ProductDetails from "../pages/ProductDetails";
import Wishlist from "../pages/Wishlist";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/CheckOut";
import OrderSuccess from "@/pages/OrderSuccess";
import Header from "@/pages/Header";
import ProductManagement from "@/components/ui/ProductManagement";
import OrderManagement from "@/components/ui/OrderManagement";
import UserManagement from "@/components/ui/UserManagement";
import CategoryManagement from "@/components/CategoryManagement";
import MyOrders from "@/pages/MyOrders";

const AppRoutes = ({
	user,
	handleLogout,
}: {
	user: any;
	handleLogout: () => void;
}) => {
	const location = useLocation();

	const hideHeaderRoutes = ["/login", "/signup"];
	const shouldShowHeader =
		user && !hideHeaderRoutes.includes(location.pathname);

	const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) =>
		user?.role === "admin" ? children : <Navigate to="/login" replace />;

	const ProtectedUserRoute = ({ children }: { children: React.ReactNode }) =>
		user ? children : <Navigate to="/login" replace />;

	return (
		<>
			{shouldShowHeader && <Header user={user} handleLogout={handleLogout} />}
			<Routes>
				<Route
					path="/admin-dashboard"
					element={
						<ProtectedAdminRoute>
							<AdminDashboard />
						</ProtectedAdminRoute>
					}
				/>
				<Route
					path="/admin/products"
					element={
						<ProtectedAdminRoute>
							<ProductManagement />
						</ProtectedAdminRoute>
					}
				/>
				<Route
					path="/admin/orders"
					element={
						<ProtectedAdminRoute>
							<OrderManagement />
						</ProtectedAdminRoute>
					}
				/>
				<Route
					path="/admin/users"
					element={
						<ProtectedAdminRoute>
							<UserManagement />
						</ProtectedAdminRoute>
					}
				/>
				<Route
					path="/admin/category"
					element={
						<ProtectedAdminRoute>
							<CategoryManagement />
						</ProtectedAdminRoute>
					}
				/>

				<Route
					path="/dashboard"
					element={
						<ProtectedUserRoute>
							<UserDashboard userId={user?.id || 0} />
						</ProtectedUserRoute>
					}
				/>
				<Route
					path="/wishlist"
					element={
						<ProtectedUserRoute>
							<Wishlist />
						</ProtectedUserRoute>
					}
				/>
				<Route
					path="/cart"
					element={
						<ProtectedUserRoute>
							<Cart userId={user?.id || 0} />
						</ProtectedUserRoute>
					}
				/>
				<Route
					path="/checkout"
					element={
						<ProtectedUserRoute>
							<Checkout userId={user?.id || 0} />
						</ProtectedUserRoute>
					}
				/>
				<Route
					path="/myorders"
					element={
						<ProtectedUserRoute>
							<MyOrders userId={user?.id || 0} />
						</ProtectedUserRoute>
					}
				/>
				<Route path="/order-success" element={<OrderSuccess />} />
				<Route
					path="/products/:id"
					element={
						<ProtectedUserRoute>
							<ProductDetails userId={user?.id || 0} />
						</ProtectedUserRoute>
					}
				/>

				<Route
					path="*"
					element={
						<Navigate
							to={
								user?.role === "admin"
									? "/admin-dashboard"
									: user?.role === "user"
									? "/dashboard"
									: "/login"
							}
						/>
					}
				/>
			</Routes>
		</>
	);
};

export default AppRoutes;
