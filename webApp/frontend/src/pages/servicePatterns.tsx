//===============================================================================================
//? Importing
//===============================================================================================
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { COLORS } from '../styles/colorPalette';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import AddServicePattern from '../components/servicePatterns/addServicePattern';
import RemoveServicePattern from '../components/servicePatterns/removeServicePattern';
import UpdateServicePattern from '../components/servicePatterns/updateServicePattern';
import { useTranslation } from 'react-i18next';

//===============================================================================================
//? Types
//===============================================================================================

type OperatingHourDto = {
  operatingHourId: string;
  hour: string;
};

type ServicePatternDto = {
  servicePatternId: string;
  title: string;
  operatingHours: OperatingHourDto[];
};

//===============================================================================================
//? Constants
//===============================================================================================

const backendBaseUrl = 'http://localhost:3001';

//define when the bus system starts and stops operating
const startOperatingHour = 6;
const endOperatingHour = 23;

//define the minute label for operating hours
const startOperatingMinuteLabel = '45';
const operatingMinuteLabel = '15';

//===============================================================================================
//? Page
//===============================================================================================

const ServicePatterns = () => {
  const { t } = useTranslation('servicePatterns');
  const [patterns, setPatterns] = useState<ServicePatternDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showAddModel, setShowAddModel] = useState(false);
  const [removePattern, setRemovePattern] = useState<{ servicePatternId: string; title: string } | null>(null);
  const [editPattern, setEditPattern] = useState<ServicePatternDto | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  //=============================================================================================
  //? Fetching
  //=============================================================================================

  useEffect(() => {
    let cancelled = false;

    const fetchPatterns = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(`${backendBaseUrl}/api/admin/service-patterns/fetch`, {
          withCredentials: true,
        });

        const rows: ServicePatternDto[] = Array.isArray(res.data?.data) ? res.data.data : [];
        if (!cancelled) {
          setPatterns(rows);
        }
      } catch (e) {
        if (!cancelled) {
          setError(t('page.errors.failedToLoad'));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchPatterns();
    return () => {
      cancelled = true;
    };
  }, []);

  const refreshPatterns = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.get(`${backendBaseUrl}/api/admin/service-patterns/fetch`, {
        withCredentials: true,
      });

      const rows: ServicePatternDto[] = Array.isArray(res.data?.data) ? res.data.data : [];
      setPatterns(rows);
    } catch (e) {
      setError(t('page.errors.failedToLoad'));
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setSuccessMessage('');
    setShowAddModel(true);
  };

  const sorted = useMemo(() => {
    return [...patterns].sort((a, b) => a.servicePatternId.localeCompare(b.servicePatternId));
  }, [patterns]);

  //=============================================================================================
  //? UI
  //=============================================================================================

  return (
    <div className="p-6">
      {successMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md">
          {successMessage}
        </div>
      )}

      <h1 className="text-3xl font-semibold text-gray-800 mb-10 mt-10 ml-2">{t('page.title')}</h1>
      <p className="text-gray-600 ml-2">{t('page.subtitle')}</p>


      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={handleAddNew}
          className="px-4 py-2 text-white rounded-md hover:bg-red-900"
          style={{ background: COLORS.burgundy }}
        >
          {t('page.actions.addNew')}
        </button>
      </div>

      <AddServicePattern
        open={showAddModel}
        backendBaseUrl={backendBaseUrl}
        startOperatingHour={startOperatingHour}
        endOperatingHour={endOperatingHour}
        startOperatingMinuteLabel={startOperatingMinuteLabel}
        operatingMinuteLabel={operatingMinuteLabel}
        onClose={() => setShowAddModel(false)}
        onCreated={(message) => {
          setSuccessMessage(message);
          setTimeout(() => {
            setSuccessMessage('');
          }, 5000);
        }}
        onRefresh={refreshPatterns}
      />

      <UpdateServicePattern
        open={Boolean(editPattern)}
        backendBaseUrl={backendBaseUrl}
        pattern={editPattern}
        startOperatingHour={startOperatingHour}
        endOperatingHour={endOperatingHour}
        startOperatingMinuteLabel={startOperatingMinuteLabel}
        operatingMinuteLabel={operatingMinuteLabel}
        onClose={() => setEditPattern(null)}
        onUpdated={(message: string) => {
          setSuccessMessage(message);
          setTimeout(() => {
            setSuccessMessage('');
          }, 5000);
        }}
        onRefresh={refreshPatterns}
      />

      <RemoveServicePattern
        open={Boolean(removePattern)}
        backendBaseUrl={backendBaseUrl}
        servicePatternId={removePattern?.servicePatternId ?? null}
        title={removePattern?.title ?? null}
        onClose={() => setRemovePattern(null)}
        onDeleted={(message) => {
          setSuccessMessage(message);
          setTimeout(() => {
            setSuccessMessage('');
          }, 5000);
        }}
        onRefresh={refreshPatterns}
      />

      <div className="mt-10">
        {loading && (
          <div className="text-gray-600">{t('page.loading')}</div>
        )}

        {!loading && error && (
          <div className="text-red-600">{error}</div>
        )}

        {!loading && !error && sorted.length === 0 && (
          <div className="text-gray-600">{t('page.empty')}</div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((p) => (
            <div key={p.servicePatternId} className="rounded-lg bg-white shadow-md overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-start justify-between">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">{p.servicePatternId}</span>
                  <span className="text-lg font-semibold text-gray-900">{p.title}</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-sm text-gray-500">{t('page.hoursCount', { count: p.operatingHours.length })}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditPattern(p);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                      title={t('page.actions.edit')}
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRemovePattern({ servicePatternId: p.servicePatternId, title: p.title });
                      }}
                      className="text-red-600 hover:text-red-900"
                      title={t('page.actions.delete')}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="rounded-md border border-gray-200 overflow-hidden">
                  <div className="px-3 py-2 bg-white border-b border-gray-200 text-sm font-semibold text-gray-900">
                    {t('page.operatingHoursTitle')}
                  </div>

                  <div className="max-h-64 overflow-y-auto bg-white">
                    {p.operatingHours.map((oh) => (
                      <div key={oh.operatingHourId} className="px-3 py-2 text-sm text-gray-700 border-b border-gray-200 last:border-b-0">
                        {oh.hour}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicePatterns;
