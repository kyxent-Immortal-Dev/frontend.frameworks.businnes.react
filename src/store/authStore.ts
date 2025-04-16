import { create } from "zustand";
import { UserResponseInterface } from "../interfaces/userInterface";
import { axiosClient } from "../services/axiosClient";

interface AuthState {
  user: UserResponseInterface | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: UserResponseInterface) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  error: null,
  
  setUser: (user) => set({ user }),
  
  clearError: () => set({ error: null }),
  
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosClient.post("/auth/login", { email, password });
      
      // The token is set as a cookie by the backend, no need to handle it here
      set({ 
        user: response.data.data.user,
        isLoading: false 
      });
      
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || "Error during login", 
        isLoading: false 
      });
    }
  },
  
  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      // First create the user
      const createResponse = await axiosClient.post("/users", { name, email, password });
      
      // Then login with the new credentials
      const loginResponse = await axiosClient.post("/auth/login", { email, password });
      
      set({ 
        user: loginResponse.data.data.user,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || "Error during registration", 
        isLoading: false 
      });
    }
  },
  
  logout: async () => {
    set({ isLoading: true });
    try {
      // This will clear the cookie on the server side
      await axiosClient.post("/auth/logout");
      
      // Update local state
      set({ user: null, isLoading: false });
    } catch (error) {
      console.error("Error during logout:", error);
      // Even if there's an error, clear the user state
      set({ user: null, isLoading: false });
    }
  },
  
  fetchUser: async () => {
    set({ isLoading: true });
    
    try {
      // This will use the cookie token for authentication
      const response = await axiosClient.get("/users/me");
      
      if (response.data && response.data.data) {
        set({ user: response.data.data, isLoading: false });
      } else {
        set({ user: null, isLoading: false });
      }
    } catch (error) {
      // If there's an error (like 401 unauthorized), the user is not logged in
      console.error("Error fetching user:", error);
      set({ user: null, isLoading: false });
    }
  }
}));