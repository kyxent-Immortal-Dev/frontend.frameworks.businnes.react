import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Swal from 'sweetalert2';

const HeaderComponent = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  
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
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
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
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" onClick={toggleDropdown} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
              <span className="text-lg">{user?.name?.charAt(0)}</span>
            </div>
          </div>
          
          {dropdownVisible && (
            <ul className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
              <li><a className="justify-between">Profile</a></li>
              <li><a>Settings</a></li>
              <li><a onClick={handleLogout}>Logout</a></li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderComponent;