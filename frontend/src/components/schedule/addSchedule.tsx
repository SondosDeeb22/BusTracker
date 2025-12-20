//====================================================================================================================================
//? Importing
//====================================================================================================================================

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { weekDays } from '../../../../backend/src/enums/busScheduleEnum';

import { COLORS } from '../../styles/colorPalette';
interface AddScheduleProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface ScheduleData {
  date: string;
  driverId: string;
  routeId: string;
  busId: string;
}
//====================================================================================================================================
//? Add Scheduel Record
//====================================================================================================================================

const AddScheduleRecord: React.FC<AddScheduleProps> = ({ onClose, onSuccess }) => {
  const [scheduleData, setScheduleData] = useState<ScheduleData>({
    date: '',
    driverId: '',
    routeId: '',
    busId: ''
  });

  const [drivers, setDrivers] = useState<any[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);
  const [buses, setBuses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingDropdowns, setLoadingDropdowns] = useState(false);
  const [error, setError] = useState('');

  // Fetch dropdown data on component mount
  useEffect(() => {
    fetchDropdownData();
  }, []);

  // Fetch drivers, routes, and buses
  const fetchDropdownData = async () => {
    setLoadingDropdowns(true);
    try {
      const [driversRes, routesRes, busesRes] = await Promise.all([
        axios.get('http://localhost:3001/api/admin/drivers/fetch', { 
          withCredentials: true, 
          headers: { 'Content-Type': 'application/json' } 
        }),
        axios.get('http://localhost:3001/api/user/routes/all', { 
          withCredentials: true, 
          headers: { 'Content-Type': 'application/json' } 
        }),
        axios.get('http://localhost:3001/api/admin/buses/fetch', { 
          withCredentials: true, 
          headers: { 'Content-Type': 'application/json' } 
        })
      ]);

      console.log('Drivers response:', JSON.stringify(driversRes.data, null, 2));
      console.log('Routes response:', JSON.stringify(routesRes.data, null, 2));
      console.log('Buses response:', JSON.stringify(busesRes.data, null, 2));

      setDrivers(driversRes.data.data || []);
      setRoutes(routesRes.data.data || []);
      setBuses(busesRes.data.data || []);
      //===================================================================================
    } catch (err) {
      console.error('Error fetching dropdown data:', err);
      setError('Failed to load dropdown data');
    } finally {
      setLoadingDropdowns(false);
    }
  };
  //===================================================================================

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setScheduleData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-calculate day from date
    if (name === 'date' && value) {
      const selectedDate = new Date(value);
      const dayIndex = selectedDate.getDay();
      const dayNames = Object.values(weekDays);
      const dayName = dayNames[(dayIndex + 6) % 7]; // Adjust for Monday start
      setScheduleData(prev => ({
        ...prev,
        day: dayName
      }));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Form data being sent to backend:', JSON.stringify(scheduleData, null, 2));
      await axios.post('http://localhost:3001/api/admin/schedule/add', scheduleData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error adding schedule');
      console.error('Error adding schedule:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add Bus Schedule</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Date Field */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Date *
            </label>
            <input
              type="date"
              name="date"
              value={scheduleData.date}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>


          {/* Driver Field */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Driver *
            </label>
            {loadingDropdowns ? (
              <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100">
                Loading drivers...
              </div>
            ) : (
              <select
                name="driverId"
                value={scheduleData.driverId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          {/* Route Field */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Route *
            </label>
            {loadingDropdowns ? (
              <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100">
                Loading routes...
              </div>
            ) : (
              <select
                name="routeId"
                value={scheduleData.routeId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          {/* Bus Field */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Bus *
            </label>
            {loadingDropdowns ? (
              <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100">
                Loading buses...
              </div>
            ) : (
              <select
                name="busId"
                value={scheduleData.busId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a bus</option>
                {buses.map((bus: any) => (
                  <option key={`bus-${bus.id}`} value={bus.id}>
                    {bus.id}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Buttons */}
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
              disabled={loading || loadingDropdowns}
              className="px-4 py-2 text-white rounded-md hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-900 disabled:opacity-50"
              style= {{background: COLORS.burgundy}}
            >
              {loading ? 'Adding...' : 'Add Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddScheduleRecord;
