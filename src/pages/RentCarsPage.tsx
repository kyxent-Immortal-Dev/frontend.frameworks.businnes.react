import { useState } from 'react';

interface Car {
  id: number;
  model: string;
  brand: string;
  year: number;
  licensePlate: string;
  color: string;
  rate: number;  // Daily rate
  status: 'available' | 'rented' | 'maintenance';
  imageUrl: string;
}

const RentCarsPage = () => {
  // Sample car data
  const [cars, setCars] = useState<Car[]>([
    {
      id: 1,
      model: 'Camry',
      brand: 'Toyota',
      year: 2022,
      licensePlate: 'ABC-123',
      color: 'Red',
      rate: 45,
      status: 'available',
      imageUrl: 'https://via.placeholder.com/300x200?text=Toyota+Camry',
    },
    {
      id: 2,
      model: 'Civic',
      brand: 'Honda',
      year: 2021,
      licensePlate: 'XYZ-789',
      color: 'Blue',
      rate: 40,
      status: 'available',
      imageUrl: 'https://via.placeholder.com/300x200?text=Honda+Civic',
    },
    {
      id: 3,
      model: 'Model 3',
      brand: 'Tesla',
      year: 2023,
      licensePlate: 'DEF-456',
      color: 'White',
      rate: 80,
      status: 'rented',
      imageUrl: 'https://via.placeholder.com/300x200?text=Tesla+Model+3',
    },
    {
      id: 4,
      model: 'Elantra',
      brand: 'Hyundai',
      year: 2021,
      licensePlate: 'GHI-789',
      color: 'Silver',
      rate: 35,
      status: 'available',
      imageUrl: 'https://via.placeholder.com/300x200?text=Hyundai+Elantra',
    },
    {
      id: 5,
      model: 'Mustang',
      brand: 'Ford',
      year: 2020,
      licensePlate: 'JKL-012',
      color: 'Black',
      rate: 70,
      status: 'maintenance',
      imageUrl: 'https://via.placeholder.com/300x200?text=Ford+Mustang',
    },
    {
      id: 6,
      model: 'X5',
      brand: 'BMW',
      year: 2022,
      licensePlate: 'MNO-345',
      color: 'Gray',
      rate: 90,
      status: 'available',
      imageUrl: 'https://via.placeholder.com/300x200?text=BMW+X5',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Filter cars based on search term and status
  const filteredCars = cars.filter(car => {
    const matchesSearch = 
      car.model.toLowerCase().includes(searchTerm.toLowerCase()) || 
      car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.licensePlate.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || car.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Function to handle rent button click
  const handleRentCar = (carId: number) => {
    // In a real app, this would make an API call
    setCars(cars.map(car => 
      car.id === carId ? { ...car, status: 'rented' } : car
    ));
  };
  
  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'badge-success';
      case 'rented':
        return 'badge-warning';
      case 'maintenance':
        return 'badge-error';
      default:
        return 'badge-info';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Available Vehicles</h1>
        <p className="text-gray-500">Browse and rent vehicles from our fleet</p>
      </div>
      
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="form-control flex-1">
          <div className="input-group">
            <input 
              type="text" 
              placeholder="Search by model, brand, or license plate..." 
              className="input input-bordered w-full" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-square">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
        
        <select 
          className="select select-bordered" 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="available">Available</option>
          <option value="rented">Rented</option>
          <option value="maintenance">Maintenance</option>
        </select>
      </div>
      
      {/* Car Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCars.map(car => (
          <div key={car.id} className="card bg-base-100 shadow-xl">
            <figure>
              <img src={car.imageUrl} alt={`${car.brand} ${car.model}`} className="w-full h-48 object-cover" />
            </figure>
            <div className="card-body">
              <div className="flex justify-between items-start">
                <h2 className="card-title">
                  {car.brand} {car.model}
                  <div className={`badge ${getStatusBadgeColor(car.status)}`}>
                    {car.status.charAt(0).toUpperCase() + car.status.slice(1)}
                  </div>
                </h2>
              </div>
              
              <div className="text-lg font-bold text-primary">
                ${car.rate}/day
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                <div>
                  <span className="text-gray-500">Year:</span> {car.year}
                </div>
                <div>
                  <span className="text-gray-500">Color:</span> {car.color}
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500">License:</span> {car.licensePlate}
                </div>
              </div>
              
              <div className="card-actions justify-end mt-4">
                <button 
                  className="btn btn-primary"
                  disabled={car.status !== 'available'}
                  onClick={() => handleRentCar(car.id)}
                >
                  {car.status === 'available' ? 'Rent Now' : 'Unavailable'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Show message if no cars match the filter */}
      {filteredCars.length === 0 && (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold">No vehicles found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default RentCarsPage;