import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import HeaderComponent from '../components/HeaderComponent';
import SidebarComponent from '../components/SidebarComponent';
import FooterComponent from '../components/FooterComponent';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  // If the user is not authenticated at any point, redirect to login
  if (!user) {
    navigate('/login');
    return null;
  }
  
  return (
    <div className="drawer lg:drawer-open h-screen">
      <input 
        id="drawer" 
        type="checkbox" 
        className="drawer-toggle" 
        checked={isSidebarOpen}
        onChange={toggleSidebar}
      />
      
      {/* Sidebar */}
      <div className="drawer-side z-20">
        <label htmlFor="drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <div className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
          <SidebarComponent />
        </div>
      </div>
      
      {/* Page content */}
      <div className="drawer-content flex flex-col">
        <HeaderComponent toggleSidebar={toggleSidebar} />
        
        {/* Main content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
        
        {/* Footer */}
        <FooterComponent />
      </div>
    </div>
  );
};

export default DashboardLayout;