//======================================================================================
//? Importing
//======================================================================================
import { useState } from 'react';
import Table from '../components/Table';
import AddRoute from '../components/routes/addRoute';
import UpdateRoute from '../components/routes/updateRoute';
import RemoveRoute from '../components/routes/removeRoute';
import StatusBadge from '../components/StatusBadge';
import { useTranslation } from 'react-i18next';

//======================================================================================
const RoutesPage = () => {
  const { t } = useTranslation('routes');
  const [showModel, setShowModel] = useState(false);
  const [showUpdateModel, setShowUpdateModel] = useState(false);
  const [showRemoveModel, setShowRemoveModel] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [tableKey, setTableKey] = useState(0);
  const [selectedRouteId, setSelectedRouteId] = useState<string>('');
  const [selectedRouteTitle, setSelectedRouteTitle] = useState<string>('');

  // Column configuration for routes table
  const columnConfig = [
    { key: 'id', label: t('columns.id') },
    { key: 'title', label: t('columns.title') },
    { 
      key: 'color', 
      label: t('columns.color'),
      formatter: (value: any) => (
        <div className="flex items-center gap-2">
          <div 
            className="w-4 h-4 rounded-full border border-gray-300" 
            style={{ backgroundColor: value }}
          />
          <span>{value}</span>
        </div>
      )
    },
    { 
      key: 'stations', 
      label: t('columns.stations'),
      formatter: (value: any) => {
        const list = Array.isArray(value) ? value : [];
        return (
          <div className="flex flex-col text-sm text-gray-700">
            {list.length === 0 ? (
              <span className="text-gray-400">-</span>
            ) : (
              list.map((s: any, idx: number) => (
                <span key={idx}>{s.id ?? s.stationId ?? s} - {s.stationName ?? s.name ?? ''}</span>
              ))
            )}
          </div>
        );
      }
    },
    { 
      key: 'totalStops', 
      label: t('columns.totalStops'),
      formatter: (_value: any, row: any) => {
        const list = Array.isArray(row?.stations) ? row.stations : [];
        return list.length || _value || 0;
      }
    },
    { 
      key: 'status', 
      label: t('columns.status'),
      formatter: (value: any) => {
        return <StatusBadge status={value} type="route" />;
      }
    }
  ];

  // Open Model window------------------------------------------------
  const handleAddNew = () => {
    console.log('Add new route');
    setShowModel(true);
  };

  // Open Update Model window-----------------------------------------
  const handleEditRoute = (route: any) => {
    console.log('Edit route:', route);
    setSelectedRouteId(route.id);
    setShowUpdateModel(true);
  };

  // Open Remove Model window-----------------------------------------
  const handleRemoveRoute = (route: any) => {
    console.log('Remove route:', route);
    setSelectedRouteId(route.id);
    setSelectedRouteTitle(route.title);
    setShowRemoveModel(true);
  };

  
  // Case: Route was Added  ------------------------------------------------
  // close Model windo and show Success message. 
  const handleAddRouteSuccess = () => {
    setShowModel(false);
    setSuccessMessage(t('success.added'));
    setTableKey(prev => prev + 1); // Force table refresh
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 5000);
  };

  // Case: Route was Updated  ------------------------------------------------
  const handleUpdateRouteSuccess = () => {
    setShowUpdateModel(false);
    setSuccessMessage(t('success.updated'));
    setTableKey(prev => prev + 1); // Force table refresh
    setSelectedRouteId('');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 5000);
  };

  // Case: Route was Removed  ------------------------------------------------
  const handleRemoveRouteSuccess = () => {
    setShowRemoveModel(false);
    setSuccessMessage(t('success.removed'));
    setTableKey(prev => prev + 1); // Force table refresh
    setSelectedRouteId('');
    setSelectedRouteTitle('');
    
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
      {successMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md">
          {successMessage}
        </div>
      )}
      <Table
        key={tableKey}
        title={t('title')}
        subtitle={t('subtitle')}
        endpoint="http://localhost:3001/api/user/routes/all"
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
