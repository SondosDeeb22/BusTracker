//======================================================================================
//? Importing
//======================================================================================
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { COLORS } from '../../styles/colorPalette';
import { status as stationStatus } from '../../../../backend/src/enums/stationEnum';

interface StationData {
  id: string;
  stationName: string;
  latitude: string;
  longitude: string;
  status: string;
}

interface UpdateStationProps {
  onClose: () => void;
  onSuccess: () => void;
  stationId: string;
}

//======================================================================================
//? UpdateStation
//======================================================================================
const UpdateStation: React.FC<UpdateStationProps> = ({ onClose, onSuccess, stationId }) => {
  const [formData, setFormData] = useState<StationData>({
    id: stationId,
    stationName: '',
    latitude: '',
    longitude: '',
    status: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  ///-------------------------------------------------------------------------
  const fetchStationData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/admin/stations/fetch', { 
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      });
      const currentStation = response.data.data.find((station: any) => station.id === stationId);
      if (currentStation) {
        setFormData({
          id: currentStation.id,
          stationName: currentStation.stationName,
          latitude: currentStation.latitude,
          longitude: currentStation.longitude,
          status: currentStation.status
        });
      }
    } catch (err) {
      setError('Failed to fetch station data');
    }
  };

  useEffect(() => {
    if (stationId) {
      fetchStationData();
    }
  }, [stationId]);
  ///-------------------------------------------------------------------------

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  ///-------------------------------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.patch('http://localhost:3001/api/admin/station/update', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update station');
    } finally {
      setLoading(false);
    }
  };
  ///-------------------------------------------------------------------------

  //======================================================================================
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Update Station</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Station Name
            </label>
            <input
              type="text"
              name="stationName"
              value={formData.stationName}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Latitude
            </label>
            <input
              type="text"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Longitude
            </label>
            <input
              type="text"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
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
              {(Object.values(stationStatus) as string[]).map((status) => (
                <option key={status} value={status}>
                  {status === 'covered' ? 'Covered' : 'Not Covered'}
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
              {loading ? 'Updating...' : 'Update Station'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

//======================================================================================
export default UpdateStation;
