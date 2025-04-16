import { create } from "zustand";
import { UserResponseInterface } from "../interfaces/userInterface";
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from "../services/api/users/userService";

interface UserState {
  users: UserResponseInterface[];
  selectedUser: UserResponseInterface | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchUsers: () => Promise<void>;
  fetchUserById: (id: number) => Promise<void>;
  addUser: (name: string, email: string, password: string) => Promise<void>;
  updateUserData: (id: number, userData: Partial<UserResponseInterface>) => Promise<void>;
  removeUser: (id: number) => Promise<void>;
  clearSelectedUser: () => void;
  clearError: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  selectedUser: null,
  isLoading: false,
  error: null,
  
  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const users = await getAllUsers();
      set({ users, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || "Error fetching users", 
        isLoading: false 
      });
    }
  },
  
  fetchUserById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const user = await getUserById(id);
      set({ selectedUser: user, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || `Error fetching user ${id}`, 
        isLoading: false 
      });
    }
  },
  
  addUser: async (name: string, email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const newUser = await createUser({ name, email, password });
      set(state => ({ 
        users: [...state.users, newUser],
        isLoading: false 
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || "Error creating user", 
        isLoading: false 
      });
    }
  },
  
  updateUserData: async (id: number, userData: Partial<UserResponseInterface>) => {
    set({ isLoading: true, error: null });
    try {
      // We need to send password separately if it exists
      const updateData: any = { ...userData };
      delete updateData.id; // Don't send ID in the update payload
      delete updateData.createdAt; // Don't send createdAt in the update payload
      delete updateData.updatedAt; // Don't send updatedAt in the update payload
      
      const updatedUser = await updateUser(id, updateData);
      
      // Update the user in the users array
      set(state => ({
        users: state.users.map(user => user.id === id ? updatedUser : user),
        selectedUser: state.selectedUser?.id === id ? updatedUser : state.selectedUser,
        isLoading: false
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || `Error updating user ${id}`, 
        isLoading: false 
      });
    }
  },
  
  removeUser: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await deleteUser(id);
      set(state => ({
        users: state.users.filter(user => user.id !== id),
        selectedUser: state.selectedUser?.id === id ? null : state.selectedUser,
        isLoading: false
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || `Error deleting user ${id}`, 
        isLoading: false 
      });
    }
  },
  
  clearSelectedUser: () => set({ selectedUser: null }),
  clearError: () => set({ error: null })
}));