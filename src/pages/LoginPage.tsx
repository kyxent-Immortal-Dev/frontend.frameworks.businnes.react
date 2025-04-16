import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Swal from 'sweetalert2';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, user, error, clearError } = useAuthStore();
  const navigate = useNavigate();
  
  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
  // Show error if login failed
  useEffect(() => {
    if (error) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error,
        confirmButtonColor: '#3085d6',
      });
      clearError();
    }
  }, [error, clearError]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please enter both email and password',
        confirmButtonColor: '#3085d6',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await login(email, password);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-base-200 flex items-center">
      <div className="card max-w-md mx-auto w-full bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold text-center mb-6">Vehicle Rental System</h2>
          <h3 className="text-xl font-semibold text-center mb-6">Login</h3>
          
          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                className="input input-bordered"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="input input-bordered"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="form-control mt-6">
              <button 
                type="submit" 
                className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>
          
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