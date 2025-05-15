import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/lib/config";
import axios from "axios";
import { OrderManagementSkeleton } from "./OrderManagement";

interface User {
	id: number;
	name: string;
	email: string;
	role: "admin" | "user";
	address: string;
	phone_number: string;
	created_at: string;
	updated_at: string;
}

export default function UserManagement() {
	const [users, setUsers] = useState<User[]>([]);
	const [newUser, setNewUser] = useState<Partial<User> & { password: string }>({
		name: "",
		email: "",
		password: "",
		role: "user",
		address: "",
		phone_number: "",
	});
	const [editingUser, setEditingUser] = useState<
		Partial<User> & { password?: string }
	>({});
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalMode, setModalMode] = useState<"create" | "edit">("create");
	const [searchTerm, setSearchTerm] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		fetchUsers();
	}, []);
	console.log(users);

	const fetchUsers = async () => {
		setLoading(true);
		setError("");
		try {
			const response = await axios.get(`${API_BASE_URL}/users`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			});
			setUsers(response.data);
		} catch (error: any) {
			console.error("Error fetching users:", error);
			setError("Failed to load users. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const registerUser = async () => {
		if (
			!newUser.name ||
			!newUser.email ||
			!newUser.password ||
			!newUser.address ||
			!newUser.phone_number ||
			!newUser.role
		) {
			setError(
				"Name, email, password, address,role and phone number are required."
			);
			return;
		}

		setLoading(true);
		setError("");
		try {
			await axios.post(`${API_BASE_URL}/register`, newUser, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			});

			fetchUsers();
			resetForm();
			setIsModalOpen(false);
		} catch (error: any) {
			console.error("Error creating user:", error);
			if (error.response?.status === 409) {
				setError("User with this email already exists.");
			} else {
				setError("Failed to create user. Please try again.");
			}
		} finally {
			setLoading(false);
		}
	};

	const updateUser = async () => {
		if (
			!editingUser.id ||
			!editingUser.name ||
			!editingUser.email ||
			!editingUser.address ||
			!editingUser.phone_number
		) {
			setError("Name, email, address, and phone number are required.");
			return;
		}

		setLoading(true);
		setError("");
		try {
			await axios.put(
				`${API_BASE_URL}/user/${editingUser.id}`,
				{
					name: editingUser.name,
					email: editingUser.email,
					role: editingUser.role,
					address: editingUser.address,
					phone_number: editingUser.phone_number,
					...(editingUser.password ? { password: editingUser.password } : {}),
				},
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				}
			);

			fetchUsers();
			resetForm();
			setIsModalOpen(false);
		} catch (error: any) {
			console.error("Error updating user:", error);
			setError("Failed to update user. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const deleteUser = async (userId: number) => {
		if (
			!confirm(
				"Are you sure you want to delete this user? This action cannot be undone."
			)
		) {
			return;
		}

		setLoading(true);
		try {
			await axios.delete(`${API_BASE_URL}/user/${userId}`, {
				headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
			});

			setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
		} catch (error: any) {
			console.error("Error deleting user:", error);
			alert("Failed to delete user. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const resetForm = () => {
		setNewUser({
			name: "",
			email: "",
			password: "",
			role: "user",
			address: "",
			phone_number: "",
		});
		setEditingUser({});
		setError("");
	};

	const openModal = (mode: "create" | "edit", user?: User) => {
		setModalMode(mode);
		if (mode === "edit" && user) {
			setEditingUser({
				id: user.id,
				name: user.name,
				email: user.email,
				role: user.role,
				address: user.address,
				phone_number: user.phone_number,
			});
		} else {
			resetForm();
		}
		setIsModalOpen(true);
	};

	const viewUserDetails = async (userId: number) => {
		try {
			const response = await axios.get(`${API_BASE_URL}/user/${userId}`, {
				headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
			});

			setEditingUser(response.data);
			setModalMode("edit");
			setIsModalOpen(true);
		} catch (error) {
			console.error("Error fetching user details:", error);
			alert("Failed to load user details.");
		}
	};

	const formatDate = (dateString: string) => {
		if (!dateString) return "N/A";
		try {
			return new Date(dateString).toLocaleDateString();
		} catch (error) {
			console.error("Error formatting date:", error);
			return "Invalid date";
		}
	};

	const filteredUsers = users.filter(
		(user) =>
			user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.phone_number.includes(searchTerm)
	);

	if (loading) {
		return <OrderManagementSkeleton />;
	}

	return (
		<div className="container mx-auto px-4 py-6">
			<h2 className="text-xl md:text-2xl font-semibold mb-4 text-center md:text-left">
				User Management
			</h2>

			<div className="bg-white rounded-xl shadow-md p-4 mb-6">
				<div className="flex flex-col md:flex-row gap-4 items-center justify-between">
					<div className="w-full md:w-1/2">
						<input
							type="text"
							placeholder="Search users by name, email, or phone..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
					<button
						onClick={() => openModal("create")}
						className="w-full md:w-auto bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
					>
						Add New User
					</button>
				</div>
			</div>

			{loading && (
				<div className="flex justify-center my-8">
					<div className="text-center">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
						<p className="mt-2 text-gray-600">Loading...</p>
					</div>
				</div>
			)}

			{error && !isModalOpen && (
				<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
					<span className="block sm:inline">{error}</span>
				</div>
			)}

			{!loading && users.length > 0 && (
				<div className="bg-white rounded-xl shadow-md overflow-x-auto">
					<table className="w-full min-w-[800px]">
						<thead>
							<tr className="bg-gray-200">
								<th className="p-2 sm:p-3 border">ID</th>
								<th className="p-2 sm:p-3 border">Name</th>
								<th className="p-2 sm:p-3 border">Email</th>
								<th className="p-2 sm:p-3 border">Role</th>
								<th className="p-2 sm:p-3 border">Phone</th>
								<th className="p-2 sm:p-3 border">Address</th>
								<th className="p-2 sm:p-3 border">Created At</th>
								<th className="p-2 sm:p-3 border">Actions</th>
							</tr>
						</thead>
						<tbody>
							{filteredUsers.map((user) => (
								<tr key={user.id} className="text-center hover:bg-gray-50">
									<td className="p-2 sm:p-3 border">{user.id}</td>
									<td className="p-2 sm:p-3 border truncate max-w-[150px]">
										{user.name}
									</td>
									<td className="p-2 sm:p-3 border truncate max-w-[150px]">
										{user.email}
									</td>
									<td className="p-2 sm:p-3 border">
										<span
											className={`px-2 py-1 rounded-full text-xs ${
												user.role === "admin"
													? "bg-purple-100 text-purple-800"
													: "bg-blue-100 text-blue-800"
											}`}
										>
											{user.role}
										</span>
									</td>
									<td className="p-2 sm:p-3 border">{user.phone_number}</td>
									<td className="p-2 sm:p-3 border truncate max-w-[150px]">
										{user.address}
									</td>
									<td className="p-2 sm:p-3 border">
										{formatDate(user.created_at)}
									</td>
									<td className="p-2 sm:p-3 border">
										<div className="flex flex-col sm:flex-row gap-2 justify-center">
											<button
												onClick={() => viewUserDetails(user.id)}
												className="bg-green-500 text-white px-2 py-1 rounded text-xs sm:text-sm"
											>
												View
											</button>
											<button
												onClick={() => openModal("edit", user)}
												className="bg-yellow-500 text-white px-2 py-1 rounded text-xs sm:text-sm"
											>
												Edit
											</button>
											<button
												onClick={() => deleteUser(user.id)}
												className="bg-red-500 text-white px-2 py-1 rounded text-xs sm:text-sm"
											>
												Delete
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}

			{!loading && users.length === 0 && (
				<div className="bg-white rounded-xl shadow-md p-8 text-center">
					<p className="text-gray-500">
						No users found. Create your first user using the button above.
					</p>
				</div>
			)}

			{isModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
					<div className="bg-white w-full max-w-md rounded-lg shadow-lg p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
						<h3 className="text-lg sm:text-xl font-semibold mb-4">
							{modalMode === "create" ? "Register New User" : "Edit User"}
						</h3>

						{error && (
							<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
								<span className="block sm:inline">{error}</span>
							</div>
						)}

						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium mb-1">
									Name <span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									placeholder="Full Name"
									value={
										modalMode === "create"
											? newUser.name
											: editingUser?.name || ""
									}
									onChange={(e) =>
										modalMode === "create"
											? setNewUser({ ...newUser, name: e.target.value })
											: setEditingUser({ ...editingUser, name: e.target.value })
									}
									className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium mb-1">
									Email <span className="text-red-500">*</span>
								</label>
								<input
									type="email"
									placeholder="Email Address"
									value={
										modalMode === "create"
											? newUser.email
											: editingUser?.email || ""
									}
									onChange={(e) =>
										modalMode === "create"
											? setNewUser({ ...newUser, email: e.target.value })
											: setEditingUser({
													...editingUser,
													email: e.target.value,
											  })
									}
									className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium mb-1">
									Password{" "}
									{modalMode === "create" && (
										<span className="text-red-500">*</span>
									)}
									{modalMode === "edit" && (
										<span className="text-gray-500 text-xs">
											(Leave blank to keep current password)
										</span>
									)}
								</label>
								<input
									type="password"
									placeholder={
										modalMode === "create"
											? "Password"
											: "New Password (optional)"
									}
									value={
										modalMode === "create"
											? newUser.password
											: editingUser?.password || ""
									}
									onChange={(e) =>
										modalMode === "create"
											? setNewUser({ ...newUser, password: e.target.value })
											: setEditingUser({
													...editingUser,
													password: e.target.value,
											  })
									}
									className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium mb-1">Role</label>
								<select
									value={
										modalMode === "create" ? newUser.role : editingUser?.role
									}
									onChange={(e) =>
										modalMode === "create"
											? setNewUser({
													...newUser,
													role: e.target.value as "admin" | "user",
											  })
											: setEditingUser({
													...editingUser,
													role: e.target.value as "admin" | "user",
											  })
									}
									className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								>
									<option value="user">User</option>
									<option value="admin">Admin</option>
								</select>
							</div>

							<div>
								<label className="block text-sm font-medium mb-1">
									Phone Number <span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									placeholder="Phone Number"
									value={
										modalMode === "create"
											? newUser.phone_number
											: editingUser?.phone_number || ""
									}
									onChange={(e) =>
										modalMode === "create"
											? setNewUser({ ...newUser, phone_number: e.target.value })
											: setEditingUser({
													...editingUser,
													phone_number: e.target.value,
											  })
									}
									className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium mb-1">
									Address <span className="text-red-500">*</span>
								</label>
								<textarea
									placeholder="Full Address"
									value={
										modalMode === "create"
											? newUser.address
											: editingUser?.address || ""
									}
									onChange={(e) =>
										modalMode === "create"
											? setNewUser({ ...newUser, address: e.target.value })
											: setEditingUser({
													...editingUser,
													address: e.target.value,
											  })
									}
									rows={3}
									className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>
						</div>

						<div className="flex gap-3 mt-6">
							<button
								onClick={modalMode === "create" ? registerUser : updateUser}
								disabled={loading}
								className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition disabled:bg-blue-300"
							>
								{loading
									? "Processing..."
									: modalMode === "create"
									? "Register User"
									: "Update User"}
							</button>
							<button
								onClick={() => setIsModalOpen(false)}
								className="flex-1 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
