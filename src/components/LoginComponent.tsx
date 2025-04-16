import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Swal from 'sweetalert2';

interface LoginFormData {
  email: string;
  password: string;
}

const LoginComponent = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, clearError } = useAuthStore();
  const navigate = useNavigate();

  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    
    try {
      await login(data.email, data.password);
      // If successful, the user state will be updated in the auth store
      // and the PrivateRoutes component will handle the redirect
      navigate('/dashboard');
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.response?.data?.message || 'Invalid credentials',
        confirmButtonColor: '#3085d6',
      });
      clearError();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="form-control">
        <label className="label">
          <span className="label-text">Email</span>
        </label>
        <input
          type="email"
          placeholder="your@email.com"
          className={`input input-bordered ${errors.email ? 'input-error' : ''}`}
          {...register("email", { 
            required: "Email is required", 
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address"
            }
          })}
        />
        {errors.email && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.email.message}</span>
          </label>
        )}
      </div>
      
      <div className="form-control">
        <label className="label">
          <span className="label-text">Password</span>
        </label>
        <input
          type="password"
          placeholder="••••••••"
          className={`input input-bordered ${errors.password ? 'input-error' : ''}`}
          {...register("password", { 
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters"
            }
          })}
        />
        {errors.password && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.password.message}</span>
          </label>
        )}
      </div>
      
      <div className="form-control mt-6">
        <button 
          type="submit" 
          className={`btn btn-primary w-full ${isSubmitting ? 'loading' : ''}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </div>
    </form>
  );
};

export default LoginComponent;