//================================================================================
//? Import 
//================================================================================
import React, { useState } from 'react';
import axios from 'axios';
import { COLORS } from '../../styles/colorPalette';
import { useTranslation } from 'react-i18next';

//interfaces
interface UpdateDriverProps {
  driver: any;
  onClose: () => void;
  onSuccess: () => void;
}


//================================================================================
const UpdateDriver: React.FC<UpdateDriverProps> = ({ driver, onClose, onSuccess }) => {
  const { t } = useTranslation('drivers');
  const { t: tGlobal } = useTranslation('translation');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formData, setFormData] = useState({
    name: driver.name || '',
    phone: driver.phone || '',
    email: driver.email || '',
    licenseNumber: driver.licenseNumber || '',
    licenseExpiryDate: driver.licenseExpiryDate || '',
    status: driver.status || ''
  });

  // change the new value only, keep former ones as they are
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // when updating set loading to true
  const handleUpdate = async () => {
    setIsLoading(true);
    setError('');

    //================================================================================

    try {
      const updates: Record<string, any> = { id: driver.id };

      (Object.keys(formData) as Array<keyof typeof formData>).forEach((key) => {
        if (formData[key] !== driver?.[key]) {
          updates[key] = formData[key];
        }
      });

      // use the endpoint to update data given from user
      await axios.patch(`http://localhost:3001/api/admin/driver/update`, updates, {
        withCredentials: true
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      console.log('Full error:', err);
      console.log('Error response:', err.response);
      console.log('Error status:', err.response?.status);
      console.log('Error data:', err.response?.data);
      
      const messageKey = err.response?.data?.message;
      if (messageKey) {
        setError(tGlobal(messageKey, { defaultValue: messageKey }));
        return;
      }

      setError(t('updateForm.error'));
    } finally {
      setIsLoading(false);
    }
  };

  // -----------------------------------------------------------
  
  const handleConfirmUpdate = () => {
    setShowConfirmModal(true);
  };

  const handleCancelUpdate = () => {
    setShowConfirmModal(false);
  };

  const handleProceedUpdate = () => {
    setShowConfirmModal(false);
    handleUpdate();
  };


  //================================================================================
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      {/* Main Update Modal */}
      {!showConfirmModal && (
        <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">{t('updateForm.title')}</h2>
            
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('updateForm.name')}
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

  
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('updateForm.phone')}
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('updateForm.email')}
                
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('updateForm.licenseNumber')}
              </label>
              <input
                type="text"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('updateForm.licenseExpiryDate')}
              </label>
              <input
                type="date"
                name="licenseExpiryDate"
                value={formData.licenseExpiryDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('updateForm.status')}
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
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
                {t('updateForm.cancel')}
              </button>
              <button
                type="button"
                onClick={handleConfirmUpdate}
                disabled={isLoading}
                className="flex-1 px-4 py-2 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50"
                style={{ background: COLORS.burgundy }}
              >
                {isLoading ? t('updateForm.loading') : t('updateForm.submit')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Confirmation Modal */}
      {showConfirmModal && (
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            {t('updateForm.confirmTitle')}
          </h2>
          
          <p className="text-gray-600 mb-6">
            {t('updateForm.confirmMessage')}
          </p>

          <div className="flex justify-end space-x-3">
            <button
              onClick={handleCancelUpdate}
              disabled={isLoading}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-500 disabled:opacity-50"
            >
              {t('updateForm.confirmCancel')}
            </button>
            <button
              onClick={handleProceedUpdate}
              disabled={isLoading}
              className="px-4 py-2 text-white rounded-md hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-900 disabled:opacity-50"
              style={{ background: COLORS.burgundy }}
            >
              {isLoading ? t('updateForm.loading') : t('updateForm.confirmProceed')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
//================================================================================

export default UpdateDriver;
