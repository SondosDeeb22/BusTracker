// Color Palette for Bus Tracker Application
// Centralized color constants for consistent theming

export const COLORS = {
  // Background colors
  background: '#F2F1ED',
  burgundy: '#59011A',
  navbar: '#DCC4AC',
  
} as const;

// Export individual colors for convenience
export const {
  background,
  burgundy, 
  navbar
} = COLORS;

//======================================================================================
//? Import Backend Enums
//======================================================================================
import { status as busStatus } from '../../../backend/src/enums/busEnum';
import { status as userStatus } from '../../../backend/src/enums/userEnum';
import { status as routeStatus } from '../../../backend/src/enums/routeEnum';
import { status as stationStatus } from '../../../backend/src/enums/stationEnum';

//======================================================================================
//? Status Configuration
//======================================================================================

export const statusConfig = {
  bus: {
    [busStatus.operating]: { 
      color: 'bg-green-100 text-green-800', 
      label: 'Operating',
      priority: 'high'
    },
    [busStatus.offline]: { 
      color: 'bg-gray-100 text-gray-800', 
      label: 'Offline',
      priority: 'low'
    },
    [busStatus.maintenance]: { 
      color: 'bg-yellow-100 text-yellow-800', 
      label: 'Maintenance',
      priority: 'medium'
    }
  },
  driver: {
    [userStatus.active]: { 
      color: 'bg-green-100 text-green-800', 
      label: 'Active',
      priority: 'high'
    },
    [userStatus.passive]: { 
      color: 'bg-red-100 text-red-800', 
      label: 'Passive',
      priority: 'low'
    }
  },
  route: {
    [routeStatus.covered]: { 
      color: 'bg-green-100 text-green-800', 
      label: 'Covered',
      priority: 'high'
    },
    [routeStatus.unassigned]: { 
      color: 'bg-gray-100 text-gray-800', 
      label: 'Unassigned',
      priority: 'low'
    }
  },
  station: {
    [stationStatus.covered]: { 
      color: 'bg-green-100 text-green-800', 
      label: 'Covered',
      priority: 'high'
    },
    [stationStatus.notCovered]: { 
      color: 'bg-red-100 text-red-800', 
      label: 'Not Covered',
      priority: 'low'
    }
  }
};

export type StatusType = 'bus' | 'driver' | 'route' | 'station';

//======================================================================================
//? Helper Functions
//======================================================================================

export const getStatusConfig = (type: StatusType, status: string) => {
  const typeConfig = statusConfig[type];
  if (!typeConfig) {
    return {
      color: 'bg-gray-100 text-gray-800',
      label: status,
      priority: 'low'
    };
  }
  
  return typeConfig[status as keyof typeof typeConfig] || {
    color: 'bg-gray-100 text-gray-800',
    label: status,
    priority: 'low'
  };
};

export const getStatusColor = (type: StatusType, status: string) => {
  return getStatusConfig(type, status).color;
};

export const getStatusLabel = (type: StatusType, status: string) => {
  return getStatusConfig(type, status).label;
};
