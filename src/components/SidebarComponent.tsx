import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Home, Users, Car, PlusCircle, LayoutDashboard } from 'lucide-react';

const SidebarComponent = () => {
  const { user } = useAuthStore();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="flex flex-col h-full">
     
      <div className="flex items-center gap-3 px-4 py-4">
        <div className="avatar placeholder">
          <div className="bg-primary text-primary-content rounded-full w-12 flex items-center justify-center">
            <LayoutDashboard size={24} />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold">Vehicle Rental</h2>
          <p className="text-sm opacity-60">Management System</p>
        </div>
      </div>
      

      <div className="divider mx-4 my-2"></div>
      
      <div className="px-4 py-2 mb-6">
        <p className="font-medium text-lg">{user?.name}</p>
        <p className="text-sm opacity-70">{user?.email}</p>
      </div>
      
      <ul className="space-y-2 px-2">
        <li>
          <Link 
            to="/dashboard" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/dashboard') ? 'bg-primary text-primary-content' : 'hover:bg-base-300'}`}
          >
            <Home size={18} />
            Dashboard
          </Link>
        </li>
        
        <li>
          <Link 
            to="/rent-cars" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/rent-cars') ? 'bg-primary text-primary-content' : 'hover:bg-base-300'}`}
          >
            <Car size={18} />
            Rent Cars
          </Link>
        </li>
        
        <li>
          <Link 
            to="/users" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/users') ? 'bg-primary text-primary-content' : 'hover:bg-base-300'}`}
          >
            <Users size={18} />
            Manage Users
          </Link>
        </li>
        
        <li>
          <Link 
            to="/create-rental" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/create-rental') ? 'bg-primary text-primary-content' : 'hover:bg-base-300'}`}
          >
            <PlusCircle size={18} />
            Create Rental
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default SidebarComponent;