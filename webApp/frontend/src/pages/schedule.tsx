//======================================================================================
//? Importing
//======================================================================================
import axios from 'axios';
import { Fragment, useEffect, useMemo, useState } from 'react';

//======================================================================================

//======================================================================================
//? Page
//======================================================================================

const BusSchedulePage = () => {

  //====================================================================================
  //? Types
  //====================================================================================

  type ScheduleTrip = {
    detailedScheduleId: string;
    scheduleId: string;
    time: string;
    routeId: string;
    driverId: string;
    busId: string;
    route?: { id: string; title: string; color?: string };
    driver?: { id: string; name: string };
    bus?: { id: string; plate: string; brand?: string; status?: string };
  };

  type ScheduleTimelineRow = {
    time: string;
    trips: ScheduleTrip[];
  };

  type ScheduleResponseRow = {
    scheduleId: string;
    date: string;
    day: string;
    servicePatternId: string;
    servicePattern?: { servicePatternId: string; title: string; operatingHours?: Array<{ operatingHourId: string; hour: string }> };
    timeline: ScheduleTimelineRow[];
    otherTrips: ScheduleTrip[];
  };

  //====================================================================================
  //? State
  //====================================================================================

  const [schedules, setSchedules] = useState<ScheduleResponseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');

  //====================================================================================
  //? Derived
  //====================================================================================

  const endpoint = useMemo(() => {
    const base = 'http://localhost:3001/api/admin/schedule/fetch';
    if (!selectedDate) return base;
    const qs = new URLSearchParams({ date: selectedDate });
    return `${base}?${qs.toString()}`;
  }, [selectedDate]);

  //====================================================================================
  //? Fetching
  //====================================================================================

  useEffect(() => {
    let cancelled = false;

    const fetchSchedules = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(endpoint, { withCredentials: true });
        const rows: ScheduleResponseRow[] = Array.isArray(res.data?.data) ? res.data.data : [];
        if (!cancelled) {
          setSchedules(rows);
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message || 'Failed to load schedules');
          setSchedules([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchSchedules();

    return () => {
      cancelled = true;
    };
  }, [endpoint]);

  //======================================================================================
  //? UI
  //======================================================================================

  return (
    <>
      <div className="p-6">
        <h1 className="text-3xl font-semibold text-gray-800 mt-10 ml-2">Schedule</h1>

        <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div />

          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <label className="text-sm text-gray-600">Filter by date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border rounded-md px-3 py-2"
              />
            </div>
            {selectedDate ? (
              <button
                type="button"
                onClick={() => setSelectedDate('')}
                className="border rounded-md px-3 py-2 hover:bg-gray-50"
              >
                Clear
              </button>
            ) : null}
          </div>
        </div>

        {loading ? (
          <div className="mt-8 text-gray-600">Loading...</div>
        ) : error ? (
          <div className="mt-8 text-red-600">{error}</div>
        ) : schedules.length === 0 ? (
          <div className="mt-8 text-gray-600">No schedules found</div>
        ) : (
          <div className="mt-6 flex flex-col gap-10">
            {schedules.map((s) => {
              const routeMap = new Map<string, { id: string; title: string; color?: string }>();
              for (const row of s.timeline || []) {
                for (const trip of row.trips || []) {
                  const r = trip.route || (trip.routeId ? { id: trip.routeId, title: trip.routeId } : null);
                  if (r && !routeMap.has(r.id)) routeMap.set(r.id, r);
                }
              }

              const routes = Array.from(routeMap.values()).sort((a, b) => (a.title || '').localeCompare(b.title || ''));

              const tripLookup = new Map<string, Map<string, ScheduleTrip>>();
              for (const row of s.timeline || []) {
                const perRoute = new Map<string, ScheduleTrip>();
                for (const trip of row.trips || []) {
                  if (!trip.routeId) continue;
                  if (!perRoute.has(trip.routeId)) perRoute.set(trip.routeId, trip);
                }
                tripLookup.set(row.time, perRoute);
              }

              const dateText = s.date ? new Date(s.date).toLocaleDateString() : '';
              const patternTitle = s.servicePattern?.title || s.servicePatternId;

              return (
                <div key={s.scheduleId} className="rounded-lg overflow-hidden bg-white shadow-md">
                  <div className="px-4 py-3 bg-gray-100 border-b border-gray-200 text-gray-900 font-semibold">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span>{s.day}</span>
                      <span className="text-gray-400">|</span>
                      <span>{dateText}</span>
                      <span className="text-gray-400">|</span>
                      <span className="font-semibold">{patternTitle}</span>
                    </div>
                  </div>

                  <div className="w-full overflow-x-auto">
                    <table className="min-w-[900px] w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="border border-gray-200 px-3 py-2 bg-white" rowSpan={2}>
                            Time
                          </th>
                          {routes.map((r) => (
                            <th
                              key={r.id}
                              className="border border-gray-200 px-3 py-2 text-center bg-white"
                              colSpan={2}
                              style={{ borderTopWidth: '4px', borderTopStyle: 'solid', borderTopColor: r.color || '#e5e7eb' }}
                            >
                              {r.title}
                            </th>
                          ))}
                        </tr>
                        <tr>
                          {routes.map((r) => (
                            <Fragment key={r.id}>
                              <th className="border border-gray-200 px-3 py-2 text-center bg-white">
                                driver
                              </th>
                              <th className="border border-gray-200 px-3 py-2 text-center bg-white">
                                bus
                              </th>
                            </Fragment>
                          ))}
                        </tr>
                      </thead>

                      <tbody>
                        {(s.timeline || []).map((row) => {
                          const byRoute = tripLookup.get(row.time) || new Map<string, ScheduleTrip>();
                          return (
                            <tr key={row.time}>
                              <td className="border border-gray-200 px-3 py-2 font-medium bg-white">{row.time.slice(0, 5)}</td>
                              {routes.map((r) => {
                                const trip = byRoute.get(r.id);
                                const driverText = trip?.driver ? `${trip.driver.name}\n${trip.driver.id}` : '';
                                const busText = trip?.bus ? `${trip.bus.id}` : '';

                                return (
                                  <>
                                    <td key={`${row.time}-${r.id}-driver`} className="border border-gray-200 px-3 py-2 whitespace-pre-line bg-white">
                                      {driverText}
                                    </td>
                                    <td key={`${row.time}-${r.id}-bus`} className="border border-gray-200 px-3 py-2 bg-white">
                                      {busText}
                                    </td>
                                  </>
                                );
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

//==============================================================================================================================
export default BusSchedulePage;
