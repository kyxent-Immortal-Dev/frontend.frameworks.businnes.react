import { create } from "zustand";
import { UserResponseInterface } from "../interfaces/userInterface";
import { axiosClient } from "../services/axiosClient";
import { AxiosError } from "axios";

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
      
      set({ 
        user: response.data.data.user,
        isLoading: false 
      });
      
    } catch (error) {
      let errorMessage = "Error during login";
      
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      
      set({ 
        error: errorMessage, 
        isLoading: false 
      });
    }
  },
  
  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      
        const createResponse = await axiosClient.post("/users", { name, email, password });
      if(!createResponse) return
      
      const loginResponse = await axiosClient.post("/auth/login", { email, password });
      
      set({ 
        user: loginResponse.data.data.user,
        isLoading: false 
      });
    } catch (error) {
      let errorMessage = "Error during registration";
      
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      
      set({ 
        error: errorMessage, 
        isLoading: false 
      });
    }
  },
  
  logout: async () => {
    set({ isLoading: true });
    try {
      
      await axiosClient.post("/auth/logout");
      
      set({ user: null, isLoading: false });
    } catch (error) {
      console.error("Error during logout:", error);
    
      set({ user: null, isLoading: false });
    }
  },
  
  fetchUser: async () => {
    set({ isLoading: true });
    
    try {
    
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