//======================================================================================
//? Importing
//======================================================================================

import React, { Fragment, useMemo } from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

import { COLORS } from '../../styles/colorPalette';

import type { ScheduleRecord } from './updateSchedule';
import type { ScheduleResponseRow, ScheduleRouteRow, ScheduleTrip, SelectedCell } from '../../types/schedule';

//======================================================================================
//? Types
//======================================================================================

type ScheduleTimelineTableProps = {
  schedules: ScheduleResponseRow[];
  routesList: ScheduleRouteRow[];
  selectedCell: SelectedCell | null;
  setSelectedCell: (next: SelectedCell | null) => void;

  onOpenAddTrip: () => void;
  onOpenRemoveTrip: (detailedScheduleId: string, tripInfo: string) => void;

  onEditSchedule: (record: ScheduleRecord) => void;
  onRemoveSchedule: (scheduleId: string, scheduleInfo: string) => void;

  t: (key: string, options?: Record<string, unknown>) => string;
};

//======================================================================================
//? Component
//======================================================================================

const ScheduleTimelineTable: React.FC<ScheduleTimelineTableProps> = ({
  schedules,
  routesList,
  selectedCell,
  setSelectedCell,
  onOpenAddTrip,
  onOpenRemoveTrip,
  onEditSchedule,
  onRemoveSchedule,
  t,
}) => {
  const routeMapFallback = useMemo(() => {
    const routeMap = new Map<string, { id: string; title: string; color?: string }>();

    for (const s of schedules) {
      for (const row of s.timeline || []) {
        for (const trip of row.trips || []) {
          const r = trip.route || (trip.routeId ? { id: trip.routeId, title: trip.routeId } : null);
          if (r && !routeMap.has(r.id)) routeMap.set(r.id, r);
        }
      }
    }

    return Array.from(routeMap.values());
  }, [schedules]);

  return (
    <div className="mt-6 flex flex-col gap-10">
      {schedules.map((s) => {
        const routes = (routesList.length > 0 ? routesList : routeMapFallback).sort((a, b) =>
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

        const isSelected = (time: string, routeId: string) =>
          Boolean(
            selectedCell &&
              selectedCell.scheduleId === s.scheduleId &&
              selectedCell.time === time &&
              selectedCell.routeId === routeId
          );

        const canAddTripInThisSchedule = Boolean(selectedCell && selectedCell.scheduleId === s.scheduleId);

        const isSelectedRow = (time: string) =>
          Boolean(selectedCell && selectedCell.scheduleId === s.scheduleId && selectedCell.time === time);

        const isSelectedRoute = (routeId: string) =>
          Boolean(selectedCell && selectedCell.scheduleId === s.scheduleId && selectedCell.routeId === routeId);

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
                    onClick={onOpenAddTrip}
                    disabled={!canAddTripInThisSchedule}
                    className="px-3 py-1.5 text-white rounded-md hover:bg-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: COLORS.burgundy }}
                    title={canAddTripInThisSchedule ? t('actions.newTrips') : t('actions.selectCellToAddTrip')}
                  >
                    {t('actions.newTrips')}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (!selectedCell || selectedCell.scheduleId !== s.scheduleId) return;
                      const byRoute = tripLookup.get(selectedCell.time) || new Map<string, ScheduleTrip>();
                      const trip = byRoute.get(selectedCell.routeId);
                      if (!trip?.detailedScheduleId) return;

                      const routeTitle = selectedCell.routeTitle || selectedCell.routeId;
                      const tripInfo = `${s.day} | ${dateText} | ${routeTitle} | ${String(selectedCell.time).slice(0, 5)}`;
                      onOpenRemoveTrip(trip.detailedScheduleId, tripInfo);
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
                    onClick={() => onEditSchedule(scheduleRecord)}
                    className="border border-gray-300 rounded-md p-1.5 bg-white text-blue-600 hover:text-blue-900 hover:bg-gray-50"
                    title={t('actions.edit')}
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const scheduleInfo = `${s.day} | ${dateText} | ${patternTitle}`;
                      onRemoveSchedule(s.scheduleId, scheduleInfo);
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
                        <th className="border border-gray-200 px-3 py-2 text-center bg-white transition-colors">
                          {t('table.driver')}
                        </th>
                        <th className="border border-gray-200 px-3 py-2 text-center bg-white transition-colors">
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

                          const baseCellClass =
                            'border border-gray-200 px-3 py-2 bg-white whitespace-pre-line cursor-pointer select-none transition-colors duration-150';
                          const cellStyle = (activeRow || activeCol) && !activeCell ? { backgroundColor: `${COLORS.navbar}33` } : undefined;
                          const activeCellStyle = activeCell ? { backgroundColor: `${COLORS.navbar}66` } : undefined;
                          const ringClass = activeCell ? 'ring-2 ring-inset ring-[#DCC4AC]' : '';

                          return (
                            <Fragment key={`${row.time}-${r.id}`}>
                              <td
                                className={`${baseCellClass} ${ringClass}`}
                                style={activeCellStyle ?? cellStyle}
                                onClick={() => {
                                  const clickedCell: SelectedCell = {
                                    scheduleId: s.scheduleId,
                                    time: row.time,
                                    routeId: r.id,
                                    routeTitle: r.title,
                                  };
                                  const same =
                                    selectedCell &&
                                    selectedCell.scheduleId === clickedCell.scheduleId &&
                                    selectedCell.time === clickedCell.time &&
                                    selectedCell.routeId === clickedCell.routeId;

                                  setSelectedCell(same ? null : clickedCell);
                                }}
                              >
                                {driverText}
                              </td>

                              <td
                                className={`${baseCellClass} ${ringClass} whitespace-normal`}
                                style={activeCellStyle ?? cellStyle}
                                onClick={() => {
                                  const clickedCell: SelectedCell = {
                                    scheduleId: s.scheduleId,
                                    time: row.time,
                                    routeId: r.id,
                                    routeTitle: r.title,
                                  };
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
  );
};

export default ScheduleTimelineTable;
