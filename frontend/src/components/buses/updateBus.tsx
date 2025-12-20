//======================================================================================
//? Importing
//======================================================================================
import { useState, useEffect } from 'react';
import axios from 'axios';
import {status} from '../../../../backend/src/enums/busEnum';

interface BusData{
    id: string,
    serialNumber: string,
    brand: string, 
    status : keyof typeof status | '',
    assignedRoute: string,
    assignedDriver: string
}

interface UpdateBusProps {
  onClose: () => void;
  onSuccess: () => void;
  busId: string;
}

//======================================================================================
//? UpdateBus
//======================================================================================
const UpdateBus = ({ onClose, onSuccess, busId }: UpdateBusProps) => {
  const [formData, setFormData] = useState<BusData>({
    id: busId,
    serialNumber: '',
    brand: '',
    status: '',
    assignedRoute: '',
    assignedDriver: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [routes, setRoutes] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  ///-------------------------------------------------------------------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    fetchBusData();
    fetchRoutesAndDrivers();
  }, [busId]);

  ///-------------------------------------------------------------------------
  // Fetch current bus data
  const fetchBusData = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/admin/buses/fetch`, { 
        withCredentials: true 
      });
      const buses = response.data.data || [];
      const currentBus = buses.find((bus: any) => bus.id === busId);
      
      if (currentBus) {
        setFormData({
          id: currentBus.id,
          serialNumber: currentBus.serialNumber,
          brand: currentBus.brand,
          status: currentBus.status,
          assignedRoute: currentBus.assignedRoute,
          assignedDriver: currentBus.assignedDriver
        });
      }
    } catch (err) {
      console.error('Error fetching bus data:', err);
      setError('Failed to load bus data');
    } finally {
      setInitialLoading(false);
    }
  };

  ///-------------------------------------------------------------------------
  // get all drivers and routes , so  the admin can set the association between the (driver, bus, route)
  const fetchRoutesAndDrivers = async () => {
    setLoadingDropdowns(true);
    try {
      const [routesResponse, driversResponse] = await Promise.all([
        axios.get('http://localhost:3001/api/user/routes/all', { withCredentials: true , headers: {'Content-Type': 'application/json',}, }),
        axios.get('http://localhost:3001/api/admin/drivers/fetch', { withCredentials: true , headers: {'Content-Type': 'application/json',},})
      ]);
      
      // console.log('Routes response:', JSON.stringify(routesResponse.data, null, 2));
      // console.log('Drivers response:', JSON.stringify(driversResponse.data, null, 2));
      setRoutes(routesResponse.data.data || []);
      setDrivers(driversResponse.data.data || []);
    } catch (err) {
      console.error('Error fetching dropdown data:', err);
    } finally {
      setLoadingDropdowns(false);
    }
  };
  ///-------------------------------------------------------------------------

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Form data being sent to backend:', JSON.stringify(formData, null, 2));
      await axios.patch('http://localhost:3001/api/admin/bus/update', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update bus');
    } finally {
      setLoading(false);
    }
  };

  //======================================================================================
  if (initialLoading) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="text-center">Loading bus data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Update Bus</h2>
        
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Serial Number
            </label>
            <input
              type="text"
              name="serialNumber"
              value={formData.serialNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        {/* --------------------------------------------------------------------------------------- */}

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Brand
            </label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>


        {/* --------------------------------------------------------------------------------------- */}

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Assigned Route
            </label>
            {loadingDropdowns ? (
              <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100">
                Loading routes...
              </div>
            ) : (
              <select
                name="assignedRoute"
                value={formData.assignedRoute}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a route</option>
                {routes.map((route: any, index: number) => (
                  <option key={route.id || `route-${index}`} value={route.id}>
                    {route.title || route.name || `Route ${index + 1}`}
                  </option>
                ))}
              </select>
            )}
          </div>

        {/* --------------------------------------------------------------------------------------- */}

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Assigned Driver
            </label>
            {loadingDropdowns ? (
              <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100">
                Loading drivers...
              </div>
            ) : (
              <select
                name="assignedDriver"
                value={formData.assignedDriver}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a driver</option>
                {drivers.map((driver: any) => (
                  <option key={`driver-${driver.id}`} value={driver.id}>
                    {driver.name || driver.email || `Driver ${driver.id}`}
                  </option>
                ))}
              </select>
            )}
          </div>
        
        {/* --------------------------------------------------------------------------------------- */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select status</option>
              {Object.values(status).map((statusValue) => (
                <option key={statusValue} value={statusValue}>
                  {statusValue}
                </option>
              ))}
            </select>
          </div>


          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Bus'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateBus;