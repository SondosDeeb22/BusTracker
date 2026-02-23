//======================================================================================
//? Importing
//======================================================================================
import { useState } from 'react';
import Table from '../components/common/Table';
import AddRoute from '../components/routes/addRoute';
import UpdateRoute from '../components/routes/updateRoute';
import RemoveRoute from '../components/routes/removeRoute';
import StatusBadge from '../components/common/StatusBadge';
import { useTranslation } from 'react-i18next';

import SuccessToast from '../components/common/SuccessToast';
import { useToastMessage } from '../hooks/useToastMessage';
import { useTableRefreshKey } from '../hooks/useTableRefreshKey';

// route defined type
import type { RouteRow, RouteStationRef } from '../types/routes';

//======================================================================================
const RoutesPage = () => {
  const { t } = useTranslation('routes');

  // ========================================================
  type TableRow = Record<string, unknown>;

  const isRouteRow = (row: TableRow): row is RouteRow => {
    return typeof row.id === 'string';
  };

  // ========================================================

  const [showModel, setShowModel] = useState(false);
  const [showUpdateModel, setShowUpdateModel] = useState(false);
  const [showRemoveModel, setShowRemoveModel] = useState(false);

  const toast = useToastMessage({ timeoutMs: 5000 });
  const tableRefresh = useTableRefreshKey(0);
  
  const [selectedRouteId, setSelectedRouteId] = useState<string>('');
  const [selectedRouteTitle, setSelectedRouteTitle] = useState<string>('');

  // Column configuration for routes table
  const columnConfig = [
    { key: 'id', label: t('columns.id') },
    { key: 'title', label: t('columns.title') },
    { 
      key: 'color', 
      label: t('columns.color'),
      formatter: (value: unknown) => (
        <div className="flex items-center gap-2">
          <div 
            className="w-4 h-4 rounded-full border border-gray-300" 
            style={{ backgroundColor: String(value) }}
          />
          <span>{String(value)}</span>
        </div>
      )
    },
    { 
      key: 'stations', 
      label: t('columns.stations'),
      formatter: (value: unknown) => {
        const list = Array.isArray(value) ? value : [];
        return (
          <div className="flex flex-col text-sm text-gray-700">
            {list.length === 0 ? (
              <span className="text-gray-400">-</span>
            ) : (
              list.map((s: unknown, idx: number) => {
                const station = (s || {}) as RouteStationRef;
                const left = station.id ?? station.stationId ?? String(s);
                const right = station.stationName ?? station.name ?? '';
                return <span key={idx}>{left} - {right}</span>;
              })
            )}
          </div>
        );
      }
    },
    { 
      key: 'totalStops', 
      label: t('columns.totalStops'),
      formatter: (_value: unknown, _columnName: string, row: TableRow) => {
        if (!isRouteRow(row)) return Number(_value) || 0;
        const list = Array.isArray(row.stations) ? row.stations : [];
        return list.length || Number(_value) || 0;
      }
    },
    { 
      key: 'status', 
      label: t('columns.status'),
      formatter: (value: unknown) => {
        return <StatusBadge status={String(value)} type="route" />;
      }
    }
  ];

  // Open Model window------------------------------------------------
  const handleAddNew = () => {
    console.log('Add new route');
    setShowModel(true);
  };

  // Open Update Model window-----------------------------------------
  const handleEditRoute = (row: TableRow) => {
    console.log('Edit route:', row);
    if (!isRouteRow(row)) return;
    setSelectedRouteId(row.id);
    setShowUpdateModel(true);
  };

  // Open Remove Model window-----------------------------------------
  const handleRemoveRoute = (row: TableRow) => {
    console.log('Remove route:', row);
    if (!isRouteRow(row)) return;
    setSelectedRouteId(row.id);
    setSelectedRouteTitle(row.title || '');
    setShowRemoveModel(true);
  };

  
  // Case: Route was Added  ------------------------------------------------
  // close Model windo and show Success message. 
  const handleAddRouteSuccess = () => {
    setShowModel(false);
    toast.show(t('success.added'));
    tableRefresh.refresh(); // Force table refresh
  };

  // Case: Route was Updated  ------------------------------------------------
  const handleUpdateRouteSuccess = () => {
    setShowUpdateModel(false);
    toast.show(t('success.updated'));
    tableRefresh.refresh(); // Force table refresh
    setSelectedRouteId('');
  };

  // Case: Route was Removed  ------------------------------------------------
  const handleRemoveRouteSuccess = () => {
    setShowRemoveModel(false);
    toast.show(t('success.removed'));
    tableRefresh.refresh(); // Force table refresh
    setSelectedRouteId('');
    setSelectedRouteTitle('');
  };

  // Case : user click close button in the window, so close it
  // Close Model window -----------------------------------------------
  const handleCloseModel = () => {
    setShowModel(false);
  };

  const handleCloseUpdateModel = () => {
    setShowUpdateModel(false);
    setSelectedRouteId('');
  };

  const handleCloseRemoveModel = () => {
    setShowRemoveModel(false);
    setSelectedRouteId('');
    setSelectedRouteTitle('');
  };

  //======================================================================================
  return (
    <>
      <SuccessToast message={toast.message} />
      <Table
        key={tableRefresh.key}
        title={t('title')}
        subtitle={t('subtitle')}
        endpoint="/api/user/routes/all"
        onAddNew={handleAddNew}
        onEdit={handleEditRoute}
        onDelete={handleRemoveRoute}
        columnConfig={columnConfig}
        actionsLabel={t('columns.actions')}
      />
      {showModel && (
        <AddRoute
          onClose={handleCloseModel}
          onSuccess={handleAddRouteSuccess}
        />
      )}
      {showUpdateModel && (
        <UpdateRoute
          onClose={handleCloseUpdateModel}
          onSuccess={handleUpdateRouteSuccess}
          routeId={selectedRouteId}
        />
      )}
      {showRemoveModel && (
        <RemoveRoute
          onClose={handleCloseRemoveModel}
          onSuccess={handleRemoveRouteSuccess}
          routeId={selectedRouteId}
          routeTitle={selectedRouteTitle}
        />
      )}
    </>
  );
};

export default RoutesPage;
