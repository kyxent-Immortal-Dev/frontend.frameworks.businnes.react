import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Swal from 'sweetalert2';

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

  // Watch the password field to use in validation
  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    
    try {
      await registerUser(data.name, data.email, data.password);
      // If successful, the user will be registered and logged in
      // The PrivateRoutes component will handle the redirect
      navigate('/dashboard');
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: error.response?.data?.message || 'Error during registration',
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
          <span className="label-text">Full Name</span>
        </label>
        <input
          type="text"
          placeholder="John Doe"
          className={`input input-bordered ${errors.name ? 'input-error' : ''}`}
          {...register("name", { 
            required: "Name is required",
            minLength: {
              value: 2,
              message: "Name must be at least 2 characters"
            }
          })}
        />
        {errors.name && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.name.message}</span>
          </label>
        )}
      </div>
      
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
      
      <div className="form-control">
        <label className="label">
          <span className="label-text">Confirm Password</span>
        </label>
        <input
          type="password"
          placeholder="••••••••"
          className={`input input-bordered ${errors.confirmPassword ? 'input-error' : ''}`}
          {...register("confirmPassword", { 
            required: "Please confirm your password",
            validate: value => value === password || "Passwords do not match"
          })}
        />
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
          {isSubmitting ? 'Creating Account...' : 'Register'}
        </button>
      </div>
    </form>
  );
};

export default RegisterComponent;