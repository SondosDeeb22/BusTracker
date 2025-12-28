//======================================================================================
//? Importing
//======================================================================================
import { useState } from 'react';
import Table from '../components/Table';
import { useTranslation } from 'react-i18next';

import AddDriver from '../components/driver/addDriver';
import RemoveDriver from '../components/driver/removeDriver';
import UpdateDriver from '../components/driver/updateDriver';

import StatusBadge from '../components/StatusBadge';
//======================================================================================
const DriversPage = () => {
  const { t } = useTranslation('drivers');
  const [showModel, setShowModel] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [tableKey, setTableKey] = useState(0);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [driverToRemove, setDriverToRemove] = useState<{id: number, name: string} | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [driverToUpdate, setDriverToUpdate] = useState<any>(null);


  // Column configuration for drivers table
  const columnConfig = [
    { key: 'id', label: t('columns.id') },
    { key: 'name', label: t('columns.name') },
    { key: 'phone', label: t('columns.phone') },
    { key: 'email', label: t('columns.email') },
    { key: 'licenseNumber', label: t('columns.licenseNumber') },
    { key: 'licenseExpiryDate', label: t('columns.licenseExpiryDate') },
    { key: 'status', label: t('columns.status'),
      formatter: (value: any) => {
        return <StatusBadge status={value} type="driver" />;
      }
    }
  ];


  // Open Model window------------------------------------------------
  const handleAddNew = () => {
    console.log('Add new driver');
    setShowModel(true);
  };

  
  // Case: Driver was Added  ------------------------------------------------
  // close Model windo and show Success message. 
  const handleAddDriverSuccess = () => {
    setShowModel(false);
    setSuccessMessage(t('success.added'));
    setTableKey(prev => prev + 1); // Force table refresh
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 5000); // 10 seconds
  };

  // Case : user click close button in the window, so close it
  // Close Model window -----------------------------------------------
  const handleCloseModel = () => {
    setShowModel(false);
  };







  // ------------------------------------------------
  const handleDelete = (driver: any) => {
    console.log('Delete driver:', driver);
    setDriverToRemove({ id: driver.id, name: driver.name || driver.email || 'this driver' });
    setShowRemoveModal(true);
  };

  // Close remove modal
  const handleCloseRemoveModal = () => {
    setShowRemoveModal(false);
    setDriverToRemove(null);
  };

  // Handle successful driver removal
  const handleRemoveSuccess = () => {
    setSuccessMessage(t('success.removed'));
    setTableKey(prev => prev + 1); // Force table refresh
    
    // Clear success message after 5 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 5000);
  };


  
  // ------------------------------------------------
  const handleEdit = (driver: any) => {
    console.log('Edit driver:', driver);
    setDriverToUpdate(driver);
    setShowUpdateModal(true);
  };
  
  // Close update modal
  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
    setDriverToUpdate(null);
  };

  // Handle successful driver update
  const handleUpdateSuccess = () => {
    setSuccessMessage(t('success.updated'));
    setTableKey(prev => prev + 1); // Force table refresh
    
    // Clear success message after 5 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 5000);
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
        endpoint="http://localhost:3001/api/admin/drivers/fetch"
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddNew={handleAddNew}
        columnConfig={columnConfig}
        actionsLabel={t('columns.actions')}
      />
      {showModel && (
        <AddDriver
          onClose={handleCloseModel}
          onSuccess={handleAddDriverSuccess}
        />
      )}
      {showRemoveModal && driverToRemove && (
        <RemoveDriver
          driverId={driverToRemove.id}
          driverName={driverToRemove.name}
          onClose={handleCloseRemoveModal}
          onSuccess={handleRemoveSuccess}
        />
      )}
      {showUpdateModal && driverToUpdate && (
        <UpdateDriver
          driver={driverToUpdate}
          onClose={handleCloseUpdateModal}
          onSuccess={handleUpdateSuccess}
        />
      )}
    </>
  );
};

export default DriversPage;
