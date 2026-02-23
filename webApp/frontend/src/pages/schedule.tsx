//======================================================================================
//? Importing
//======================================================================================
import { useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';

import AddSchedule from '../components/schedule/addSchedule';
import UpdateSchedule from '../components/schedule/updateSchedule';
import type { ScheduleRecord } from '../components/schedule/updateSchedule';
import RemoveSchedule from '../components/schedule/removeSchedule';
import AddScheduledTrip  from '../components/schedule/scheduleTrip/addScheduledTrip';
import RemoveScheduledTrip from '../components/schedule/scheduleTrip/removeScheduledTrip';

import ScheduleHeader from '../components/schedule/ScheduleHeader';
import ScheduleTimelineTable from '../components/schedule/ScheduleTimelineTable';

import { useScheduleData } from '../hooks/useScheduleData';
import { useScheduleRoutesList } from '../hooks/useScheduleRoutesList';

import type { SelectedCell } from '../types/schedule';

//======================================================================================

//======================================================================================
//? Page
//======================================================================================

const BusSchedulePage = () => {

  const { t } = useTranslation('busScedule');
  const { t: tGlobal } = useTranslation('translation');

  //====================================================================================
  //? State
  //====================================================================================

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

  const [selectedCell, setSelectedCell] = useState<SelectedCell | null>(null);

  //====================================================================================
  //? Cell selection (visualization)
  // Selected cell drives the row/column highlight in the table
  //====================================================================================

  //====================================================================================
  //? Derived
  //====================================================================================

  const endpoint = useMemo(() => {
    // endpoint changes when date filter changes
    const base = `/api/admin/schedule/fetch`;
    if (!selectedDate) return base;
    const qs = new URLSearchParams({ date: selectedDate });
    return `${base}?${qs.toString()}`;
  }, [selectedDate]);

  const { schedules, loading, error, refreshSchedules } = useScheduleData(endpoint, tGlobal('common.errors.internal'));
  const { routesList } = useScheduleRoutesList();

  const selectedTrip = useMemo(() => {
    if (!selectedCell) return null;

    const schedule = schedules.find((s) => s.scheduleId === selectedCell.scheduleId);
    const byTime = (schedule?.timeline || []).find((r) => r.time === selectedCell.time);
    const trip = (byTime?.trips || []).find((t) => t.routeId === selectedCell.routeId);

    return trip || null;
  }, [schedules, selectedCell]);















  
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

        <ScheduleHeader
          title={t('title')}
          selectedDate={selectedDate}
          onSelectedDateChange={setSelectedDate}
          filterByDateLabel={t('filters.filterByDate')}
          clearLabel={t('filters.clear')}
          addNewLabel={t('actions.addNew')}
          onAddNew={() => setShowAdd(true)}
        />

        <AddSchedule
          open={showAdd}
          onClose={() => setShowAdd(false)}
          onSuccess={(message) => {
            setSuccessMessage(message);
            setTimeout(() => setSuccessMessage(''), 5000);
          }}
          onRefresh={refreshSchedules}
        />

        <UpdateSchedule
          open={Boolean(editRecord)}
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
          scheduleId={removeId}
          scheduleInfo={removeInfo}
          onClose={() => setRemoveId(null)}
          onSuccess={(message: string) => {
            setSuccessMessage(message);
            setTimeout(() => setSuccessMessage(''), 5000);
          }}
          onRefresh={refreshSchedules}
        />

        <AddScheduledTrip
          open={showAddTrip}
          selectedCell={selectedCell}
          detailedScheduleId={selectedTrip?.detailedScheduleId}
          initialDriverId={selectedTrip?.driverId}
          initialBusId={selectedTrip?.busId}
          onClose={() => {
            setShowAddTrip(false);
            setSelectedCell(null);
          }}
          onSuccess={(message: string) => {
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
          detailedScheduleId={removeTripId}
          tripInfo={removeTripInfo}
          onClose={() => {
            setShowRemoveTrip(false);
            setRemoveTripId(null);
          }}
          onSuccess={(message: string) => {
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
          <ScheduleTimelineTable
            schedules={schedules}
            routesList={routesList}
            selectedCell={selectedCell}
            setSelectedCell={setSelectedCell}
            onOpenAddTrip={() => setShowAddTrip(true)}
            onOpenRemoveTrip={(detailedScheduleId: string, tripInfo: string) => {
              setRemoveTripId(detailedScheduleId);
              setRemoveTripInfo(tripInfo);
              setShowRemoveTrip(true);
            }}
            onEditSchedule={(record: ScheduleRecord) => setEditRecord(record)}
            onRemoveSchedule={(scheduleId: string, scheduleInfo: string) => {
              setRemoveId(scheduleId);
              setRemoveInfo(scheduleInfo);
            }}
            t={t}
          />
        )}
      </div>
    </>
  );
};

//==============================================================================================================================
export default BusSchedulePage;
