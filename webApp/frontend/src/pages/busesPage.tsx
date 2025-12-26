//======================================================================================
//? Importing
//======================================================================================
import { useState } from 'react';
import Table from '../components/Table';
import AddBus from '../components/buses/addBus';
import UpdateBus from '../components/buses/updateBus';
import RemoveBus from '../components/buses/removeBus';
import StatusBadge from '../components/StatusBadge';
import { useTranslation } from 'react-i18next';

//======================================================================================
const BusesPage = () => {
  const { t } = useTranslation('buses');
  const [showModel, setShowModel] = useState(false);
  const [showUpdateModel, setShowUpdateModel] = useState(false);
  const [showRemoveModel, setShowRemoveModel] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [tableKey, setTableKey] = useState(0);
  const [selectedBusId, setSelectedBusId] = useState<string>('');
  const [selectedBusSerialNumber, setSelectedBusSerialNumber] = useState<string>('');

  // Column configuration for buses table
  const columnConfig = [
    { key: 'id', label: t('columns.id') },
    { key: 'serialNumber', label: t('columns.serialNumber') },
    { key: 'brand', label: t('columns.brand') },
    { 
      key: 'status', 
      label: t('columns.status'),
      formatter: (value: any) => {
        return <StatusBadge status={value} type="bus" />;
      }
    },
    { 
      key: 'assignedDriver', 
      label: t('columns.assignedDriver'),
      formatter: (value: any, _columnName: string, row: any) => {
        return row.driver?.name || value || t('unassigned');
      }
    },
    { 
      key: 'assignedRoute', 
      label: t('columns.assignedRoute'),
      formatter: (value: any, _columnName: string, row: any) => {
        return row.route?.title || value || t('unassigned');
      }
    }
  ];

  // Open Model window------------------------------------------------
  const handleAddNew = () => {
    console.log('Add new bus');
    setShowModel(true);
  };

  // Open Update Model window-----------------------------------------
  const handleEditBus = (bus: any) => {
    console.log('Edit bus:', bus);
    setSelectedBusId(bus.id);
    setShowUpdateModel(true);
  };

  // Open Remove Model window-----------------------------------------
  const handleRemoveBus = (bus: any) => {
    console.log('Remove bus:', bus);
    setSelectedBusId(bus.id);
    setSelectedBusSerialNumber(bus.serialNumber);
    setShowRemoveModel(true);
  };

  
  // Case: Bus was Added  ------------------------------------------------
  // close Model windo and show Success message. 
  const handleAddBusSuccess = () => {
    setShowModel(false);
    setSuccessMessage(t('success.added'));
    setTableKey(prev => prev + 1); // Force table refresh
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 5000); // 10 seconds
  };

  // Case: Bus was Updated  ------------------------------------------------
  const handleUpdateBusSuccess = () => {
    setShowUpdateModel(false);
    setSuccessMessage(t('success.updated'));
    setTableKey(prev => prev + 1); // Force table refresh
    setSelectedBusId('');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 5000);
  };

  // Case: Bus was Removed  ------------------------------------------------
  const handleRemoveBusSuccess = () => {
    setShowRemoveModel(false);
    setSuccessMessage(t('success.removed'));
    setTableKey(prev => prev + 1); // Force table refresh
    setSelectedBusId('');
    setSelectedBusSerialNumber('');
    
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
    setSelectedBusId('');
  };

  const handleCloseRemoveModel = () => {
    setShowRemoveModel(false);
    setSelectedBusId('');
    setSelectedBusSerialNumber('');
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
        endpoint="http://localhost:3001/api/admin/buses/fetch"
        onAddNew={handleAddNew}
        onEdit={handleEditBus}
        onDelete={handleRemoveBus}
        columnConfig={columnConfig}
        actionsLabel={t('columns.actions')}
      />
      {showModel && (
        <AddBus
          onClose={handleCloseModel}
          onSuccess={handleAddBusSuccess}
        />
      )}
      {showUpdateModel && (
        <UpdateBus
          onClose={handleCloseUpdateModel}
          onSuccess={handleUpdateBusSuccess}
          busId={selectedBusId}
        />
      )}
      {showRemoveModel && (
        <RemoveBus
          onClose={handleCloseRemoveModel}
          onSuccess={handleRemoveBusSuccess}
          busId={selectedBusId}
          busSerialNumber={selectedBusSerialNumber}
        />
      )}
    </>
  );
};

export default BusesPage;
