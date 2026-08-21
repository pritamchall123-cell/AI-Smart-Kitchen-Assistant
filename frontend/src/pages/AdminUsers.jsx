// src/pages/AdminUsers.jsx
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getAllUsers, updateUserRole, deleteUser } from "../services/adminService";

function AdminUsers() {
  const { user: currentUser } = useSelector((state) => state.auth);

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers({ search });
      setUsers(data.users);
    } catch {
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchUsers();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleRoleToggle = async (targetUser) => {
    const newRole = targetUser.role === "admin" ? "user" : "admin";

    try {
      await updateUserRole(targetUser._id, newRole);
      setUsers(users.map((u) => (u._id === targetUser._id ? { ...u, role: newRole } : u)));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update role.");
    }
  };

  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId);
      setUsers(users.filter((u) => u._id !== userId));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Users</h1>

      {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</div>}

      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded-md font-medium hover:bg-green-700 transition"
        >
          Search
        </button>
      </form>

      {loading ? (
        <p className="text-gray-600">Loading users...</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t border-gray-100">
                  <td className="px-4 py-3 text-gray-800">
                    {u.name} {u._id === currentUser._id && <span className="text-xs text-gray-400">(you)</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{u.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        u.role === "admin" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <button
                      onClick={() => handleRoleToggle(u)}
                      disabled={u._id === currentUser._id}
                      className="text-blue-600 hover:underline text-sm disabled:text-gray-300 disabled:no-underline disabled:cursor-not-allowed"
                    >
                      {u.role === "admin" ? "Demote" : "Promote"}
                    </button>
                    <button
                      onClick={() => handleDelete(u._id)}
                      disabled={u._id === currentUser._id}
                      className="text-red-600 hover:underline text-sm disabled:text-gray-300 disabled:no-underline disabled:cursor-not-allowed"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;