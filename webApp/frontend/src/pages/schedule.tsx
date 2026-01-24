//======================================================================================
//? Importing
//======================================================================================
import axios from 'axios';
import { Fragment, useEffect, useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

import AddSchedule from '../components/schedule/addSchedule';
import UpdateSchedule from '../components/schedule/updateSchedule';
import type { ScheduleRecord } from '../components/schedule/updateSchedule';
import RemoveSchedule from '../components/schedule/removeSchedule';
import AddScheduledTrip from '../components/schedule/addScheduledTrip';
import RemoveScheduledTrip from '../components/schedule/removeScheduledTrip';

import { COLORS } from '../styles/colorPalette';

//======================================================================================

//======================================================================================
//? Page
//======================================================================================

const BusSchedulePage = () => {

  const { t } = useTranslation('busScedule');

  const backendBaseUrl = 'http://localhost:3001';

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

  type RouteRow = {
    id: string;
    title: string;
    color?: string;
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
  const [routesList, setRoutesList] = useState<RouteRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');

  // UI state for CRUD modals
  const [showAdd, setShowAdd] = useState(false);
  const [editRecord, setEditRecord] = useState<ScheduleRecord | null>(null);
  const [removeId, setRemoveId] = useState<string | null>(null);
  const [removeInfo, setRemoveInfo] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  //====================================================================================
  //? Scheduled Trips Modals (Add / Remove)
  //====================================================================================

  const [showAddTrip, setShowAddTrip] = useState(false);

  const [showRemoveTrip, setShowRemoveTrip] = useState(false);
  const [removeTripId, setRemoveTripId] = useState<string | null>(null);
  const [removeTripInfo, setRemoveTripInfo] = useState('');

  const [selectedCell, setSelectedCell] = useState<{
    scheduleId: string;
    time: string;
    routeId: string;
    routeTitle?: string;
  } | null>(null);

  //====================================================================================
  //? Cell selection (visualization)
  // Selected cell drives the row/column highlight in the table
  //====================================================================================

  //====================================================================================
  //? Derived
  //====================================================================================

  const endpoint = useMemo(() => {
    // endpoint changes when date filter changes
    const base = `${backendBaseUrl}/api/admin/schedule/fetch`;
    if (!selectedDate) return base;
    const qs = new URLSearchParams({ date: selectedDate });
    return `${base}?${qs.toString()}`;
  }, [selectedDate]);

  //====================================================================================
  //? Data fetching
  // keep refresh functions in one place so CRUD modals can call them
  //====================================================================================

  const refreshSchedules = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(endpoint, { withCredentials: true });
      const rows: ScheduleResponseRow[] = Array.isArray(res.data?.data) ? res.data.data : [];
      setSchedules(rows);
    } catch (e: any) {
      setError(e?.message || t('states.loadError'));
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshRoutes = async () => {
    // we fetch ALL routes so the table renders every column even if there are no trips
    try {
      const res = await axios.get(`${backendBaseUrl}/api/user/routes/all`, { withCredentials: true });
      const rows: RouteRow[] = Array.isArray(res.data?.data) ? res.data.data : [];
      setRoutesList(rows);
    } catch {
      setRoutesList([]);
    }
  };

  //====================================================================================
  //? Fetching
  //====================================================================================

  useEffect(() => {
    void refreshSchedules();
  }, [endpoint]);

  useEffect(() => {
    void refreshRoutes();
  }, []);

  //======================================================================================
  //? UI
  //======================================================================================

  return (
    <>
      <div className="p-6">
        {successMessage ? (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md">
            {successMessage}
          </div>
        ) : null}

        <h1 className="text-3xl font-semibold text-gray-800 mt-10 ml-2">{t('title')}</h1>

        <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div />

          <div className="flex items-end gap-3">
            <div className="flex flex-col">
              <label className="text-sm text-gray-600">{t('filters.filterByDate')}</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border rounded-md px-3 py-2 h-10"
              />
            </div>
            {selectedDate ? (
              <button
                type="button"
                onClick={() => setSelectedDate('')}
                className="border rounded-md px-3 py-2 hover:bg-gray-50 h-10"
              >
                {t('filters.clear')}
              </button>
            ) : null}

            <button
              type="button"
              onClick={() => setShowAdd(true)}
              className="px-4 py-2 text-white rounded-md hover:bg-red-900 h-10"
              style={{ background: COLORS.burgundy }}
            >
              {t('actions.addNew')}
            </button>
          </div>
        </div>

        <AddSchedule
          open={showAdd}
          backendBaseUrl={backendBaseUrl}
          onClose={() => setShowAdd(false)}
          onSuccess={(message) => {
            setSuccessMessage(message);
            setTimeout(() => setSuccessMessage(''), 5000);
          }}
          onRefresh={refreshSchedules}
        />

        <UpdateSchedule
          open={Boolean(editRecord)}
          backendBaseUrl={backendBaseUrl}
          record={editRecord}
          onClose={() => setEditRecord(null)}
          onSuccess={(message) => {
            setSuccessMessage(message);
            setTimeout(() => setSuccessMessage(''), 5000);
          }}
          onRefresh={refreshSchedules}
        />

        <RemoveSchedule
          open={Boolean(removeId)}
          backendBaseUrl={backendBaseUrl}
          scheduleId={removeId}
          scheduleInfo={removeInfo}
          onClose={() => setRemoveId(null)}
          onSuccess={(message) => {
            setSuccessMessage(message);
            setTimeout(() => setSuccessMessage(''), 5000);
          }}
          onRefresh={refreshSchedules}
        />

        <AddScheduledTrip
          open={showAddTrip}
          backendBaseUrl={backendBaseUrl}
          selectedCell={selectedCell}
          onClose={() => setShowAddTrip(false)}
          onSuccess={(message) => {
            setSuccessMessage(message);
            setTimeout(() => setSuccessMessage(''), 5000);
          }}
          onRefresh={refreshSchedules}
        />

        {/*====================================================================================
          ? Remove scheduled trip
          ====================================================================================*/}
        <RemoveScheduledTrip
          open={showRemoveTrip}
          backendBaseUrl={backendBaseUrl}
          detailedScheduleId={removeTripId}
          tripInfo={removeTripInfo}
          onClose={() => {
            setShowRemoveTrip(false);
            setRemoveTripId(null);
            setRemoveTripInfo('');
          }}
          onSuccess={(message) => {
            setSuccessMessage(message);
            setTimeout(() => setSuccessMessage(''), 5000);
          }}
          onRefresh={refreshSchedules}
        />

        {loading ? (
          <div className="mt-8 text-gray-600">{t('states.loading')}</div>
        ) : error ? (
          <div className="mt-8 text-red-600">{error}</div>
        ) : schedules.length === 0 ? (
          <div className="mt-8 text-gray-600">{t('states.empty')}</div>
        ) : (
          <div className="mt-6 flex flex-col gap-10">
            {schedules.map((s) => {
              //------------------------------------------------------------------------------------
              // build route columns
              // prefer the global routesList (all routes). if it's empty, fallback to routes seen in trips
              //------------------------------------------------------------------------------------
              const routeMap = new Map<string, { id: string; title: string; color?: string }>();
              for (const row of s.timeline || []) {
                for (const trip of row.trips || []) {
                  const r = trip.route || (trip.routeId ? { id: trip.routeId, title: trip.routeId } : null);
                  if (r && !routeMap.has(r.id)) routeMap.set(r.id, r);
                }
              }

              const routes = (routesList.length > 0 ? routesList : Array.from(routeMap.values())).sort((a, b) =>
                (a.title || '').localeCompare(b.title || '')
              );

              const tripLookup = new Map<string, Map<string, ScheduleTrip>>();
              for (const row of s.timeline || []) {
                const perRoute = new Map<string, ScheduleTrip>();
                for (const trip of row.trips || []) {
                  if (!trip.routeId) continue;
                  if (!perRoute.has(trip.routeId)) perRoute.set(trip.routeId, trip);
                }
                tripLookup.set(row.time, perRoute);
              }

              //------------------------------------------------------------------------------------
              // selection helpers (row + column + cell)
              //------------------------------------------------------------------------------------

              const isSelected = (time: string, routeId: string) =>
                Boolean(selectedCell &&
                  selectedCell.scheduleId === s.scheduleId &&
                  selectedCell.time === time &&
                  selectedCell.routeId === routeId);

              const canAddTripInThisSchedule = Boolean(selectedCell && selectedCell.scheduleId === s.scheduleId);

              // True for all cells in the same time row
              const isSelectedRow = (time: string) => Boolean(selectedCell &&
                 selectedCell.scheduleId === s.scheduleId && 
                 selectedCell.time === time);

              //True for all cells in the same route column (and optionally the headers)
              const isSelectedRoute = (routeId: string) =>
                Boolean(selectedCell &&
                 selectedCell.scheduleId === s.scheduleId &&
                 selectedCell.routeId === routeId);

              const dateText = s.date ? new Date(s.date).toLocaleDateString() : '';
              const patternTitle = s.servicePattern?.title || s.servicePatternId;

              const scheduleRecord: ScheduleRecord = {
                scheduleId: s.scheduleId,
                date: s.date,
                day: s.day,
                servicePatternId: s.servicePatternId,
              };

              return (
                <div key={s.scheduleId} className="rounded-lg overflow-hidden bg-white shadow-md">
                  <div className="px-4 py-3 bg-gray-100 border-b border-gray-200 text-gray-900 font-semibold">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span>{s.day}</span>
                      <span className="text-gray-400">|</span>
                      <span>{dateText}</span>
                      <span className="text-gray-400">|</span>
                      <span className="font-semibold">{patternTitle}</span>

                      <div className="ml-auto flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setShowAddTrip(true)}
                          disabled={!canAddTripInThisSchedule}
                          className="px-3 py-1.5 text-white rounded-md hover:bg-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ background: COLORS.burgundy }}
                          title={canAddTripInThisSchedule ? t('actions.newTrips') : t('actions.selectCellToAddTrip')}
                        >
                          {t('actions.newTrips')}
                        </button>

                        {/*====================================================================================
                          ? Remove scheduled trip (selected cell must contain a trip)
                          ====================================================================================*/}
                        <button
                          type="button"
                          onClick={() => {
                            if (!selectedCell || selectedCell.scheduleId !== s.scheduleId) return;
                            const byRoute = tripLookup.get(selectedCell.time) || new Map<string, ScheduleTrip>();
                            const trip = byRoute.get(selectedCell.routeId);
                            if (!trip?.detailedScheduleId) return;

                            setRemoveTripId(trip.detailedScheduleId);
                            const routeTitle = selectedCell.routeTitle || selectedCell.routeId;
                            setRemoveTripInfo(`${s.day} | ${dateText} | ${routeTitle} | ${String(selectedCell.time).slice(0, 5)}`);
                            setShowRemoveTrip(true);
                          }}
                          disabled={
                            !selectedCell ||
                            selectedCell.scheduleId !== s.scheduleId ||
                            !((tripLookup.get(selectedCell.time) || new Map<string, ScheduleTrip>()).get(selectedCell.routeId)?.detailedScheduleId)
                          }
                          className="px-3 py-1.5 border border-gray-300 rounded-md bg-white text-red-600 hover:text-red-900 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          title={t('actions.removeTrip')}
                        >
                          {t('actions.removeTrip')}
                        </button>

                        <button
                          type="button"
                          onClick={() => setEditRecord(scheduleRecord)}
                          className="border border-gray-300 rounded-md p-1.5 bg-white text-blue-600 hover:text-blue-900 hover:bg-gray-50"
                          title={t('actions.edit')}
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setRemoveId(s.scheduleId);
                            setRemoveInfo(`${s.day} | ${dateText} | ${patternTitle}`);
                          }}
                          className="border border-gray-300 rounded-md p-1.5 bg-white text-red-600 hover:text-red-900 hover:bg-gray-50"
                          title={t('actions.delete')}
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="w-full overflow-x-auto">
                    <table className="min-w-[900px] w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="border border-gray-200 px-3 py-2 bg-white" rowSpan={2}>
                            {t('table.time')}
                          </th>
                          {routes.map((r) => (
                            <th
                              key={r.id}
                              className="border border-gray-200 px-3 py-2 text-center bg-white transition-colors"
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
                              <th
                                className="border border-gray-200 px-3 py-2 text-center bg-white transition-colors"
                              >
                                {t('table.driver')}
                              </th>
                              <th
                                className="border border-gray-200 px-3 py-2 text-center bg-white transition-colors"
                              >
                                {t('table.bus')}
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
                              <td
                                className="border border-gray-200 px-3 py-2 font-medium bg-white transition-colors"
                                style={isSelectedRow(row.time) ? { backgroundColor: `${COLORS.navbar}33` } : undefined}
                              >
                                {row.time.slice(0, 5)}
                              </td>


                              {routes.map((r) => {
                                const trip = byRoute.get(r.id);
                                const driverText = trip?.driver ? `${trip.driver.name}\n${trip.driver.id}` : '';
                                const busText = trip?.bus ? `${trip.bus.id}` : '';

                                const activeRow = isSelectedRow(row.time);
                                const activeCol = isSelectedRoute(r.id);
                                const activeCell = isSelected(row.time, r.id);

                                const baseCellClass = `border border-gray-200 px-3 py-2 bg-white whitespace-pre-line cursor-pointer select-none transition-colors duration-150`;
                                const cellStyle = (activeRow || activeCol) && !activeCell ? { backgroundColor: `${COLORS.navbar}33` } : undefined;
                                const activeCellStyle = activeCell ? { backgroundColor: `${COLORS.navbar}66` } : undefined;
                                const ringClass = activeCell ? 'ring-2 ring-inset ring-[#DCC4AC]' : '';

                                return (
                                  <Fragment key={`${row.time}-${r.id}`}>
                                    <td
                                      className={`${baseCellClass} ${ringClass}`}
                                      style={activeCellStyle ?? cellStyle}
                                      onClick={() => {
                                        const clickedCell = { scheduleId: s.scheduleId, time: row.time, routeId: r.id, routeTitle: r.title };
                                        const same =
                                          selectedCell &&
                                          selectedCell.scheduleId === clickedCell.scheduleId &&
                                          selectedCell.time === clickedCell.time &&
                                          selectedCell.routeId === clickedCell.routeId;
                                          
                                        // If the same cell is clicked, toggle off setSelectedCell
                                        setSelectedCell(same ? null : clickedCell);
                                      }}
                                    >
                                      {driverText}
                                    </td>
                                    <td
                                      className={`${baseCellClass} ${ringClass} whitespace-normal`}
                                      style={activeCellStyle ?? cellStyle}
                                      onClick={() => {
                                        const clickedCell = { scheduleId: s.scheduleId, time: row.time, routeId: r.id, routeTitle: r.title };
                                        const same =
                                          selectedCell &&
                                          selectedCell.scheduleId === clickedCell.scheduleId &&
                                          selectedCell.time === clickedCell.time &&
                                          selectedCell.routeId === clickedCell.routeId;
                                        setSelectedCell(same ? null : clickedCell);
                                      }}
                                    >
                                      {busText}
                                    </td>
                                  </Fragment>
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
