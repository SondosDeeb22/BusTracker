//======================================================================================
//? Importing
//======================================================================================
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { COLORS } from '../../styles/colorPalette';
import { routeStatus } from '../../enums/statusEnums';
import { useTranslation } from 'react-i18next';

interface RouteData {
  title: string;
  color: string;
  totalStops: number;
  status: string;
  stations: string[];
}

interface Station {
  id: string;
  stationName: string;
}

interface AddRouteProps {
  onClose: () => void;
  onSuccess: () => void;
}

//======================================================================================
//? AddRoute
//======================================================================================
const AddRoute: React.FC<AddRouteProps> = ({ onClose, onSuccess }) => {
  const { t, i18n } = useTranslation(['routes', 'translation']);
  const [formData, setFormData] = useState<RouteData>({
    title: '',
    color: '#000000',
    totalStops: 0,
    status: '',
    stations: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stations, setStations] = useState<Station[]>([]);

  ///-------------------------------------------------------------------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStationToggle = (stationId: string) => {
    setFormData(prev => {
      const exists = prev.stations.includes(stationId);
      return {
        ...prev,
        stations: exists
          ? prev.stations.filter(id => id !== stationId)
          : [...prev.stations, stationId]
      };
    });
  };

  ///-------------------------------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        totalStops: formData.stations.length
      };

      await axios.post('http://localhost:3001/api/admin/route/add', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      const messageKey = err.response?.data?.message;
      setError(messageKey ? i18n.t(messageKey) : t('addForm.error'));
    } finally {
      setLoading(false);
    }
  };
  ///-------------------------------------------------------------------------

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/admin/stations/fetch', {
          withCredentials: true
        });
        setStations(response.data.data || response.data || []);
      } catch (err: any) {
        const messageKey = err.response?.data?.message;
        setError(messageKey ? i18n.t(messageKey) : t('addForm.stationsLoadError'));
      }
    };

    fetchStations();
  }, []);

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
              {t('addForm.titleLabel')}
              <span className="text-red-600"> *</span>
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
              {t('addForm.color')}
              <span className="text-red-600"> *</span>
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
              {t('addForm.stations')}
            </label>
            <div className="max-h-48 overflow-y-auto border rounded p-2 space-y-2">
              {stations.length === 0 && (
                <p className="text-sm text-gray-500">{t('addForm.noStations')}</p>
              )}
              {stations.map((station) => (
                <label key={station.id} className="flex items-center space-x-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={formData.stations.includes(station.id)}
                    onChange={() => handleStationToggle(station.id)}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span>{station.id} - {station.stationName}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {t('addForm.status')}
              <span className="text-red-600"> *</span>
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="">{t('addForm.selectStatus')}</option>
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
              {t('addForm.cancel')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-white rounded-md hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 disabled:opacity-50"
              style={{ backgroundColor: COLORS.burgundy }}
            >
              {loading ? t('addForm.loading') : t('addForm.submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

//======================================================================================
export default AddRoute;
