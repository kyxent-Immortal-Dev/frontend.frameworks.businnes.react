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
  logout: () => void;
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
      
      // The token is set by the API in the cookies, so we don't need to manually set it
      // We just need to update the user state
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
      const response = await axiosClient.post("/users", { name, email, password });
      
      // After registration, automatically log in
      await axiosClient.post("/auth/login", { email, password });
      
      // Set the user
      set({ 
        user: response.data.data,
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
      await axiosClient.post("/auth/logout");
      
      // The cookie is cleared by the API, so we just update our state
      set({ user: null, isLoading: false });
    } catch (error) {
      console.error("Error during logout:", error);
      // Even if there's an error, we'll still clear the user from the state
      set({ user: null, isLoading: false });
    }
  },
  
  fetchUser: async () => {
    set({ isLoading: true });
    
    try {
      // Attempt to get the current user with the existing cookie
      const response = await axiosClient.get("/users/me");
      
      if (response.data && response.data.data) {
        set({ user: response.data.data, isLoading: false });
      } else {
        set({ user: null, isLoading: false });
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      set({ user: null, isLoading: false });
    }
  }
}));