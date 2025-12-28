//======================================================================================
//? Importing
//======================================================================================
import { useState, useEffect } from 'react';
import axios from 'axios';
import {status} from '../../../../backend/src/enums/busEnum';
import { COLORS } from '../../styles/colorPalette';
import { useTranslation } from 'react-i18next';


interface BusData{
    serialNumber: string,
    brand: string, 
    status : keyof typeof status | '',
    assignedRoute: string,
    assignedDriver: string

}
//======================================================================================
//? AddBus
//======================================================================================
const AddBus = ({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) => {
  const { t } = useTranslation('buses');
  const [formData, setFormData] = useState<BusData>({
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

  ///-------------------------------------------------------------------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    fetchRoutesAndDrivers();
  }, []);

  ///-------------------------------------------------------------------------
  // get all drivers and routes , so  the admin can set the association between the (driver, bus, route)
  const fetchRoutesAndDrivers = async () => {
    setLoadingDropdowns(true);
    try {
      const [routesResponse, driversResponse] = await Promise.all([
        axios.get('http://localhost:3001/api/user/routes/all', { withCredentials: true , headers: {'Content-Type': 'application/json',}, }),
        axios.get('http://localhost:3001/api/admin/drivers/fetch', { withCredentials: true , headers: {'Content-Type': 'application/json',},})
      ]);
      
      console.log('Routes response:', JSON.stringify(routesResponse.data, null, 2));
      console.log('Drivers response:', JSON.stringify(driversResponse.data, null, 2));
      console.log('Routes array:', JSON.stringify(routesResponse.data.data || [], null, 2));
      console.log('Drivers array:', JSON.stringify(driversResponse.data.data || [], null, 2));
      
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
      await axios.post('http://localhost:3001/api/admin/bus/add', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || t('addForm.error'));
    } finally {
      setLoading(false);
    }
  };

  //======================================================================================
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{t('addForm.title')}</h2>

        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {t('addForm.serialNumber')}
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
              {t('addForm.brand')}
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
              {t('addForm.assignedRoute')}
            </label>
            {loadingDropdowns ? (
              <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100">
                {t('addForm.loadingRoutes')}
              </div>
            ) : (
              <select
                name="assignedRoute"
                value={formData.assignedRoute}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">{t('addForm.selectRoute')}</option>
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
              {t('addForm.assignedDriver')}
            </label>
            {loadingDropdowns ? (
              <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100">
                {t('addForm.loadingDrivers')}
              </div>
            ) : (
              <select
                name="assignedDriver"
                value={formData.assignedDriver}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">{t('addForm.selectDriver')}</option>
                {drivers.map((driver: any) => (
                  <option key={`driver-${driver.id }`} value={driver.id}>
                    {driver.name || driver.email || `Driver ${driver.id}`}
                  </option>
                ))}
              </select>
            )}
          </div>
        
        {/* --------------------------------------------------------------------------------------- */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {t('addForm.status')}
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{t('addForm.selectStatus')}</option>
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
              {t('addForm.cancel')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
              style= {{background: COLORS.burgundy}}
            >
              {loading ? t('addForm.loading') : t('addForm.submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBus;
