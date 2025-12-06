//======================================================================================
//? Importing
//======================================================================================
import { useState } from 'react';
import Table from '../components/Table';
import AddStation from '../components/stations/addStation';
import UpdateStation from '../components/stations/updateStation';
import RemoveStation from '../components/stations/removeStation';
import StatusBadge from '../components/StatusBadge';

//======================================================================================
const StationsPage = () => {
  const [showModel, setShowModel] = useState(false);
  const [showUpdateModel, setShowUpdateModel] = useState(false);
  const [showRemoveModel, setShowRemoveModel] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [tableKey, setTableKey] = useState(0);
  const [selectedStationId, setSelectedStationId] = useState<string>('');
  const [selectedStationName, setSelectedStationName] = useState<string>('');

  // Column configuration for stations table
  const columnConfig = [
    { key: 'id', label: 'ID' },
    { key: 'stationName', label: 'Station Name' },
    { key: 'latitude', label: 'Latitude' },
    { key: 'longitude', label: 'Longitude' },
    { 
      key: 'status', 
      label: 'Status',
      formatter: (value: any) => {
        return <StatusBadge status={value} type="station" />;
      }
    }
  ];

  // Open Model window------------------------------------------------
  const handleAddNew = () => {
    console.log('Add new station');
    setShowModel(true);
  };

  // Open Update Model window-----------------------------------------
  const handleEditStation = (station: any) => {
    console.log('Edit station:', station);
    setSelectedStationId(station.id);
    setShowUpdateModel(true);
  };

  // Open Remove Model window-----------------------------------------
  const handleRemoveStation = (station: any) => {
    console.log('Remove station:', station);
    setSelectedStationId(station.id);
    setSelectedStationName(station.stationName);
    setShowRemoveModel(true);
  };

  
  // Case: Station was Added  ------------------------------------------------
  // close Model windo and show Success message. 
  const handleAddStationSuccess = () => {
    setShowModel(false);
    setSuccessMessage('Station was successfully added!');
    setTableKey(prev => prev + 1); // Force table refresh
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 5000);
  };

  // Case: Station was Updated  ------------------------------------------------
  const handleUpdateStationSuccess = () => {
    setShowUpdateModel(false);
    setSuccessMessage('Station was successfully updated!');
    setTableKey(prev => prev + 1); // Force table refresh
    setSelectedStationId('');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 5000);
  };

  // Case: Station was Removed  ------------------------------------------------
  const handleRemoveStationSuccess = () => {
    setShowRemoveModel(false);
    setSuccessMessage('Station was successfully removed!');
    setTableKey(prev => prev + 1); // Force table refresh
    setSelectedStationId('');
    setSelectedStationName('');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 5000);
  };

  // Case : user click close button in the window, so close it
  // Close Model window -----------------------------------------------
  const handleCloseModel = () => {
    setShowModel(false);
  };

  const handleCloseUpdateModel = () => {
    setShowUpdateModel(false);
    setSelectedStationId('');
  };

  const handleCloseRemoveModel = () => {
    setShowRemoveModel(false);
    setSelectedStationId('');
    setSelectedStationName('');
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
        title="Stations"
        subtitle="Stations"
        endpoint="http://localhost:3001/api/admin/stations/fetch"
        onAddNew={handleAddNew}
        onEdit={handleEditStation}
        onDelete={handleRemoveStation}
        columnConfig={columnConfig}
      />
      {showModel && (
        <AddStation
          onClose={handleCloseModel}
          onSuccess={handleAddStationSuccess}
        />
      )}
      {showUpdateModel && (
        <UpdateStation
          onClose={handleCloseUpdateModel}
          onSuccess={handleUpdateStationSuccess}
          stationId={selectedStationId}
        />
      )}
      {showRemoveModel && (
        <RemoveStation
          onClose={handleCloseRemoveModel}
          onSuccess={handleRemoveStationSuccess}
          stationId={selectedStationId}
          stationName={selectedStationName}
        />
      )}
    </>
  );
};

export default StationsPage;
