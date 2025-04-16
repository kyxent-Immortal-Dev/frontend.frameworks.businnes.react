import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useUserStore } from "../store/userStore";
import { UserResponseInterface } from "../interfaces/userInterface";
import {
  Search,
  Plus,
  Edit,
  Check,
  Trash2,
} from "lucide-react";
import AddUserModal from "../modals/AddUserModal";
import EditUserModal from "../modals/EditUserModal";

const ViewUsersPage = () => {
  const { users, isLoading, error, fetchUsers, removeUser, clearError } = useUserStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserResponseInterface | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error,
        confirmButtonColor: "#3085d6",
      });
      clearError();
    }
  }, [error, clearError]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || statusFilter === "active";
    const userRole = user.id === 1 ? "Admin" : "User";
    const matchesRole = roleFilter === "all" || roleFilter === userRole;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleAddUser = () => {
    setIsAddModalOpen(true);
  };

  const handleEditUser = (user: UserResponseInterface) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const toggleUserStatus = (userId: number) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    const userStatus = "active"; 
    const newStatus = userStatus === "active" ? "inactive" : "active";
    const actionText = newStatus === "active" ? "activate" : "deactivate";

    Swal.fire({
      title: `${actionText.charAt(0).toUpperCase() + actionText.slice(1)} User`,
      text: `Are you sure you want to ${actionText} ${user.name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${actionText}!`,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          "Success!",
          `User has been ${newStatus === "active" ? "activated" : "deactivated"}.`,
          "success"
        );
        fetchUsers();
      }
    });
  };


  const handleDeleteUser = (userId: number) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    Swal.fire({
      title: "Delete User",
      text: `Are you sure you want to delete ${user.name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await removeUser(userId);
          Swal.fire("Deleted!", "User has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting user:", error);
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Manage Users</h1>
        <p className="text-gray-500">View and manage system users</p>
      </div>


      <div className="flex flex-col lg:flex-row gap-4">
        <div className="form-control flex-1">
          <div className="input-group">
            <input
              type="text"
              placeholder="Search by name or email..."
              className="input input-bordered w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-square">
              <Search size={18} />
            </button>
          </div>
        </div>

        <select
          className="select select-bordered"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">All Roles</option>
          <option value="Admin">Admin</option>
          <option value="User">User</option>
        </select>

        <select
          className="select select-bordered"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <button className="btn btn-primary" onClick={handleAddUser}>
          <Plus size={18} className="mr-2" /> Add User
        </button>
      </div>


      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="loading loading-spinner loading-lg text-primary"></div>
        </div>
      )}


      {!isLoading && (
        <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover">
                  <td className="font-medium">{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <div className="badge badge-ghost">
                      {user.id === 1 ? "Admin" : "User"}
                    </div>
                  </td>
                  <td>
                    <div className="badge badge-success">Active</div>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        className="btn btn-square btn-sm btn-ghost text-info"
                        title="Edit User"
                        onClick={() => handleEditUser(user)}
                      >
                        <Edit size={18} />
                      </button>

                      <button
                        className="btn btn-square btn-sm btn-ghost text-success"
                        onClick={() => toggleUserStatus(user.id)}
                        title="Toggle Status"
                      >
                        <Check size={18} />
                      </button>

                      <button
                        className="btn btn-square btn-sm btn-ghost text-error"
                        onClick={() => handleDeleteUser(user.id)}
                        title="Delete User"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}


      {!isLoading && filteredUsers.length === 0 && (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold">No users found</h3>
          <p className="text-gray-500">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}


      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchUsers}
      />
      {editingUser && (
        <EditUserModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={fetchUsers}
          user={editingUser}
        />
      )}
    </div>
  );
};

export default ViewUsersPage;