import { useEffect, useState } from "react";

function Users() {
	const [users, setUsers] = useState([]);

	useEffect(() => {
		fetch("/api/users", {
			headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
		})
			.then((res) => res.json())
			.then((data) => setUsers(data))
			.catch((err) => console.error(err));
	}, []);

	return (
		<div className="bg-white p-4 rounded-xl shadow-md">
			<h2 className="text-2xl font-semibold mb-4">Users</h2>
			<div className="overflow-x-auto">
				<table className="min-w-full bg-white border border-gray-300">
					<thead>
						<tr className="bg-gray-200">
							<th className="px-4 py-2 border">ID</th>
							<th className="px-4 py-2 border">Name</th>
							<th className="px-4 py-2 border">Email</th>
							<th className="px-4 py-2 border">Role</th>
							<th className="px-4 py-2 border">Phone</th>
							<th className="px-4 py-2 border">Created At</th>
						</tr>
					</thead>
					<tbody>
						{users.map((user: any) => (
							<tr key={user.id} className="text-center">
								<td className="border px-4 py-2">{user.id}</td>
								<td className="border px-4 py-2">{user.name}</td>
								<td className="border px-4 py-2">{user.email}</td>
								<td className="border px-4 py-2">{user.role}</td>
								<td className="border px-4 py-2">
									{user.phone_number || "N/A"}
								</td>
								<td className="border px-4 py-2">
									{new Date(user.created_at).toLocaleDateString()}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default Users;
