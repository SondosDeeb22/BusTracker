//======================================================================================
//? Importing
//======================================================================================
import { useMemo, useState } from 'react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import Table from '../components/common/Table';
import AddStation from '../components/stations/addStation';
import UpdateStation from '../components/stations/updateStation';
import RemoveStation from '../components/stations/removeStation';
import StatusBadge from '../components/common/StatusBadge';
import { useTranslation } from 'react-i18next';

import SuccessToast from '../components/common/SuccessToast';
import { useToastMessage } from '../hooks/useToastMessage';
import { useTableRefreshKey } from '../hooks/useTableRefreshKey';

// station defined type
import type { StationRow } from '../types/stations';

//======================================================================================
//? Stations page
//======================================================================================

const StationsPage = () => {
  const { t } = useTranslation('stations');

  // ========================================================
  type TableRow = Record<string, unknown>;

  const isStationRow = (row: TableRow): row is StationRow => {
    return typeof row.id === 'string';
  };  
  // ========================================================

  const [showModel, setShowModel] = useState(false);
  const [showUpdateModel, setShowUpdateModel] = useState(false);
  const [showRemoveModel, setShowRemoveModel] = useState(false);

  const toast = useToastMessage({ timeoutMs: 5000 });
  const tableRefresh = useTableRefreshKey(0);
  
  const [selectedStationId, setSelectedStationId] = useState<string>('');
  const [selectedStationName, setSelectedStationName] = useState<string>('');
  // 
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [mapModalCoords, setMapModalCoords] = useState<{ lat: number; lng: number } | null>(null);

  const markerIcon = useMemo(
    () =>
      L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.7/dist/images/marker-icon.png',// location icon, for the map
        iconSize: [20, 32],
        iconAnchor: [10, 32],
      }),
    []
  );

  //==============================================================================================================================
  //? Static map preview for selected coordinates(lat, lng)================================================================================================================
  //==============================================================================================================================

  const MapPreview = ({ latitude, longitude }: { latitude: string; longitude: string }) => {
    if (!latitude || !longitude) return <span className="text-gray-400">-</span>;

    const latitudeNum = Number(latitude);
    const longitudeNum = Number(longitude);

    if (!Number.isFinite(latitudeNum) || !Number.isFinite(longitudeNum)) return <span className="text-gray-400">-</span>;

    return (
      <button
        type="button"
        onClick={() => {
          setMapModalCoords({ lat: latitudeNum, lng: longitudeNum });
          setMapModalOpen(true);
        }}
        className="h-28 w-32 rounded-md overflow-hidden border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition relative z-0"
        title={t('mapModal.previewTitle')}
      >
        {/* ------------------------------------------------------------------------------------------------------------------- */}
        <MapContainer
          center={[latitudeNum, longitudeNum]}
          zoom={14}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false}
          dragging={false}
          doubleClickZoom={false}
          zoomControl={false}
          attributionControl={false}
        >
          {/* OpenStreetMap serves map tiles as images */}
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* place a marker on the map using formData values(lat, lng) */}
          <Marker position={[latitudeNum, longitudeNum]} icon={markerIcon} />
          
        </MapContainer>
        {/* ------------------------------------------------------------------------------------------------------------------- */}
        <div className="px-2 py-1 text-[11px] text-gray-600 bg-white border-t border-gray-100">
          {latitudeNum.toFixed(4)}, {longitudeNum.toFixed(4)}
        </div>
      </button>
    );
  };
  //=======================================================================================================================================
  //? Full-size interactive map modal (Leaflet) to view stations' location ================================================================================================================
  //===============================================================================================================================
  const MapModal = () => {
    if (!mapModalOpen || !mapModalCoords) return null;

    const { lat, lng } = mapModalCoords;

    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-xl overflow-hidden relative z-10">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h3 className="text-lg font-semibold text-gray-800">{t('mapModal.title')}</h3>
            <button
              onClick={() => setMapModalOpen(false)}
              className="text-gray-500 hover:text-gray-800 focus:outline-none"
              aria-label="Close map"
            >
              ✕
            </button>
          </div>


          <div className="h-96 w-full">
            {/* ------------------------------------------------------------------------------------------------------------------- */}
            <MapContainer
              center={[lat, lng]}
              zoom={15}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom
              doubleClickZoom
            >
              {/* OpenStreetMap serves map tiles as images */}
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* place a marker on the map using (lat, lng) */}
              <Marker position={[lat, lng]} icon={markerIcon} />

            </MapContainer>
            {/* ------------------------------------------------------------------------------------------------------------------- */}
          </div>


          <div className="px-4 py-3 border-t text-sm text-gray-700">
            {t('mapModal.coordinates')}: {lat.toFixed(5)}, {lng.toFixed(5)}
          </div>
        </div>
      </div>
    );
  };

  //==============================================================================================================================
  // Column configuration for stations table
  const columnConfig = [
    { key: 'id', label: t('columns.id') },
    { key: 'stationName', label: t('columns.stationName') },
    { key: 'latitude', label: t('columns.latitude') },
    { key: 'longitude', label: t('columns.longitude') },
    {
      key: 'map',
      label: t('columns.map'),
      formatter: (_value: unknown, _columnName: string, row: TableRow) => {
        const latitude = String((row as StationRow).latitude ?? '');
        const longitude = String((row as StationRow).longitude ?? '');
        return <MapPreview latitude={latitude} longitude={longitude} />;
      },
    },
    { 
      key: 'status', 
      label: t('columns.status'),
      formatter: (value: unknown) => {
        return <StatusBadge status={String(value)} type="station" />;
      }
    }
  ];

  // Open Model window------------------------------------------------
  const handleAddNew = () => {
    console.log('Add new station');
    setShowModel(true);
  };

  // Open Update Model window-----------------------------------------
  const handleEditStation = (row: TableRow) => {
    console.log('Edit station:', row);
    if (!isStationRow(row)) return;
    setSelectedStationId(row.id);
    setShowUpdateModel(true);
  };

  // Open Remove Model window-----------------------------------------
  const handleRemoveStation = (row: TableRow) => {
    console.log('Remove station:', row);
    if (!isStationRow(row)) return;
    setSelectedStationId(row.id);
    setSelectedStationName(row.stationName || '');
    setShowRemoveModel(true);
  };

  
  // Case: Station was Added  ------------------------------------------------
  // close Model windo and show Success message. 
  const handleAddStationSuccess = () => {
    setShowModel(false);
    toast.show(t('success.added'));
    tableRefresh.refresh(); // Force table refresh
  };

  // Case: Station was Updated  ------------------------------------------------
  const handleUpdateStationSuccess = () => {
    setShowUpdateModel(false);
    toast.show(t('success.updated'));
    tableRefresh.refresh(); // Force table refresh
    setSelectedStationId('');
  };

  // Case: Station was Removed  ------------------------------------------------
  const handleRemoveStationSuccess = () => {
    setShowRemoveModel(false);
    toast.show(t('success.removed'));
    tableRefresh.refresh(); // Force table refresh
    setSelectedStationId('');
    setSelectedStationName('');
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
      <SuccessToast message={toast.message} />
      <Table
        key={tableRefresh.key}
        title={t('title')}
        subtitle={t('subtitle')}
        endpoint="/api/admin/stations/fetch"
        onAddNew={handleAddNew}
        onEdit={handleEditStation}
        onDelete={handleRemoveStation}
        columnConfig={columnConfig}
        actionsLabel={t('columns.actions')}
      />
      <MapModal />
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
