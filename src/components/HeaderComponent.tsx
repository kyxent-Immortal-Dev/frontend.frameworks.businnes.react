import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Menu, Search, LogOut, User, Settings } from 'lucide-react';
import Swal from 'sweetalert2';

const HeaderComponent = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownVisible(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
  
  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };
  
  return (
    <div className="navbar bg-base-100 shadow-md z-20">
      <div className="flex-none lg:hidden">
        <button onClick={toggleSidebar} className="btn btn-square btn-ghost">
          <Menu size={24} />
        </button>
      </div>
      
      <div className="flex-1">
        <span className="text-xl font-bold lg:hidden">Vehicle Rental</span>
      </div>
      
      <div className="flex-none gap-2">
        <div className="form-control hidden md:flex">
          <div className="input-group">
            <input type="text" placeholder="Search..." className="input input-bordered input-sm" />
            <button className="btn btn-square btn-sm">
              <Search size={18} />
            </button>
          </div>
        </div>
        
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={toggleDropdown} 
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
              <span className="text-lg">{user?.name?.charAt(0)}</span>
            </div>
          </button>
          
          {dropdownVisible && (
            <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-base-100 ring-1 ring-black ring-opacity-5 z-50">
              <div className="py-1" role="menu" aria-orientation="vertical">
                <button 
                  className="w-full text-left px-4 py-2 text-sm hover:bg-base-200 flex items-center gap-2"
                  role="menuitem"
                >
                  <User size={16} /> Profile
                </button>
                <button 
                  className="w-full text-left px-4 py-2 text-sm hover:bg-base-200 flex items-center gap-2"
                  role="menuitem"
                >
                  <Settings size={16} /> Settings
                </button>
                <button 
                  className="w-full text-left px-4 py-2 text-sm hover:bg-base-200 flex items-center gap-2"
                  role="menuitem"
                  onClick={handleLogout}
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderComponent;