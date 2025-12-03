//====================================================================================================================================
//? Importing
//====================================================================================================================================
import React, { useState } from 'react';
import axios from 'axios';
import { XMarkIcon } from '@heroicons/react/24/outline';

import {role, gender, status} from '../../../../backend/src/enums/userEnum';
import { COLORS } from '../../styles/colorPalette';


//====================================================================================================================================
interface AddDriverProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface DriverData{
  name: string,
  gender: keyof typeof gender | '';
  role: keyof typeof role | '';
  phone: string;
  email: string;
  birthDate: string;
  licenseNumber: string;
  licenseExpiryDate: string;
  status: keyof typeof status | '';

  
}
//====================================================================================================================================
//? AddDriver
//=======================================================================================

const AddDriver: React.FC<AddDriverProps> = ({ onClose, onSuccess }) => {
  const [driverData, setDriverData] = useState<DriverData>({
    name: '',
    gender: '',
    role: 'driver',
    phone: '',
    email: '',
    birthDate: '',
    licenseNumber: '',
    licenseExpiryDate: '',
    status: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  
  //-----------------------------------------------------------------------------------------------------
  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target; // the name and value of filed that was changed
    // prev hold current formd data (driverData), we update data by coping all fields and update only one filed, which is [name]: value, the one got updated)
    setDriverData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  //-----------------------------------------------------------------------------------------------------

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); //stops page from refreshing on form submit
    setLoading(true);
    setError('');//clears any previous error messages


  //===================================================================================================

    try {
      console.log(document.cookie)
      await axios.post('http://localhost:3001/api/admin/driver/add', driverData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });
      
      onSuccess(); // refresh table and trigger success message
      onClose(); //close the model
      //-----------------------------------------------
    } catch (error:any) {
      setError(error.response.data.message || 'Error Occured while adding driver, Please try again!');
    } finally {
      setLoading(false);
    }
  };

  //===================================================================================================
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Add New Driver</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={driverData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender *
            </label>
            <select
              name="gender"
              value={driverData.gender}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

  

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone *
            </label>
            <input
              type="tel"
              name="phone"
              value={driverData.phone}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={driverData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Birth Date *
            </label>
            <input
              type="date"
              name="birthDate"
              value={driverData.birthDate}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              License Number *
            </label>
            <input
              type="text"
              name="licenseNumber"
              value={driverData.licenseNumber}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              License Expiry Date *
            </label>
            <input
              type="date"
              name="licenseExpiryDate"
              value={driverData.licenseExpiryDate}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status *
            </label>
            <select
              name="status"
              value={driverData.status}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Status</option>
              <option value="active">Active</option>
              <option value="passive">Passive</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2  text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50"
              style= {{background: COLORS.burgundy}}
            >
              {loading ? 'Adding...' : 'Add Driver'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


//=========================================================================================================
export default AddDriver;