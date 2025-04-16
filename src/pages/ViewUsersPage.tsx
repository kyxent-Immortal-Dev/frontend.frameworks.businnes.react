import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useUserStore } from '../store/userStore';
import { UserResponseInterface } from '../interfaces/userInterface';

const ViewUsersPage = () => {
  const { users, isLoading, error, fetchUsers, removeUser, addUser, updateUserData, clearError } = useUserStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // User form state for add/edit modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserResponseInterface | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'User',
    status: 'active'
  });
  
  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Show error message if any
  useEffect(() => {
    if (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error,
        confirmButtonColor: '#3085d6',
      });
      clearError();
    }
  }, [error, clearError]);

  // Filter users based on search term, role, and status
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // For now, all users will be considered "active" as we don't have status in the backend model
    const matchesStatus = statusFilter === 'all' || statusFilter === 'active';
    
    // For now, we'll use a simple role assignment since backend doesn't have roles
    // In a real app, you would have roles in your user model
    const userRole = user.id === 1 ? 'Admin' : 'User';
    const matchesRole = roleFilter === 'all' || roleFilter === userRole;
    
    return matchesSearch && matchesRole && matchesStatus;
  });
  
  // Open modal for adding a new user
  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'User',
      status: 'active'
    });
    setIsModalOpen(true);
  };
  
  // Open modal for editing a user
  const handleEditUser = (user: UserResponseInterface) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '', // Don't set password when editing
      role: user.id === 1 ? 'Admin' : 'User', // Simple role logic
      status: 'active'
    });
    setIsModalOpen(true);
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || (!editingUser && !formData.password)) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: `Please fill all ${editingUser ? 'fields' : 'fields including password for new users'}`,
        confirmButtonColor: '#3085d6',
      });
      return;
    }
    
    try {
      if (editingUser) {
        // Update existing user
        await updateUserData(editingUser.id, {
          name: formData.name,
          email: formData.email,
          ...(formData.password ? { password: formData.password } : {})
        });
        
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'User has been updated successfully',
          confirmButtonColor: '#3085d6',
        });
      } else {
        // Add new user
        await addUser(formData.name, formData.email, formData.password);
        
        Swal.fire({
          icon: 'success',
          title: 'Added!',
          text: 'User has been added successfully',
          confirmButtonColor: '#3085d6',
        });
      }
      
      // Close modal and refresh user list
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };
  
  // Handle user activation/deactivation (simulated for now)
  const toggleUserStatus = (userId: number) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    const userStatus = 'active'; // In a real app, this would come from the user object
    const newStatus = userStatus === 'active' ? 'inactive' : 'active';
    const actionText = newStatus === 'active' ? 'activate' : 'deactivate';
    
    Swal.fire({
      title: `${actionText.charAt(0).toUpperCase() + actionText.slice(1)} User`,
      text: `Are you sure you want to ${actionText} ${user.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Yes, ${actionText}!`
    }).then((result) => {
      if (result.isConfirmed) {
        // In a real app with status field, we would update the user status here
        // await updateUserData(userId, { status: newStatus });
        
        Swal.fire(
          'Success!',
          `User has been ${newStatus === 'active' ? 'activated' : 'deactivated'}.`,
          'success'
        );
        
        fetchUsers();
      }
    });
  };
  
  // Handle user deletion
  const handleDeleteUser = (userId: number) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    Swal.fire({
      title: 'Delete User',
      text: `Are you sure you want to delete ${user.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await removeUser(userId);
          
          Swal.fire(
            'Deleted!',
            'User has been deleted.',
            'success'
          );
        } catch (error) {
          console.error('Error deleting user:', error);
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
      
      {/* Search and Filters */}
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
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
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
        
        <button 
          className="btn btn-primary"
          onClick={handleAddUser}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add User
        </button>
      </div>
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="loading loading-spinner loading-lg text-primary"></div>
        </div>
      )}
      
      {/* Users Table */}
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
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover">
                  <td className="font-medium">{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <div className="badge badge-ghost">{user.id === 1 ? 'Admin' : 'User'}</div>
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
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      
                      <button 
                        className={`btn btn-square btn-sm btn-ghost text-success`}
                        onClick={() => toggleUserStatus(user.id)}
                        title="Toggle Status"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </button>
                      
                      <button 
                        className="btn btn-square btn-sm btn-ghost text-error"
                        onClick={() => handleDeleteUser(user.id)}
                        title="Delete User"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Message when no users match filters */}
      {!isLoading && filteredUsers.length === 0 && (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold">No users found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
      
      {/* Modal for Add/Edit User */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="modal-box relative">
            <button 
              className="btn btn-sm btn-circle absolute right-2 top-2"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>
            <h3 className="font-bold text-lg mb-4">
              {editingUser ? 'Edit User' : 'Add New User'}
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div className="form-control mb-3">
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input input-bordered" 
                  placeholder="Full name"
                  required
                />
              </div>
              
              <div className="form-control mb-3">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input input-bordered" 
                  placeholder="user@example.com"
                  required
                />
              </div>
              
              <div className="form-control mb-3">
                <label className="label">
                  <span className="label-text">
                    Password {editingUser && '(Leave blank to keep unchanged)'}
                  </span>
                </label>
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="input input-bordered" 
                  placeholder="••••••••"
                  required={!editingUser}
                />
              </div>
              
              <div className="form-control mb-6">
                <label className="label">
                  <span className="label-text">Role</span>
                </label>
                <select 
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="select select-bordered"
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              
              <div className="modal-action">
                <button 
                  type="button" 
                  className="btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingUser ? 'Update User' : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewUsersPage;