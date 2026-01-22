//=========================================================================================================
//? Importing
//=========================================================================================================

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { shiftType, weekDays } from '../../enums/scheduleEnums';

import { COLORS } from '../../styles/colorPalette';
import { useTranslation } from 'react-i18next';

interface UpdateScheduleProps {
  onClose: () => void;
  onSuccess: () => void;
  scheduleId: string;
}

interface ScheduleData {
  id: string;
  date: string;
  day: string;
  shiftType: string;
  driverId: string;
  routeId: string;
  busId: string;
}

//=========================================================================================================
//? Update Schedule
//=========================================================================================================

const UpdateSchedule: React.FC<UpdateScheduleProps> = ({ onClose, onSuccess, scheduleId }) => {
  const { t } = useTranslation('busScedule');
  const [scheduleData, setScheduleData] = useState<ScheduleData>({
    id: scheduleId,
    date: '',
    day: '',
    shiftType: '',
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

  // Fetch dropdown data and current schedule on component mount
  useEffect(() => {
    fetchData();
  }, [scheduleId]);

  const fetchData = async () => {
    setLoadingDropdowns(true);
    try {
      const [driversRes, routesRes, busesRes, scheduleRes] = await Promise.all([
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
        }),
        axios.get('http://localhost:3001/api/admin/schedule/fetch', { 
          withCredentials: true, 
          headers: { 'Content-Type': 'application/json' } 
        })
      ]);


      setDrivers(driversRes.data.data || []);
      setRoutes(routesRes.data.data || []);
      setBuses(busesRes.data.data || []);

      // Find the current schedule record ---------------------------------------------------------------------------------------
      const currentSchedule = scheduleRes.data.data?.find((s: any) => s.id === scheduleId);
      if (currentSchedule) {
        setScheduleData({
          id: currentSchedule.id,
          date: currentSchedule.date?.split('T')[0] || '',
          day: currentSchedule.day || '',
          shiftType: currentSchedule.shiftType || '',
          driverId: currentSchedule.driverId || '',
          routeId: currentSchedule.routeId || '',
          busId: currentSchedule.busId || ''
        });
      }
      //=================================================================================================
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(t('updateForm.loadError'));
    } finally {
      setLoadingDropdowns(false);
    }
  };
  //=================================================================================================

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
      const dayNames = Object.values(weekDays) as string[];
      const dayName = String(dayNames[(dayIndex + 6) % 7]); // Adjust for Monday start
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

    // upate the data of the record 
    try {
      console.log('Form data being sent to backend:', JSON.stringify(scheduleData, null, 2));
      await axios.patch('http://localhost:3001/api/admin/schedule/update', scheduleData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });

      onSuccess();
      onClose();
    //=================================================================================================
    } catch (err: any) {
      setError(err.response?.data?.message || t('updateForm.error'));
      console.error('Error updating schedule:', err);
    } finally {
      setLoading(false);
    }
  };

  //=================================================================================================
  //===============================================================================================================
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{t('updateForm.title')}</h2>
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
              {t('updateForm.date')}
            </label>
            <input
              type="date"
              name="date"
              value={scheduleData.date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Day Field */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {t('updateForm.day')}
            </label>
            <input
              type="text"
              name="day"
              value={scheduleData.day}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
            />
          </div>

          {/* Shift Type Field */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {t('updateForm.shiftType')}
            </label>
            <select
              name="shiftType"
              value={scheduleData.shiftType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{t('updateForm.selectShift')}</option>
              {(Object.values(shiftType) as string[]).map((s) => (
                <option key={`shift-${s}`} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Driver Field */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {t('updateForm.driver')}
            </label>
            {loadingDropdowns ? (
              <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100">
                {t('updateForm.loadingDrivers')}
              </div>
            ) : (
              <select
                name="driverId"
                value={scheduleData.driverId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{t('updateForm.selectDriver')}</option>
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
              {t('updateForm.route')}
            </label>
            {loadingDropdowns ? (
              <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100">
                {t('updateForm.loadingRoutes')}
              </div>
            ) : (
              <select
                name="routeId"
                value={scheduleData.routeId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{t('updateForm.selectRoute')}</option>
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
              {t('updateForm.bus')}
            </label>
            {loadingDropdowns ? (
              <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100">
                {t('updateForm.loadingBuses')}
              </div>
            ) : (
              <select
                name="busId"
                value={scheduleData.busId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{t('updateForm.selectBus')}</option>
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
              {t('updateForm.cancel')}
            </button>
            <button
              type="submit"
              disabled={loading || loadingDropdowns}
              className="px-4 py-2 text-white rounded-md hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-900 disabled:opacity-50"
              style= {{background: COLORS.burgundy}}
            >
              {loading ? t('updateForm.loading') : t('updateForm.submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateSchedule;
