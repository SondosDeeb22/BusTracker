import React, { useState } from 'react';
import axios from 'axios';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface RemoveScheduleProps {
  onClose: () => void;
  onSuccess: () => void;
  scheduleId: string;
  scheduleInfo: string;
}

const RemoveSchedule: React.FC<RemoveScheduleProps> = ({ onClose, onSuccess, scheduleId, scheduleInfo }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRemove = async () => {
    setLoading(true);
    setError('');

    try {
      await axios.delete('http://localhost:3001/api/admin/schedule/remove', {
        data: { id: scheduleId },
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error removing schedule');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Remove Schedule</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="mb-6">
          <p className="text-gray-700 mb-2">
            Are you sure you want to remove this schedule?
          </p>
          <p className="text-sm text-gray-600 bg-gray-100 p-3 rounded">
            {scheduleInfo}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleRemove}
            disabled={loading}
            className="flex-1 bg-red-500 text-white py-2 rounded-md hover:bg-red-600 disabled:bg-gray-400 transition"
          >
            {loading ? 'Removing...' : 'Remove'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemoveSchedule;
