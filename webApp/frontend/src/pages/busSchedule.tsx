//======================================================================================
//? Importing
//======================================================================================
import { useState } from 'react';
import Table from '../components/Table';
import { useTranslation } from 'react-i18next';

import AddSchedule from '../components/schedule/addSchedule';
import UpdateSchedule from '../components/schedule/updateSchedule';
import RemoveSchedule from '../components/schedule/removeSchedule';

//======================================================================================
const BusSchedulePage = () => {
  const { t } = useTranslation('busScedule');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [tableKey, setTableKey] = useState(0);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string>('');
  const [selectedScheduleInfo, setSelectedScheduleInfo] = useState<string>('');

  const baseEndpoint = 'http://localhost:3001/api/admin/schedule/fetch';
  const defaultSort = { dateDir: 'desc' as 'asc' | 'desc', nameDir: 'asc' as 'asc' | 'desc' };
  const [sortState, setSortState] = useState(defaultSort);

  const buildSortParam = (s: typeof defaultSort) => {
    return `date:${s.dateDir},name:${s.nameDir}`;
  };

  // Column configuration for bus schedule table
  const columnConfig = [
    { key: 'date', label: t('columns.date'), formatter: (value: any) => value ? new Date(value).toLocaleDateString() : '-' },
    { key: 'day', label: t('columns.day') },
    { key: 'shiftType', label: t('columns.shiftType') },
    { key: 'driverId', label: t('columns.driver'), formatter: (value:any, _columnName: string, row:any) => {return row.driver ? `${row.driver.name} - ${row.driver.id}` : value || t('unassigned');}},
    { key: 'routeId', label: t('columns.route'), formatter: (value:any, _columnName: string, row:any) => {return row.route ? `${row.route.title} - ${row.route.id}` : value || t('unassigned');}},
    { key: 'busId', label: t('columns.bus') },
    { key: 'updatedBy', label: t('columns.updatedBy'), formatter: (value:any, _columnName: string, row:any) => {return row.updater ? `${row.updater.name} - ${row.updater.id}` : value || '-';}},
    { key: 'updatedAt', label: t('columns.updatedAt'), formatter: (value: any) => value ? new Date(value).toLocaleDateString() : '-' },
    { key: 'createdBy', label: t('columns.createdBy'), formatter: (value:any, _columnName: string, row:any) => {return row.creator ? `${row.creator.name} - ${row.creator.id}` : value || '-';}},
    { key: 'createdAt', label: t('columns.createdAt'), formatter: (value: any) => value ? new Date(value).toLocaleDateString() : '-' },
  ];

  //=============================================================================================
  // Handle Add New 
  const handleAddNew = () => {
    setShowAddModal(true);
  };

  // Handle Edit Schedule
  const handleEditSchedule = (schedule: any) => {
    setSelectedScheduleId(schedule.id);
    setShowUpdateModal(true);
  };

  // Handle Remove Schedule
  const handleRemoveSchedule = (schedule: any) => {
    setSelectedScheduleId(schedule.id);
    const scheduleInfo = `${t('labels.date')}: ${new Date(schedule.date).toLocaleDateString()} | ${t('labels.driver')}: ${schedule.driver?.name || t('na')} | ${t('labels.route')}: ${schedule.route?.title || t('na')}`;
    setSelectedScheduleInfo(scheduleInfo);
    setShowRemoveModal(true);
  };

  //=============================================================================================
  // Handle Add Success
  const handleAddSuccess = () => {
    setShowAddModal(false);
    setSuccessMessage(t('success.added'));
    setTableKey(prev => prev + 1);
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  // Handle Update Success
  const handleUpdateSuccess = () => {
    setShowUpdateModal(false);
    setSuccessMessage(t('success.updated'));
    setTableKey(prev => prev + 1);
    setSelectedScheduleId('');
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  // Handle Remove Success
  const handleRemoveSuccess = () => {
    setShowRemoveModal(false);
    setSuccessMessage(t('success.removed'));
    setTableKey(prev => prev + 1);
    setSelectedScheduleId('');
    setSelectedScheduleInfo('');
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  
  //=============================================================================================
  // Handle Close Modals
  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
    setSelectedScheduleId('');
  };

  const handleCloseRemoveModal = () => {
    setShowRemoveModal(false);
    setSelectedScheduleId('');
    setSelectedScheduleInfo('');
  };

  //======================================================================================
  return (
    <>
      {successMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md">
          {successMessage}
        </div>
      )}

      <Table
        key={tableKey}
        title={t('title')}
        subtitle={t('subtitle')}
        endpoint={`${baseEndpoint}?sort=${encodeURIComponent(buildSortParam(sortState))}`}
        showFilterButtons={true}
        filterButtons={
          <div className="flex flex-wrap gap-3">

            {/* by date filter ---------------------------------------------------*/}
            <button
              type="button"
              className="px-5 py-2 rounded-lg border text-base font-semibold hover:bg-gray-50"
              onClick={() => {
                setSortState((prev) => {
                  const next = { ...prev, dateDir: (prev.dateDir === 'desc' ? 'asc' : 'desc') as 'asc' | 'desc' };
                  return next;
                });
                setTableKey((prev) => prev + 1);
              }}
            >
              {sortState.dateDir === 'desc' ? 'Date: Newest first' : 'Date: Oldest first'}
            </button>

            {/* by driver filter ---------------------------------------------------*/}
            <button
              type="button"
              className="px-5 py-2 rounded-lg border text-base font-semibold hover:bg-gray-50"
              onClick={() => {
                setSortState((prev) => {
                  const next = { ...prev, nameDir: (prev.nameDir === 'asc' ? 'desc' : 'asc') as 'asc' | 'desc' };
                  return next;
                });
                setTableKey((prev) => prev + 1);
              }}              
            >
              {sortState.nameDir === 'asc' ? 'Driver: A → Z' : 'Driver: Z → A'}
            </button>

          </div>
        }
        onAddNew={handleAddNew}
        onEdit={handleEditSchedule}
        onDelete={handleRemoveSchedule}
        columnConfig={columnConfig}
        actionsLabel={t('columns.actions')}
      />

      {showAddModal && (
        <AddSchedule
          onClose={handleCloseAddModal}
          onSuccess={handleAddSuccess}
        />
      )}

      {showUpdateModal && (
        <UpdateSchedule
          onClose={handleCloseUpdateModal}
          onSuccess={handleUpdateSuccess}
          scheduleId={selectedScheduleId}
        />
      )}

      {showRemoveModal && (
        <RemoveSchedule
          onClose={handleCloseRemoveModal}
          onSuccess={handleRemoveSuccess}
          scheduleId={selectedScheduleId}
          scheduleInfo={selectedScheduleInfo}
        />
      )}
    </>
  );
};

//==============================================================================================================================
export default BusSchedulePage;
