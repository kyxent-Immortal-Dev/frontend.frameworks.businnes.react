import { create } from "zustand";
import Cookies from "js-cookie"
import { UserInterface } from "../interfaces/userInterface";


interface AuthState {
    user : UserInterface | null;
    isLoading : boolean;
    setUser: (user:UserInterface) => void;
    logout: () => void;
    fetchUser : () => Promise<void>;
}



export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isLoading: true,
    setUser: (user) => set({ user }),
    logout: () => {
      Cookies.remove('token'); 
      set({ user: null });
    },
    fetchUser: async () => {
      const token = Cookies.get('token');
      if (!token) {
        set({ user: null, isLoading: false });
        return;
      }
  
      try {
        const res = await fetch('/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!res.ok) throw new Error('No autorizado');
        const data: UserInterface = await res.json();
        set({ user: data, isLoading: false });
      } catch (error) {
        console.error('Error al obtener el usuario:', error);
        set({ user: null, isLoading: false });
      }
    },
  }));