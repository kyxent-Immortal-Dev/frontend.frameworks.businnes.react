import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import PrivateRoutes from './routes/PrivateRoutes';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import RentCarsPage from './pages/RentCarsPage';
import ViewUsersPage from './pages/ViewUsersPage';
import CreateRentalPage from './pages/CreateRentalPage';

function App() {
  const fetchUser = useAuthStore((state) => state.fetchUser);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {

    fetchUser();
  }, [fetchUser]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        

        <Route element={<PrivateRoutes />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/rent-cars" element={<RentCarsPage />} />
          <Route path="/users" element={<ViewUsersPage />} />
          <Route path="/create-rental" element={<CreateRentalPage />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;