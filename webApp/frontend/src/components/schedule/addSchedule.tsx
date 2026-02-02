//======================================================================================
//? Importing
//======================================================================================
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

import { COLORS } from '../../styles/colorPalette';

//======================================================================================
//? Types
//======================================================================================

type ServicePattern = {
  servicePatternId: string;
  title: string;
};

type AddScheduleProps = {
  open: boolean;
  backendBaseUrl: string;
  onClose: () => void;
  onSuccess: (message: string) => void;
  onRefresh: () => Promise<void>;
};

//======================================================================================
//? Component
//======================================================================================

const AddSchedule: React.FC<AddScheduleProps> = ({ open, backendBaseUrl, onClose, onSuccess, onRefresh }) => {
  const { t, i18n } = useTranslation(['busScedule', 'translation']);

  //====================================================================================
  //? State
  //====================================================================================

  const [date, setDate] = useState('');
  const [servicePatternId, setServicePatternId] = useState('');
  const [patterns, setPatterns] = useState<ServicePattern[]>([]);
  const [loadingPatterns, setLoadingPatterns] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  //====================================================================================
  //? Effects
  //====================================================================================

  useEffect(() => {
    if (!open) return;
    void fetchPatterns();
  }, [open]);

  //====================================================================================
  //? Functions
  //====================================================================================

  const fetchPatterns = async () => {
    setLoadingPatterns(true);
    setError('');
    try {
      const res = await axios.get(`${backendBaseUrl}/api/admin/service-pattern/fetch`, { withCredentials: true });
      const rows: ServicePattern[] = Array.isArray(res.data?.data) ? res.data.data : [];
      setPatterns(rows);
    } catch (e: any) {
      setError(e?.message || t('addForm.error'));
      setPatterns([]);
    } finally {
      setLoadingPatterns(false);
    }
  };

  //====================================================================================
  //? UI
  //====================================================================================

  const resetAndClose = () => {
    setDate('');
    setServicePatternId('');
    setError('');
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post(
        `${backendBaseUrl}/api/admin/schedule/add`,
        { date, servicePatternId },
        { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
      );

      onSuccess(t('success.added'));
      resetAndClose();
      await onRefresh();
    } catch (err: any) {
      const messageKey = err?.response?.data?.message;
      setError(messageKey ? i18n.t(messageKey) : t('addForm.error'));
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{t('addForm.title')}</h2>
          <button onClick={resetAndClose} className="text-gray-500 hover:text-gray-700">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {error ? <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div> : null}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {t('addForm.date')}
              <span className="text-red-600"> *</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(ev) => setDate(ev.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {t('addForm.servicePattern')}
              <span className="text-red-600"> *</span>
            </label>
            {loadingPatterns ? (
              <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100">{t('addForm.loadingServicePatterns')}</div>
            ) : (
              <select
                value={servicePatternId}
                onChange={(ev) => setServicePatternId(ev.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{t('addForm.selectServicePattern')}</option>
                {patterns.map((p) => (
                  <option key={p.servicePatternId} value={p.servicePatternId}>
                    {p.title}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <button type="button" onClick={resetAndClose} className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
              {t('addForm.cancel')}
            </button>
            <button
              type="submit"
              disabled={loading || loadingPatterns}
              className="px-4 py-2 text-white rounded-md hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-900 disabled:opacity-50"
              style={{ background: COLORS.burgundy }}
            >
              {loading ? t('addForm.loading') : t('addForm.submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSchedule;

