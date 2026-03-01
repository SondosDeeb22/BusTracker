//======================================================================================
//? Importing
//======================================================================================
import { useState } from 'react';
import Table from '../components/common/Table';
import AddBus from '../components/buses/addBus';
import UpdateBus from '../components/buses/updateBus';
import RemoveBus from '../components/buses/removeBus';
import StatusBadge from '../components/common/StatusBadge';

import SuccessToast from '../components/common/SuccessToast';
import { useToastMessage } from '../hooks/useToastMessage';
import { useTableRefreshKey } from '../hooks/useTableRefreshKey';

import { useTranslation } from 'react-i18next';

// bus defined type
import type { Bus } from '../types/buses';

//======================================================================================
//? BusesPage
//======================================================================================

const BusesPage = () => {
  
  const { t } = useTranslation('buses');

  // ========================================================
  type TableRow = Record<string, unknown>;

  const isBusRow = (row: TableRow): row is Bus => {
    return typeof row.id === 'string';
  };
  // ========================================================
  
  const [showModel, setShowModel] = useState(false);
  const [showUpdateModel, setShowUpdateModel] = useState(false);
  const [showRemoveModel, setShowRemoveModel] = useState(false);

  const toast = useToastMessage({ timeoutMs: 5000 });
  const tableRefresh = useTableRefreshKey(0);
  
  const [selectedBusId, setSelectedBusId] = useState<string>('');
  const [selectedBusPlate, setselectedBusPlate] = useState<string>('');

  // Column configuration for buses table
  const columnConfig = [
    { key: 'id', label: t('columns.id') },
    { key: 'plate', label: t('columns.plate') },
    { key: 'brand', label: t('columns.brand') },
    { 
      key: 'status', 
      label: t('columns.status'),
      formatter: (value: unknown) => {
        return <StatusBadge status={String(value)} type="bus" />;
      }
    }
  ];

  // Open Model window------------------------------------------------
  const handleAddNew = () => {
    console.log('Add new bus');
    setShowModel(true);
  };

  // Open Update Model window-----------------------------------------
  const handleEditBus = (row: TableRow) => {
    console.log('Edit bus:', row);
    if (!isBusRow(row)) return;
    setSelectedBusId(row.id);
    setShowUpdateModel(true);
  };

  // Open Remove Model window-----------------------------------------
  const handleRemoveBus = (row: TableRow) => {
    console.log('Remove bus:', row);
    if (!isBusRow(row)) return;
    setSelectedBusId(row.id);
    setselectedBusPlate(row.serialNumber || '');
    setShowRemoveModel(true);
  };

  
  // Bus was Added  ------------------------------------------------
  // close Model windo and show Success message. 
  const handleAddBusSuccess = () => {
    setShowModel(false);
    toast.show(t('success.added'));
    tableRefresh.refresh(); // Force table refresh
  };

  // Bus was Updated  ------------------------------------------------
  const handleUpdateBusSuccess = () => {
    setShowUpdateModel(false);
    toast.show(t('success.updated'));
    tableRefresh.refresh(); // Force table refresh
    setSelectedBusId('');
  };

  // Bus was Removed  ------------------------------------------------
  const handleRemoveBusSuccess = () => {
    setShowRemoveModel(false);
    toast.show(t('success.removed'));
    tableRefresh.refresh(); // Force table refresh
    setSelectedBusId('');
    setselectedBusPlate('');
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
    setselectedBusPlate('');
  };

  //======================================================================================
  return (
    <>
      <SuccessToast message={toast.message} />
      <Table
        key={tableRefresh.key}
        title={t('title')}
        subtitle={t('subtitle')}
        endpoint="/api/admin/buses/fetch"
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
          busSerialNumber={selectedBusPlate}
        />
      )}
    </>
  );
};

export default BusesPage;
