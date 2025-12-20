//======================================================================================
//? Importing
//======================================================================================
import { useState } from 'react';
import Table from '../components/Table';

import AddSchedule from '../components/schedule/addSchedule';
import UpdateSchedule from '../components/schedule/updateSchedule';
import RemoveSchedule from '../components/schedule/removeSchedule';

//======================================================================================
const BusSchedulePage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [tableKey, setTableKey] = useState(0);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string>('');
  const [selectedScheduleInfo, setSelectedScheduleInfo] = useState<string>('');

  // Column configuration for bus schedule table
  const columnConfig = [
    { key: 'date', label: 'Date', formatter: (value: any) => value ? new Date(value).toLocaleDateString() : '-' },
    { key: 'day', label: 'Day' },
    { key: 'driverId', label: 'Driver', formatter: (value:any, _columnName: string, row:any) => {return row.driver ? `${row.driver.name} - ${row.driver.id}` : value || 'Unassigned';}},
    { key: 'routeId', label: 'Route', formatter: (value:any, _columnName: string, row:any) => {return row.route ? `${row.route.title} - ${row.route.id}` : value || 'Unassigned';}},
    { key: 'busId', label: 'Bus' },
    { key: 'updatedBy', label: 'Updated By', formatter: (value:any, _columnName: string, row:any) => {return row.updater ? `${row.updater.name} - ${row.updater.id}` : value || '-';}},
    { key: 'updatedAt', label: 'Updated At', formatter: (value: any) => value ? new Date(value).toLocaleDateString() : '-' },
    { key: 'createdBy', label: 'Created By', formatter: (value:any, _columnName: string, row:any) => {return row.creator ? `${row.creator.name} - ${row.creator.id}` : value || '-';}},
    { key: 'createdAt', label: 'Created At', formatter: (value: any) => value ? new Date(value).toLocaleDateString() : '-' },
  ];

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
    const scheduleInfo = `Date: ${new Date(schedule.date).toLocaleDateString()} | Driver: ${schedule.driver?.name || 'N/A'} | Route: ${schedule.route?.title || 'N/A'}`;
    setSelectedScheduleInfo(scheduleInfo);
    setShowRemoveModal(true);
  };

  // Handle Add Success
  const handleAddSuccess = () => {
    setShowAddModal(false);
    setSuccessMessage('Schedule added successfully!');
    setTableKey(prev => prev + 1);
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  // Handle Update Success
  const handleUpdateSuccess = () => {
    setShowUpdateModal(false);
    setSuccessMessage('Schedule updated successfully!');
    setTableKey(prev => prev + 1);
    setSelectedScheduleId('');
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  // Handle Remove Success
  const handleRemoveSuccess = () => {
    setShowRemoveModal(false);
    setSuccessMessage('Schedule removed successfully!');
    setTableKey(prev => prev + 1);
    setSelectedScheduleId('');
    setSelectedScheduleInfo('');
    setTimeout(() => setSuccessMessage(''), 5000);
  };

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
        title="Bus Schedule"
        subtitle="records"
        endpoint="http://localhost:3001/api/admin/schedule/fetch"
        onAddNew={handleAddNew}
        onEdit={handleEditSchedule}
        onDelete={handleRemoveSchedule}
        columnConfig={columnConfig}
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
