import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Mail, Lock, User, UserPlus } from 'lucide-react';
import Swal from 'sweetalert2';
import { AxiosError } from 'axios';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterComponent = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register: registerUser, clearError } = useAuthStore();
  const navigate = useNavigate();

  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors } 
  } = useForm<RegisterFormData>();


  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    
    try {
      await registerUser(data.name, data.email, data.password);
      navigate('/dashboard');
    } catch (error) {
      if (error instanceof AxiosError) {
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: error.response?.data?.message || 'Error during registration',
          confirmButtonColor: '#3085d6',
        });
      } else {
        // Handle non-Axios errors
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: 'An unexpected error occurred',
          confirmButtonColor: '#3085d6',
        });
      }
      clearError();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Full Name</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
            <User size={18} />
          </div>
          <input
            type="text"
            placeholder="John Doe"
            className={`input input-bordered w-full pl-10 ${errors.name ? 'input-error' : ''}`}
            {...register("name", { 
              required: "Name is required",
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters"
              }
            })}
          />
        </div>
        {errors.name && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.name.message}</span>
          </label>
        )}
      </div>
      
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Email</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
            <Mail size={18} />
          </div>
          <input
            type="email"
            placeholder="your@email.com"
            className={`input input-bordered w-full pl-10 ${errors.email ? 'input-error' : ''}`}
            {...register("email", { 
              required: "Email is required", 
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
              }
            })}
          />
        </div>
        {errors.email && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.email.message}</span>
          </label>
        )}
      </div>
      
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Password</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
            <Lock size={18} />
          </div>
          <input
            type="password"
            placeholder="••••••••"
            className={`input input-bordered w-full pl-10 ${errors.password ? 'input-error' : ''}`}
            {...register("password", { 
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters"
              }
            })}
          />
        </div>
        {errors.password && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.password.message}</span>
          </label>
        )}
      </div>
      
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Confirm Password</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
            <Lock size={18} />
          </div>
          <input
            type="password"
            placeholder="••••••••"
            className={`input input-bordered w-full pl-10 ${errors.confirmPassword ? 'input-error' : ''}`}
            {...register("confirmPassword", { 
              required: "Please confirm your password",
              validate: value => value === password || "Passwords do not match"
            })}
          />
        </div>
        {errors.confirmPassword && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.confirmPassword.message}</span>
          </label>
        )}
      </div>
      
      <div className="form-control mt-6">
        <button 
          type="submit" 
          className={`btn btn-primary w-full ${isSubmitting ? 'loading' : ''}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            'Creating Account...'
          ) : (
            <span className="flex items-center justify-center gap-2">
              <UserPlus size={18} /> Register
            </span>
          )}
        </button>
      </div>
    </form>
  );
};

export default RegisterComponent;