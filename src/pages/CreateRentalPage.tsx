import { useState } from 'react';
import Swal from 'sweetalert2';

interface Vehicle {
  id: number;
  model: string;
  brand: string;
  licensePlate: string;
  rate: number;
}

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
}

const CreateRentalPage = () => {
  // Sample vehicles and customers
  const vehicles: Vehicle[] = [
    { id: 1, model: 'Camry', brand: 'Toyota', licensePlate: 'ABC-123', rate: 45 },
    { id: 2, model: 'Civic', brand: 'Honda', licensePlate: 'XYZ-789', rate: 40 },
    { id: 4, model: 'Elantra', brand: 'Hyundai', licensePlate: 'GHI-789', rate: 35 },
    { id: 6, model: 'X5', brand: 'BMW', licensePlate: 'MNO-345', rate: 90 },
  ];
  
  const customers: Customer[] = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', phone: '555-123-4567' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', phone: '555-987-6543' },
    { id: 3, name: 'Mike Johnson', email: 'mike.johnson@example.com', phone: '555-456-7890' },
    { id: 4, name: 'Sarah Williams', email: 'sarah.williams@example.com', phone: '555-789-1234' },
  ];
  
  // Form state
  const [formData, setFormData] = useState({
    customerId: '',
    vehicleId: '',
    startDate: '',
    endDate: '',
    paymentMethod: 'credit_card',
    notes: '',
  });
  
  // Selected vehicle and customer
  const selectedVehicle = formData.vehicleId ? vehicles.find(v => v.id === parseInt(formData.vehicleId)) : null;
  const selectedCustomer = formData.customerId ? customers.find(c => c.id === parseInt(formData.customerId)) : null;
  
  // Calculate rental duration and total cost
  const calculateRentalDays = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
    
    // Calculate the difference in days
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Return at least 1 day for same-day rentals
    return Math.max(1, diffDays);
  };
  
  const rentalDays = calculateRentalDays();
  const totalCost = selectedVehicle ? selectedVehicle.rate * rentalDays : 0;
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.customerId || !formData.vehicleId || !formData.startDate || !formData.endDate) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please fill in all required fields',
        confirmButtonColor: '#3085d6',
      });
      return;
    }
    
    if (rentalDays <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Date Range',
        text: 'End date must be after start date',
        confirmButtonColor: '#3085d6',
      });
      return;
    }
    
    // In a real application, this would make an API call to create the rental
    Swal.fire({
      icon: 'success',
      title: 'Rental Created',
      text: `Rental successfully created for ${selectedCustomer?.name}!`,
      confirmButtonColor: '#3085d6',
    });
    
    // Reset form
    setFormData({
      customerId: '',
      vehicleId: '',
      startDate: '',
      endDate: '',
      paymentMethod: 'credit_card',
      notes: '',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create New Rental</h1>
        <p className="text-gray-500">Create a new rental contract</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-xl mb-4">Rental Details</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Customer Selection */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Customer*</span>
                    </label>
                    <select 
                      className="select select-bordered w-full" 
                      name="customerId"
                      value={formData.customerId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Customer</option>
                      {customers.map(customer => (
                        <option key={customer.id} value={customer.id}>
                          {customer.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Vehicle Selection */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Vehicle*</span>
                    </label>
                    <select 
                      className="select select-bordered w-full" 
                      name="vehicleId"
                      value={formData.vehicleId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Vehicle</option>
                      {vehicles.map(vehicle => (
                        <option key={vehicle.id} value={vehicle.id}>
                          {vehicle.brand} {vehicle.model} ({vehicle.licensePlate})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Start Date */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Start Date*</span>
                    </label>
                    <input 
                      type="date" 
                      className="input input-bordered" 
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  
                  {/* End Date */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">End Date*</span>
                    </label>
                    <input 
                      type="date" 
                      className="input input-bordered" 
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      min={formData.startDate || new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  
                  {/* Payment Method */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Payment Method*</span>
                    </label>
                    <select 
                      className="select select-bordered w-full" 
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleChange}
                      required
                    >
                      <option value="credit_card">Credit Card</option>
                      <option value="debit_card">Debit Card</option>
                      <option value="cash">Cash</option>
                      <option value="bank_transfer">Bank Transfer</option>
                    </select>
                  </div>
                  
                  {/* Notes */}
                  <div className="form-control md:col-span-2">
                    <label className="label">
                      <span className="label-text">Notes</span>
                    </label>
                    <textarea 
                      className="textarea textarea-bordered h-32" 
                      placeholder="Additional notes about the rental"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                </div>
                
                {/* Submit Button */}
                <div className="mt-6">
                  <button type="submit" className="btn btn-primary w-full">
                    Create Rental
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        {/* Summary Panel */}
        <div className="card bg-base-100 shadow-xl h-fit sticky top-6">
          <div className="card-body">
            <h2 className="card-title text-xl mb-4">Rental Summary</h2>
            
            {(selectedCustomer || selectedVehicle || rentalDays > 0) ? (
              <div className="space-y-6">
                {/* Customer Info */}
                {selectedCustomer && (
                  <div>
                    <h3 className="font-medium text-gray-500">Customer</h3>
                    <p className="font-bold text-lg">{selectedCustomer.name}</p>
                    <p>{selectedCustomer.email}</p>
                    <p>{selectedCustomer.phone}</p>
                  </div>
                )}
                
                {/* Vehicle Info */}
                {selectedVehicle && (
                  <div>
                    <h3 className="font-medium text-gray-500">Vehicle</h3>
                    <p className="font-bold text-lg">{selectedVehicle.brand} {selectedVehicle.model}</p>
                    <p>License: {selectedVehicle.licensePlate}</p>
                    <p>Rate: ${selectedVehicle.rate}/day</p>
                  </div>
                )}
                
                {/* Rental Period */}
                {rentalDays > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-500">Rental Period</h3>
                    <p>
                      {new Date(formData.startDate).toLocaleDateString()} to {new Date(formData.endDate).toLocaleDateString()}
                    </p>
                    <p>{rentalDays} day{rentalDays !== 1 ? 's' : ''}</p>
                  </div>
                )}
                
                {/* Calculated Cost */}
                {selectedVehicle && rentalDays > 0 && (
                  <div className="pt-4 border-t">
                    <div className="flex justify-between">
                      <span>Daily Rate:</span>
                      <span>${selectedVehicle.rate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Number of Days:</span>
                      <span>{rentalDays}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg mt-2">
                      <span>Total Cost:</span>
                      <span>${totalCost}</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <p>Select a customer, vehicle, and date range to see the rental summary.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRentalPage;