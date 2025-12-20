//======================================================================================
//? Importing
//======================================================================================
import React, { useState } from 'react';
import axios from 'axios';
import { COLORS } from '../../styles/colorPalette';

interface RemoveStationProps {
  stationId: string;
  stationName?: string;
  onClose: () => void;
  onSuccess: () => void;
}

//======================================================================================
//? RemoveStation
//======================================================================================
const RemoveStation: React.FC<RemoveStationProps> = ({ 
  stationId, 
  stationName = 'this station', 
  onClose, 
  onSuccess 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  ///-------------------------------------------------------------------------
  const handleRemove = async () => {
    setIsLoading(true);
    setError('');

    try {
      await axios.delete(`http://localhost:3001/api/admin/station/remove`, {
        data: { id: stationId },
        withCredentials: true
      });

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while removing the station');
    } finally {
      setIsLoading(false);
    }
  };
  ///-------------------------------------------------------------------------

  //======================================================================================
  return (
    <div className="fixed inset-0 bg-black/80  flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Remove Station
        </h2>
        
        <p className="text-gray-600 mb-6">
          Are you sure you want to remove <strong>{stationName}</strong>? This action cannot be undone.
        </p>

        {error && (
          <div className=" text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-500 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleRemove}
            disabled={isLoading}
            className="px-4 py-2  text-white rounded-md hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-900 disabled:opacity-50"
            style={{background: COLORS.burgundy}}
          >
            {isLoading ? 'Removing...' : 'Remove Station'}
          </button>
        </div>
      </div>
    </div>
  );
};

//======================================================================================
export default RemoveStation;
