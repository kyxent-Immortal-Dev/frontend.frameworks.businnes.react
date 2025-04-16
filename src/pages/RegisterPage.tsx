import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import RegisterComponent from '../components/RegisterComponent';

const RegisterPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
  return (
    <div className="min-h-screen bg-base-200 flex items-center">
      <div className="card max-w-md mx-auto w-full bg-base-100 shadow-xl">
        <div className="card-body">

          <h3 className="text-xl font-semibold text-center mb-6">Create Account</h3>
          
          <RegisterComponent />
          
          <div className="divider">OR</div>
          
          <div className="text-center">
            <p>Already have an account?</p>
            <Link to="/login" className="link link-primary">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;