import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import LoginComponent from '../components/LoginComponent';

const LoginPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
  return (
    <div className="min-h-screen bg-base-200 flex items-center">
      <div className="card max-w-md mx-auto w-full bg-base-100 shadow-xl">
        <div className="card-body">
          <h3 className="text-xl font-semibold text-center mb-6">Login</h3>
          
          <LoginComponent />
          
          <div className="divider">OR</div>
          
          <div className="text-center">
            <p>Don't have an account?</p>
            <Link to="/register" className="link link-primary">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;