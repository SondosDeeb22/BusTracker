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
const routeModel_1 = __importDefault(require("./routeModel"));
const stationModel_1 = __importDefault(require("./stationModel"));
const routeStationModel_1 = __importDefault(require("./routeStationModel"));
const servicePatternModel_1 = __importDefault(require("./servicePatternModel"));
const operatingHoursModel_1 = __importDefault(require("./operatingHoursModel"));
const scheduleModel_1 = __importDefault(require("./scheduleModel"));
const scheduledTripsModel_1 = __importDefault(require("./scheduledTripsModel"));
//-------------------------------------------------------------------------------------------------------------------------------------
//? Buses Tables associatoin: define the foreign keys relation
//-------------------------------------------------------------------------------------------------------------------------------------
busModel_1.default.belongsTo(userModel_1.default, {
    foreignKey: 'assignedDriver',
    as: 'driver',
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
// // Route Model ---------------------------------------------------------------------------------
// BusScheduleModel.belongsTo(RouteModel,{
//     foreignKey: 'routeId',
//     as: 'route',
//     onDelete: 'CASCADE',
// });
// RouteModel.hasMany(BusScheduleModel,{
//     foreignKey: 'routeId',
// });
// // User Model (creator) ---------------------------------------------------------------------------------
// BusScheduleModel.belongsTo(UserModel, {
//     foreignKey: 'createdBy',
//     as: 'creator',
//     onDelete: 'CASCADE',
// });
// UserModel.hasOne(BusScheduleModel,{
//     foreignKey: 'createdBy',
// });
// // User Model (updater) ---------------------------------------------------------------------------------
// BusScheduleModel.belongsTo(UserModel,{
//     foreignKey: 'updatedBy',
//     as: 'updater',
//     onDelete: 'CASCADE',
// });
// UserModel.hasMany(BusScheduleModel,{
//     foreignKey: 'updatedBy',
// });
// // User Model (driver) ---------------------------------------------------------------------------------
// BusScheduleModel.belongsTo(UserModel, {
//   foreignKey: 'driverId',
//   as: 'driver',
//   onDelete: 'RESTRICT',
// });
// UserModel.hasMany(BusScheduleModel, {
//   foreignKey: 'driverId',
// });
// // Bus Model ---------------------------------------------------------------------------------
// BusScheduleModel.belongsTo(BusModel, {
//     foreignKey: 'busId',
//     onDelete: 'RESTRICT',
// });
// BusModel.hasMany(BusScheduleModel, {
//     foreignKey: 'busId',
// });
//-------------------------------------------------------------------------------------------------------------------------------------
//?? Service Pattern Model 
//-------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------
//?? Operating Hours Model 
//-------------------------------------------------------------------------------------------------------------------------------------
operatingHoursModel_1.default.belongsTo(servicePatternModel_1.default, {
    foreignKey: 'servicePatternId',
    as: 'servicePattern',
    onDelete: 'CASCADE',
});
servicePatternModel_1.default.hasMany(operatingHoursModel_1.default, {
    foreignKey: 'servicePatternId',
    as: 'operatingHours'
});
//-------------------------------------------------------------------------------------------------------------------------------------
//?? Schedule Model 
//-------------------------------------------------------------------------------------------------------------------------------------
scheduleModel_1.default.belongsTo(servicePatternModel_1.default, {
    foreignKey: 'servicePatternId',
    as: 'servicePattern',
    onDelete: 'CASCADE',
});
servicePatternModel_1.default.hasMany(scheduleModel_1.default, {
    foreignKey: 'servicePatternId',
    as: 'schedules'
});
//-------------------------------------------------------------------------------------------------------------------------------------
//?? Scheduled Trips Model 
//-------------------------------------------------------------------------------------------------------------------------------------
scheduledTripsModel_1.default.belongsTo(scheduleModel_1.default, {
    foreignKey: 'scheduleId',
    as: 'schedule'
});
scheduleModel_1.default.hasMany(scheduledTripsModel_1.default, {
    foreignKey: 'scheduleId',
    as: 'trips'
});
//---------------------------------------------------------
scheduledTripsModel_1.default.belongsTo(routeModel_1.default, {
    foreignKey: 'routeId',
    as: 'route',
    onDelete: 'CASCADE',
});
routeModel_1.default.hasMany(scheduledTripsModel_1.default, {
    foreignKey: 'routeId',
});
//---------------------------------------------------------
scheduledTripsModel_1.default.belongsTo(userModel_1.default, {
    foreignKey: 'driverId',
    as: 'driver',
    onDelete: 'CASCADE',
});
userModel_1.default.hasMany(scheduledTripsModel_1.default, {
    foreignKey: 'driverId',
});
//---------------------------------------------------------
scheduledTripsModel_1.default.belongsTo(busModel_1.default, {
    foreignKey: 'busId',
    as: 'bus',
    onDelete: 'CASCADE',
});
busModel_1.default.hasMany(scheduledTripsModel_1.default, {
    foreignKey: 'busId',
});
//# sourceMappingURL=association.js.map