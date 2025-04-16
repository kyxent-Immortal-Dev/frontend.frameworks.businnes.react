import { create } from "zustand";
import { UserResponseInterface } from "../interfaces/userInterface";
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from "../services/api/users/userService";

// Define the type for update data to avoid `any`
interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
}

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

export const useUserStore = create<UserState>((set) => ({
  users: [],
  selectedUser: null,
  isLoading: false,
  error: null,

  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const users = await getAllUsers();
      set({ users, isLoading: false });
    } catch (error: unknown) {
      set({
        error:
          (error as any)?.response?.data?.message || "Error fetching users",
        isLoading: false,
      });
    }
  },

  fetchUserById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const user = await getUserById(id);
      set({ selectedUser: user, isLoading: false });
    } catch (error: unknown) {
      set({
        error:
          (error as any)?.response?.data?.message || `Error fetching user ${id}`,
        isLoading: false,
      });
    }
  },

  addUser: async (name: string, email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const newUser = await createUser({ name, email, password });
      set((state) => ({
        users: [...state.users, newUser],
        isLoading: false,
      }));
    } catch (error: unknown) {
      set({
        error:
          (error as any)?.response?.data?.message || "Error creating user",
        isLoading: false,
      });
    }
  },

  updateUserData: async (id: number, userData: Partial<UserResponseInterface>) => {
    set({ isLoading: true, error: null });
    try {
      // Create update data with specific type
      const updateData: UpdateUserData = { ...userData };
      delete (updateData as any).id; // Remove ID from payload
      delete (updateData as any).createdAt; // Remove createdAt from payload
      delete (updateData as any).updatedAt; // Remove updatedAt from payload

      const updatedUser = await updateUser(id, updateData);

      // Update the user in the users array
      set((state) => ({
        users: state.users.map((user) =>
          user.id === id ? updatedUser : user
        ),
        selectedUser:
          state.selectedUser?.id === id ? updatedUser : state.selectedUser,
        isLoading: false,
      }));
    } catch (error: unknown) {
      set({
        error:
          (error as any)?.response?.data?.message || `Error updating user ${id}`,
        isLoading: false,
      });
    }
  },

  removeUser: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await deleteUser(id);
      set((state) => ({
        users: state.users.filter((user) => user.id !== id),
        selectedUser: state.selectedUser?.id === id ? null : state.selectedUser,
        isLoading: false,
      }));
    } catch (error: unknown) {
      set({
        error:
          (error as any)?.response?.data?.message || `Error deleting user ${id}`,
        isLoading: false,
      });
    }
  },

  clearSelectedUser: () => set({ selectedUser: null }),
  clearError: () => set({ error: null }),
}));