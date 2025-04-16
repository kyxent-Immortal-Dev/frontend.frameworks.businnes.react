import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import DashboardLayout from '../layout/DashboardLayout';

const PrivateRoutes = () => {
  const { user, isLoading } = useAuthStore();
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }
  
  // If user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // If authenticated, render the DashboardLayout with child routes
  return <DashboardLayout />;
};

export default PrivateRoutes;