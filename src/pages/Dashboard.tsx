import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { 
  Car, Users, DollarSign, Clock, 
  PlusCircle, UserPlus, PlusSquare, FileText,
  Activity
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Helper function to format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };
  
  // Helper function to format time
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  };
  
  // Sample stats for dashboard
  const stats = [
    { 
      name: 'Available Vehicles', 
      value: 24, 
      icon: <Car size={24} />, 
      color: 'bg-primary' 
    },
    { 
      name: 'Active Rentals', 
      value: 8, 
      icon: <Activity size={24} />, 
      color: 'bg-secondary' 
    },
    { 
      name: 'Registered Users', 
      value: 42, 
      icon: <Users size={24} />, 
      color: 'bg-accent' 
    },
    { 
      name: 'Total Revenue', 
      value: '$2,850', 
      icon: <DollarSign size={24} />, 
      color: 'bg-success' 
    },
  ];
  
  // Sample recent activities
  const recentActivities = [
    { user: 'John Doe', action: 'rented a Toyota Camry', time: '2 hours ago' },
    { user: 'Jane Smith', action: 'returned a Honda Civic', time: '5 hours ago' },
    { user: 'Mike Johnson', action: 'created a new account', time: '1 day ago' },
    { user: 'Sarah Williams', action: 'rented a Tesla Model 3', time: '1 day ago' },
    { user: 'David Brown', action: 'updated their profile', time: '2 days ago' },
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-base-100 p-6 rounded-lg shadow-md">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
          <p className="text-gray-500">{formatDate(currentTime)}</p>
        </div>
        <div className="text-right bg-base-200 p-3 rounded-lg">
          <div className="text-2xl font-bold">{formatTime(currentTime)}</div>
          <p className="text-sm text-gray-500 flex items-center justify-end gap-1">
            <Clock size={14} /> Current Time
          </p>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="card-body p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500">{stat.name}</p>
                  <h2 className="text-3xl font-bold mt-1">{stat.value}</h2>
                </div>
                <div className={`${stat.color} w-12 h-12 rounded-full flex items-center justify-center text-white`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Recent Activities */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-xl mb-4 flex items-center gap-2">
            <Activity size={20} /> Recent Activities
          </h2>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Action</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {recentActivities.map((activity, index) => (
                  <tr key={index} className="hover">
                    <td className="font-medium">{activity.user}</td>
                    <td>{activity.action}</td>
                    <td className="text-gray-500 flex items-center gap-1">
                      <Clock size={14} /> {activity.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-xl mb-4 flex items-center gap-2">
            <Activity size={20} /> Quick Actions
          </h2>
          <div className="flex flex-wrap gap-4">
            <button className="btn btn-primary flex items-center gap-2">
              <Car size={16} />
              New Rental
            </button>
            <button className="btn btn-secondary flex items-center gap-2">
              <UserPlus size={16} />
              Add User
            </button>
            <button className="btn btn-accent flex items-center gap-2">
              <PlusSquare size={16} />
              Add Vehicle
            </button>
            <button className="btn btn-info flex items-center gap-2">
              <FileText size={16} />
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;