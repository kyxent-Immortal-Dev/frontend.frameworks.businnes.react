import { axiosClient } from "../../axiosClient";
import { UserInterface, UserResponseInterface } from "../../../interfaces/userInterface";

// Get all users
export const getAllUsers = async (): Promise<UserResponseInterface[]> => {
  try {
    const response = await axiosClient.get("/users");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// Get user by ID
export const getUserById = async (id: number): Promise<UserResponseInterface> => {
  try {
    const response = await axiosClient.get(`/users/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error);
    throw error;
  }
};

// Create a new user
export const createUser = async (userData: Partial<UserInterface>): Promise<UserResponseInterface> => {
  try {
    const response = await axiosClient.post("/users", userData);
    return response.data.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

// Update a user
export const updateUser = async (id: number, userData: Partial<UserInterface>): Promise<UserResponseInterface> => {
  try {
    const response = await axiosClient.put(`/users/${id}`, userData);
    return response.data.data;
  } catch (error) {
    console.error(`Error updating user ${id}:`, error);
    throw error;
  }
};

// Delete a user
export const deleteUser = async (id: number): Promise<UserResponseInterface> => {
  try {
    const response = await axiosClient.delete(`/users/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error deleting user ${id}:`, error);
    throw error;
  }
};