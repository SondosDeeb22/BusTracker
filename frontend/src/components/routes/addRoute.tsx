//======================================================================================
//? Importing
//======================================================================================
import React, { useState } from 'react';
import axios from 'axios';
import { COLORS } from '../../styles/colorPalette';
import { status as routeStatus } from '../../../../backend/src/enums/routeEnum';

interface RouteData {
  title: string;
  color: string;
  totalStops: number;
  status: string;
}

interface AddRouteProps {
  onClose: () => void;
  onSuccess: () => void;
}

//======================================================================================
//? AddRoute
//======================================================================================
const AddRoute: React.FC<AddRouteProps> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState<RouteData>({
    title: '',
    color: '#000000',
    totalStops: 0,
    status: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  ///-------------------------------------------------------------------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'totalStops' ? parseInt(value) || 0 : value
    }));
  };

  ///-------------------------------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post('http://localhost:3001/api/admin/route/add', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add route');
    } finally {
      setLoading(false);
    }
  };
  ///-------------------------------------------------------------------------

  //======================================================================================
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add New Route</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Route Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Color
            </label>
            <input
              type="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full h-10 py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Total Stops
            </label>
            <input
              type="number"
              name="totalStops"
              value={formData.totalStops}
              onChange={handleChange}
              min="0"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="">Select Status</option>
              {(Object.values(routeStatus) as string[]).map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-500 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-white rounded-md hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 disabled:opacity-50"
              style={{ backgroundColor: COLORS.burgundy }}
            >
              {loading ? 'Adding...' : 'Add Route'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

//======================================================================================
export default AddRoute;
