//===============================================================================================
//? Importing
//===============================================================================================
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';

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

//===============================================================================================
//? Page
//===============================================================================================

const ServicePatterns = () => {
  const [patterns, setPatterns] = useState<ServicePatternDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //=============================================================================================
  //? Fetching
  //=============================================================================================

  useEffect(() => {
    let cancelled = false;

    const fetchPatterns = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(`${backendBaseUrl}/api/admin/service-patterns`, {
          withCredentials: true,
        });

        const rows: ServicePatternDto[] = Array.isArray(res.data?.data) ? res.data.data : [];
        if (!cancelled) {
          setPatterns(rows);
        }
      } catch (e) {
        if (!cancelled) {
          setError('Failed to load service patterns');
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

  const sorted = useMemo(() => {
    return [...patterns].sort((a, b) => a.servicePatternId.localeCompare(b.servicePatternId));
  }, [patterns]);

  //=============================================================================================
  //? UI
  //=============================================================================================

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold text-gray-800 mb-10 mt-10 ml-2">Service Patterns</h1>
      <p className="text-gray-600 ml-2">For each day category, the pattern specifies the scheduled operating time slots when the service is available</p>

      <div className="mt-10">
        {loading && (
          <div className="text-gray-600">Loading...</div>
        )}

        {!loading && error && (
          <div className="text-red-600">{error}</div>
        )}

        {!loading && !error && sorted.length === 0 && (
          <div className="text-gray-600">No service patterns found</div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((p) => (
            <div key={p.servicePatternId} className="rounded-lg bg-white shadow-md overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-start justify-between">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">{p.servicePatternId}</span>
                  <span className="text-lg font-semibold text-gray-900">{p.title}</span>
                </div>
                <span className="text-sm text-gray-500">{p.operatingHours.length} hours</span>
              </div>

              <div className="p-4">
                <div className="rounded-md border border-gray-200 overflow-hidden">
                  <div className="px-3 py-2 bg-white border-b border-gray-200 text-sm font-semibold text-gray-900">
                    Operating hours
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
