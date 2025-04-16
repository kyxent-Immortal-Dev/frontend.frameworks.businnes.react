import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const SidebarComponent = () => {
  const { user } = useAuthStore();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="flex flex-col h-full">
      {/* App Name and Logo */}
      <div className="flex items-center gap-3 px-1 py-3">
        <div className="avatar placeholder">
          <div className="bg-primary text-primary-content rounded-full w-12">
            <span className="text-xl">VR</span>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold">Vehicle Rental</h2>
          <p className="text-sm opacity-60">Management System</p>
        </div>
      </div>
      
      {/* Divider */}
      <div className="divider"></div>
      
      {/* User Info */}
      <div className="px-4 py-2 mb-4">
        <p className="font-medium">{user?.name}</p>
        <p className="text-sm opacity-70">{user?.email}</p>
      </div>
      
      {/* Navigation Links */}
      <ul className="space-y-1">
        <li>
          <Link 
            to="/dashboard" 
            className={`flex items-center gap-3 px-3 py-2 rounded-md ${isActive('/dashboard') ? 'bg-primary text-primary-content' : 'hover:bg-base-300'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Dashboard
          </Link>
        </li>
        
        <li>
          <Link 
            to="/rent-cars" 
            className={`flex items-center gap-3 px-3 py-2 rounded-md ${isActive('/rent-cars') ? 'bg-primary text-primary-content' : 'hover:bg-base-300'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1h5.05a2.5 2.5 0 014.9 0H19a1 1 0 001-1v-2a4 4 0 00-4-4h-3V4a1 1 0 00-1-1H3z" />
            </svg>
            Rent Cars
          </Link>
        </li>
        
        <li>
          <Link 
            to="/users" 
            className={`flex items-center gap-3 px-3 py-2 rounded-md ${isActive('/users') ? 'bg-primary text-primary-content' : 'hover:bg-base-300'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            Manage Users
          </Link>
        </li>
        
        <li>
          <Link 
            to="/create-rental" 
            className={`flex items-center gap-3 px-3 py-2 rounded-md ${isActive('/create-rental') ? 'bg-primary text-primary-content' : 'hover:bg-base-300'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            Create Rental
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default SidebarComponent;