"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//==============================================================================
// importing database models
//==============================================================================
const userModel_1 = __importDefault(require("./userModel"));
const busModel_1 = __importDefault(require("./busModel"));
const busScheduleModel_1 = __importDefault(require("./busScheduleModel"));
const routeModel_1 = __importDefault(require("./routeModel"));
const stationModel_1 = __importDefault(require("./stationModel"));
const routeStationModel_1 = __importDefault(require("./routeStationModel"));
//-------------------------------------------------------------------------------------------------------------------------------------
//? Buses Tables associatoin: define the foreign keys relation
//-------------------------------------------------------------------------------------------------------------------------------------
busModel_1.default.belongsTo(userModel_1.default, {
    foreignKey: 'assignedDriver',
    as: 'driver', // I don't feel we need it, lets see 26/10/2025
    onDelete: 'CASCADE',
});
userModel_1.default.hasOne(busModel_1.default, {
    foreignKey: 'assignedDriver',
});
//---------------------------------------------------------------------------------
busModel_1.default.belongsTo(routeModel_1.default, {
    foreignKey: 'assignedRoute',
    as: 'route',
    onDelete: 'CASCADE',
});
routeModel_1.default.hasMany(busModel_1.default, {
    foreignKey: 'assignedRoute',
});
//-------------------------------------------------------------------------------------------------------------------------------------
//? RouteStation Tables associatoin: define the foreign keys relation /
//-------------------------------------------------------------------------------------------------------------------------------------
routeModel_1.default.belongsToMany(stationModel_1.default, {
    through: routeStationModel_1.default,
    foreignKey: 'routeId',
    otherKey: 'stationId',
});
stationModel_1.default.belongsToMany(routeModel_1.default, {
    through: routeStationModel_1.default,
    foreignKey: 'stationId',
    otherKey: 'routeId',
});
//-------------------------------------------------------------------------------------------------------------------------------------
//? BusSchedule Tables associatoin: define the foreign keys relation
//-------------------------------------------------------------------------------------------------------------------------------------
// Route Model ---------------------------------------------------------------------------------
busScheduleModel_1.default.belongsTo(routeModel_1.default, {
    foreignKey: 'routeId',
    onDelete: 'CASCADE',
});
routeModel_1.default.hasMany(busScheduleModel_1.default, {
    foreignKey: 'routeId',
});
// User Model (creator) ---------------------------------------------------------------------------------
busScheduleModel_1.default.belongsTo(userModel_1.default, {
    foreignKey: 'createdBy',
    as: 'creator',
    onDelete: 'CASCADE',
});
userModel_1.default.hasOne(busScheduleModel_1.default, {
    foreignKey: 'createdBy',
});
// User Model (updater) ---------------------------------------------------------------------------------
busScheduleModel_1.default.belongsTo(userModel_1.default, {
    foreignKey: 'updatedBy',
    as: 'updater',
    onDelete: 'CASCADE',
});
userModel_1.default.hasOne(busScheduleModel_1.default, {
    foreignKey: 'updatedBy',
});
// User Model (driver) ---------------------------------------------------------------------------------
busScheduleModel_1.default.belongsTo(userModel_1.default, {
    foreignKey: 'driverId',
    onDelete: 'RESTRICT',
});
userModel_1.default.hasMany(busScheduleModel_1.default, {
    foreignKey: 'driverId',
});
// Bus Model ---------------------------------------------------------------------------------
busScheduleModel_1.default.belongsTo(busModel_1.default, {
    foreignKey: 'busId',
    onDelete: 'RESTRICT',
});
busModel_1.default.hasMany(busScheduleModel_1.default, {
    foreignKey: 'busId',
});
//# sourceMappingURL=association.js.map