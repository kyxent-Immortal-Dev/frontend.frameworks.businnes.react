import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import DashboardLayout from '../layout/DashboardLayout';

const PrivateRoutes = () => {
  const { user, isLoading } = useAuthStore();
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  

  return <DashboardLayout />;
};

export default PrivateRoutes;