import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Swal from 'sweetalert2';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    Swal.fire({
      title: 'Logout',
      text: 'Are you sure you want to logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await logout();
        navigate('/login');
      }
    });
  };
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  

  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="drawer lg:drawer-open">
      <input 
        id="drawer" 
        type="checkbox" 
        className="drawer-toggle" 
        checked={isSidebarOpen}
        onChange={toggleSidebar}
      />
      

      <div className="drawer-side z-20">
        <label htmlFor="drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <div className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
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
                  View Users
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
            
            {/* Spacer */}
            <div className="flex-grow"></div>
            
            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 mt-4 text-error hover:bg-base-300 rounded-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm10 4a1 1 0 00-1-1H8a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V7z" clipRule="evenodd" />
                <path d="M2 13a1 1 0 011-1h1a1 1 0 110 2H3a1 1 0 01-1-1z" />
                <path d="M5 3a2 2 0 012-2h7a2 2 0 012 2v11a2 2 0 01-2 2H7a2 2 0 01-2-2V3z" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
      
      {/* Page content */}
      <div className="drawer-content flex flex-col">
        {/* Top navigation */}
        <div className="navbar bg-base-100 shadow-md z-10">
          <div className="flex-none lg:hidden">
            <label htmlFor="drawer" aria-label="open sidebar" className="btn btn-square btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </label>
          </div>
          <div className="flex-1">
            <span className="text-xl font-bold lg:hidden">Vehicle Rental</span>
          </div>
          <div className="flex-none">
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
                  <span className="text-lg">{user?.name?.charAt(0)}</span>
                </div>
              </div>
              <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                <li><a>Profile</a></li>
                <li><a>Settings</a></li>
                <li><a onClick={handleLogout}>Logout</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;