import { axiosClient } from "../../axiosClient";
import { LoginResponseInterface } from "../../../interfaces/userInterface";

interface LoginData {
  email: string;
  password: string;
}

export const login = async (data: LoginData): Promise<LoginResponseInterface> => {
  try {
    // The backend sets the token as an HTTP-only cookie
    // withCredentials is set to true in axiosClient, so cookies will be included
    const response = await axiosClient.post("/auth/login", data);
    
    return response.data.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    // This will clear the cookie on the server side
    await axiosClient.post("/auth/logout");
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};