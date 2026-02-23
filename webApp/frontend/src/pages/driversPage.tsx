//======================================================================================
//? Importing
//======================================================================================
import { useState } from 'react';
import Table from '../components/common/Table';
import { useTranslation } from 'react-i18next';


// hooks
import { useToastMessage } from '../hooks/useToastMessage';
import { useTableRefreshKey } from '../hooks/useTableRefreshKey';

// components
import AddDriver from '../components/drivers/addDriver';
import RemoveDriver from '../components/drivers/removeDriver';
import UpdateDriver from '../components/drivers/updateDriver';

import StatusBadge from '../components/common/StatusBadge';
import SuccessToast from '../components/common/SuccessToast';

// driver defined type
import type { Driver } from '../types/drivers';

//======================================================================================
const DriversPage = () => {
  const { t } = useTranslation('drivers');

  type TableRow = Record<string, unknown>;

  const isDriverRow = (row: TableRow): row is Driver => {
    return typeof row.id === 'number';
  };
  // ========================================================

  const [showModel, setShowModel] = useState(false);
  const toast = useToastMessage({ timeoutMs: 5000 });
  const tableRefresh = useTableRefreshKey(0);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [driverToRemove, setDriverToRemove] = useState<{id: number, name: string} | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [driverToUpdate, setDriverToUpdate] = useState<Driver | null>(null);


  // Column configuration for drivers table
  const columnConfig = [
    { key: 'id', label: t('columns.id') },
    { key: 'name', label: t('columns.name') },
    { key: 'phone', label: t('columns.phone') },
    { key: 'email', label: t('columns.email') },
    { key: 'licenseNumber', label: t('columns.licenseNumber') },
    { key: 'licenseExpiryDate', label: t('columns.licenseExpiryDate') },
    { key: 'status', label: t('columns.status'),
      formatter: (value: unknown) => {
        return <StatusBadge status={String(value)} type="driver" />;
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
    toast.show(t('success.added'));
    tableRefresh.refresh(); // Force table refresh
  };

  // Case : user click close button in the window, so close it
  // Close Model window -----------------------------------------------
  const handleCloseModel = () => {
    setShowModel(false);
  };







  // ------------------------------------------------
  const handleDelete = (row: TableRow) => {
    console.log('Delete driver:', row);
    if (!isDriverRow(row)) return;
    setDriverToRemove({ id: row.id, name: row.name || row.email || 'this driver' });
    setShowRemoveModal(true);
  };

  // Close remove modal
  const handleCloseRemoveModal = () => {
    setShowRemoveModal(false);
    setDriverToRemove(null);
  };

  // Handle successful driver removal
  const handleRemoveSuccess = () => {
    toast.show(t('success.removed'));
    tableRefresh.refresh(); // Force table refresh
  };


  
  // ------------------------------------------------
  const handleEdit = (row: TableRow) => {
    console.log('Edit driver:', row);
    if (!isDriverRow(row)) return;
    setDriverToUpdate(row);
    setShowUpdateModal(true);
  };
  
  // Close update modal
  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
    setDriverToUpdate(null);
  };

  // Handle successful driver update
  const handleUpdateSuccess = () => {
    toast.show(t('success.updated'));
    tableRefresh.refresh(); // Force table refresh
  };





  //======================================================================================
  return (
    <>
      <SuccessToast message={toast.message} />
      <Table
        key={tableRefresh.key}
        title={t('title')}
        subtitle={t('subtitle')}
        endpoint="/api/admin/drivers/fetch"
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
