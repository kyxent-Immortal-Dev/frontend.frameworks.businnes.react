import { useState, useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { 
  Calendar, User, Car, CreditCard, 
  FileText, DollarSign, Clock, Save, 
  ClipboardEdit, Mail, Phone, Tag 
} from 'lucide-react'; // Added missing imports
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

interface RentalFormData {
  customerId: string;
  vehicleId: string;
  startDate: string;
  endDate: string;
  paymentMethod: string;
  notes: string;
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
  
  // Form setup using react-hook-form
  const { 
    control,
    register, 
    handleSubmit, 
    watch,
    reset,
    formState: { errors, isSubmitting, isValid }
  } = useForm<RentalFormData>({
    defaultValues: {
      customerId: '',
      vehicleId: '',
      startDate: '',
      endDate: '',
      paymentMethod: 'credit_card',
      notes: ''
    }
  });
  
  // Watch form values for calculations
  const watchedValues = watch();
  
  // State for rental calculations
  const [rentalDays, setRentalDays] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  
  // Memoized selected customer and vehicle to avoid unnecessary recalculations
  const selectedVehicle = useMemo(
    () => vehicles.find(v => v.id === Number(watchedValues.vehicleId)),
    [watchedValues.vehicleId]
  );
  const selectedCustomer = useMemo(
    () => customers.find(c => c.id === Number(watchedValues.customerId)),
    [watchedValues.customerId]
  );
  
  // Calculate rental duration and cost
  useEffect(() => {
    if (watchedValues.startDate && watchedValues.endDate) {
      const start = new Date(watchedValues.startDate);
      const end = new Date(watchedValues.endDate);
      
      if (start instanceof Date && end instanceof Date && !isNaN(start.getTime()) && !isNaN(end.getTime())) {
        const diffTime = Math.max(end.getTime() - start.getTime(), 0); // Ensure non-negative
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const days = Math.max(1, diffDays); // Ensure at least 1 day
        setRentalDays(days);
        
        if (selectedVehicle) {
          setTotalCost(selectedVehicle.rate * days);
        } else {
          setTotalCost(0); // Reset cost if no vehicle selected
        }
      } else {
        setRentalDays(0);
        setTotalCost(0);
      }
    } else {
      setRentalDays(0);
      setTotalCost(0);
    }
  }, [watchedValues.startDate, watchedValues.endDate, selectedVehicle]);
  
  // Handle form submission with error handling
  const onSubmit = async (data: RentalFormData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock async operation
      Swal.fire({
        icon: 'success',
        title: 'Rental Created',
        text: `Rental successfully created for ${selectedCustomer?.name || 'customer'}!`,
        confirmButtonColor: '#3085d6',
      });
      
      console.log("Form data submitted:", data);
      reset();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to create rental. Please try again.',
        confirmButtonColor: '#d33',
      });
    }
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
              <h2 className="card-title text-xl mb-4 flex items-center gap-2">
                <ClipboardEdit size={20} /> Rental Details
              </h2>
              
              <form onSubmit={handleSubmit(onSubmit)} aria-label="Create Rental Form">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Customer Selection */}
                  <div className="form-control">
                    <label className="label" htmlFor="customerId">
                      <span className="label-text font-medium flex items-center gap-2">
                        <User size={16} /> Customer*
                      </span>
                    </label>
                    <Controller
                      name="customerId"
                      control={control}
                      rules={{ required: "Please select a customer" }}
                      render={({ field }) => (
                        <select 
                          id="customerId"
                          className={`select select-bordered w-full ${errors.customerId ? 'select-error' : ''}`}
                          aria-invalid={!!errors.customerId}
                          {...field}
                        >
                          <option value="">Select Customer</option>
                          {customers.map(customer => (
                            <option key={customer.id} value={customer.id}>
                              {customer.name}
                            </option>
                          ))}
                        </select>
                      )}
                    />
                    {errors.customerId && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.customerId.message}</span>
                      </label>
                    )}
                  </div>
                  
                  {/* Vehicle Selection */}
                  <div className="form-control">
                    <label className="label" htmlFor="vehicleId">
                      <span className="label-text font-medium flex items-center gap-2">
                        <Car size={16} /> Vehicle*
                      </span>
                    </label>
                    <Controller
                      name="vehicleId"
                      control={control}
                      rules={{ required: "Please select a vehicle" }}
                      render={({ field }) => (
                        <select 
                          id="vehicleId"
                          className={`select select-bordered w-full ${errors.vehicleId ? 'select-error' : ''}`}
                          aria-invalid={!!errors.vehicleId}
                          {...field}
                        >
                          <option value="">Select Vehicle</option>
                          {vehicles.map(vehicle => (
                            <option key={vehicle.id} value={vehicle.id}>
                              {vehicle.brand} {vehicle.model} ({vehicle.licensePlate})
                            </option>
                          ))}
                        </select>
                      )}
                    />
                    {errors.vehicleId && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.vehicleId.message}</span>
                      </label>
                    )}
                  </div>
                  
                  {/* Start Date */}
                  <div className="form-control">
                    <label className="label" htmlFor="startDate">
                      <span className="label-text font-medium flex items-center gap-2">
                        <Calendar size={16} /> Start Date*
                      </span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                        <Calendar size={16} />
                      </div>
                      <input 
                        id="startDate"
                        type="date" 
                        className={`input input-bordered w-full pl-10 ${errors.startDate ? 'input-error' : ''}`}
                        min={new Date().toISOString().split('T')[0]}
                        aria-invalid={!!errors.startDate}
                        {...register("startDate", { 
                          required: "Start date is required" 
                        })}
                      />
                    </div>
                    {errors.startDate && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.startDate.message}</span>
                      </label>
                    )}
                  </div>
                  
                  {/* End Date */}
                  <div className="form-control">
                    <label className="label" htmlFor="endDate">
                      <span className="label-text font-medium flex items-center gap-2">
                        <Calendar size={16} /> End Date*
                      </span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                        <Calendar size={16} />
                      </div>
                      <input 
                        id="endDate"
                        type="date" 
                        className={`input input-bordered w-full pl-10 ${errors.endDate ? 'input-error' : ''}`}
                        min={watchedValues.startDate || new Date().toISOString().split('T')[0]}
                        aria-invalid={!!errors.endDate}
                        {...register("endDate", { 
                          required: "End date is required",
                          validate: value => {
                            if (!watchedValues.startDate) return true;
                            const start = new Date(watchedValues.startDate);
                            const end = new Date(value);
                            return end >= start || "End date must be on or after start date";
                          }
                        })}
                      />
                    </div>
                    {errors.endDate && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.endDate.message}</span>
                      </label>
                    )}
                  </div>
                  
                  {/* Payment Method */}
                  <div className="form-control">
                    <label className="label" htmlFor="paymentMethod">
                      <span className="label-text font-medium flex items-center gap-2">
                        <CreditCard size={16} /> Payment Method*
                      </span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                        <CreditCard size={16} />
                      </div>
                      <select 
                        id="paymentMethod"
                        className="select select-bordered w-full pl-10"
                        {...register("paymentMethod")}
                      >
                        <option value="credit_card">Credit Card</option>
                        <option value="debit_card">Debit Card</option>
                        <option value="cash">Cash</option>
                        <option value="bank_transfer">Bank Transfer</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Notes */}
                  <div className="form-control md:col-span-2">
                    <label className="label" htmlFor="notes">
                      <span className="label-text font-medium flex items-center gap-2">
                        <FileText size={16} /> Notes
                      </span>
                    </label>
                    <textarea 
                      id="notes"
                      className="textarea textarea-bordered h-32" 
                      placeholder="Additional notes about the rental"
                      aria-describedby="notes-description"
                      {...register("notes")}
                    ></textarea>
                    <span id="notes-description" className="sr-only">
                      Optional field for additional rental notes
                    </span>
                  </div>
                </div>
                
                {/* Submit Button */}
                <div className="mt-6">
                  <button 
                    type="submit" 
                    className="btn btn-primary w-full"
                    disabled={isSubmitting || !isValid}
                    aria-label="Create Rental"
                  >
                    {isSubmitting ? (
                      'Creating...'
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Save size={18} /> Create Rental
                      </span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        {/* Summary Panel */}
        <div className="card bg-base-100 shadow-xl h-fit sticky top-6">
          <div className="card-body">
            <h2 className="card-title text-xl mb-4 flex items-center gap-2">
              <FileText size={20} /> Rental Summary
            </h2>
            
            {(selectedCustomer || selectedVehicle || rentalDays > 0) ? (
              <div className="space-y-6">
                {/* Customer Info */}
                {selectedCustomer && (
                  <div>
                    <h3 className="font-medium text-gray-500 flex items-center gap-2">
                      <User size={16} /> Customer
                    </h3>
                    <p className="font-bold text-lg">{selectedCustomer.name}</p>
                    <p className="flex items-center gap-1">
                      <Mail size={14} className="text-gray-500" aria-hidden="true" /> 
                      {selectedCustomer.email}
                    </p>
                    <p className="flex items-center gap-1">
                      <Phone size={14} className="text-gray-500" aria-hidden="true" /> 
                      {selectedCustomer.phone}
                    </p>
                  </div>
                )}
                
                {/* Vehicle Info */}
                {selectedVehicle && (
                  <div>
                    <h3 className="font-medium text-gray-500 flex items-center gap-2">
                      <Car size={16} /> Vehicle
                    </h3>
                    <p className="font-bold text-lg">{selectedVehicle.brand} {selectedVehicle.model}</p>
                    <p className="flex items-center gap-1">
                      <Tag size={14} className="text-gray-500" aria-hidden="true" /> 
                      License: {selectedVehicle.licensePlate}
                    </p>
                    <p className="flex items-center gap-1">
                      <DollarSign size={14} className="text-gray-500" aria-hidden="true" /> 
                      Rate: ${selectedVehicle.rate}/day
                    </p>
                  </div>
                )}
                
                {/* Rental Period */}
                {rentalDays > 0 && watchedValues.startDate && watchedValues.endDate && (
                  <div>
                    <h3 className="font-medium text-gray-500 flex items-center gap-2">
                      <Clock size={16} /> Rental Period
                    </h3>
                    <p className="flex items-center gap-1">
                      <Calendar size={14} className="text-gray-500" aria-hidden="true" />
                      {new Date(watchedValues.startDate).toLocaleDateString()} to {new Date(watchedValues.endDate).toLocaleDateString()}
                    </p>
                    <p className="flex items-center gap-1">
                      <Clock size={14} className="text-gray-500" aria-hidden="true" />
                      {rentalDays} day{rentalDays !== 1 ? 's' : ''}
                    </p>
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
                    <div className="flex justify-between font-bold text-lg mt-3 items-center">
                      <span className="flex items-center gap-1">
                        <DollarSign size={16} aria-hidden="true" /> Total Cost:
                      </span>
                      <span>${totalCost.toFixed(2)}</span> {/* Format to 2 decimal places */}
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