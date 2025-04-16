import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { X, User, Mail, Lock, ShieldCheck } from "lucide-react";
import { useUserStore } from "../store/userStore";

interface AddUserFormData {
  name: string;
  email: string;
  password: string;
  role: string;
}

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddUserModal = ({ isOpen, onClose, onSuccess }: AddUserModalProps) => {
  const { addUser } = useUserStore();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddUserFormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "User",
    },
  });

  const onSubmit = async (data: AddUserFormData) => {
    try {
      await addUser(data.name, data.email, data.password);
      Swal.fire({
        icon: "success",
        title: "Added!",
        text: "User has been added successfully",
        confirmButtonColor: "#3085d6",
      });
      reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="modal-box relative max-w-md w-full">
        <button
          className="btn btn-sm btn-circle absolute right-2 top-2"
          onClick={onClose}
        >
          <X size={18} />
        </button>
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <User size={20} /> Add New User
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name field */}
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
                className={`input input-bordered w-full pl-10 ${errors.name ? "input-error" : ""}`}
                placeholder="John Doe"
                {...register("name", { required: "Name is required" })}
              />
            </div>
            {errors.name && (
              <label className="label">
                <span className="label-text-alt text-error flex items-center gap-1">
                  <X size={14} /> {errors.name.message}
                </span>
              </label>
            )}
          </div>

          {/* Email field */}
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
                className={`input input-bordered w-full pl-10 ${errors.email ? "input-error" : ""}`}
                placeholder="user@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
            </div>
            {errors.email && (
              <label className="label">
                <span className="label-text-alt text-error flex items-center gap-1">
                  <X size={14} /> {errors.email.message}
                </span>
              </label>
            )}
          </div>

          {/* Password field */}
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
                className={`input input-bordered w-full pl-10 ${errors.password ? "input-error" : ""}`}
                placeholder="••••••••"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
            </div>
            {errors.password && (
              <label className="label">
                <span className="label-text-alt text-error flex items-center gap-1">
                  <X size={14} /> {errors.password.message}
                </span>
              </label>
            )}
          </div>

          {/* Role field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium flex items-center gap-1">
                <ShieldCheck size={16} /> Role
              </span>
            </label>
            <select
              className="select select-bordered w-full"
              {...register("role")}
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div className="modal-action mt-6">
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;