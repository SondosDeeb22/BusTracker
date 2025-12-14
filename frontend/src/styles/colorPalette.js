"use strict";
// Color Palette for Bus Tracker Application
// Centralized color constants for consistent theming
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStatusLabel = exports.getStatusColor = exports.getStatusConfig = exports.statusConfig = exports.navbar = exports.burgundy = exports.background = exports.COLORS = void 0;
exports.COLORS = {
    // Background colors
    background: '#F2F1ED',
    burgundy: '#59011A',
    navbar: '#DCC4AC',
};
// Export individual colors for convenience
exports.background = exports.COLORS.background, exports.burgundy = exports.COLORS.burgundy, exports.navbar = exports.COLORS.navbar;
//======================================================================================
//? Import Backend Enums
//======================================================================================
const busEnum_1 = require("../../../backend/src/enums/busEnum");
const userEnum_1 = require("../../../backend/src/enums/userEnum");
const routeEnum_1 = require("../../../backend/src/enums/routeEnum");
const stationEnum_1 = require("../../../backend/src/enums/stationEnum");
//======================================================================================
//? Status Configuration
//======================================================================================
exports.statusConfig = {
    bus: {
        [busEnum_1.status.operating]: {
            color: 'bg-green-100 text-green-800',
            label: 'Operating',
            priority: 'high'
        },
        [busEnum_1.status.offline]: {
            color: 'bg-gray-100 text-gray-800',
            label: 'Offline',
            priority: 'low'
        },
        [busEnum_1.status.maintenance]: {
            color: 'bg-yellow-100 text-yellow-800',
            label: 'Maintenance',
            priority: 'medium'
        }
    },
    driver: {
        [userEnum_1.status.active]: {
            color: 'bg-green-100 text-green-800',
            label: 'Active',
            priority: 'high'
        },
        [userEnum_1.status.passive]: {
            color: 'bg-red-100 text-red-800',
            label: 'Passive',
            priority: 'low'
        }
    },
    route: {
        [routeEnum_1.status.covered]: {
            color: 'bg-green-100 text-green-800',
            label: 'Covered',
            priority: 'high'
        },
        [routeEnum_1.status.unassigned]: {
            color: 'bg-gray-100 text-gray-800',
            label: 'Unassigned',
            priority: 'low'
        }
    },
    station: {
        [stationEnum_1.status.covered]: {
            color: 'bg-green-100 text-green-800',
            label: 'Covered',
            priority: 'high'
        },
        [stationEnum_1.status.notCovered]: {
            color: 'bg-red-100 text-red-800',
            label: 'Not Covered',
            priority: 'low'
        }
    }
};
//======================================================================================
//? Helper Functions
//======================================================================================
const getStatusConfig = (type, status) => {
    const typeConfig = exports.statusConfig[type];
    if (!typeConfig) {
        return {
            color: 'bg-gray-100 text-gray-800',
            label: status,
            priority: 'low'
        };
    }
    return typeConfig[status] || {
        color: 'bg-gray-100 text-gray-800',
        label: status,
        priority: 'low'
    };
};
exports.getStatusConfig = getStatusConfig;
const getStatusColor = (type, status) => {
    return (0, exports.getStatusConfig)(type, status).color;
};
exports.getStatusColor = getStatusColor;
const getStatusLabel = (type, status) => {
    return (0, exports.getStatusConfig)(type, status).label;
};
exports.getStatusLabel = getStatusLabel;
//# sourceMappingURL=colorPalette.js.map