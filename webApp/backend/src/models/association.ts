//==============================================================================
// importing database models
//==============================================================================
import UserModel from './userModel';
import BusModel from './busModel';
import BusScheduleModel from './busScheduleModel';
import RouteModel from './routeModel';
import stationModel from './stationModel';
import RouteStationModel from './routeStationModel';

import ServicePatternModel from './servicePatternModel';
import OperatingHoursModel from './operatingHoursModel';
import ScheduleModel from './scheduleModel';
import ScheduledTripsModel from './scheduledTripsModel';

//-------------------------------------------------------------------------------------------------------------------------------------
//? Buses Tables associatoin: define the foreign keys relation
//-------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------
//? RouteStation Tables associatoin: define the foreign keys relation /
//-------------------------------------------------------------------------------------------------------------------------------------

RouteModel.belongsToMany(stationModel, {
    through: RouteStationModel,
    foreignKey: 'routeId',
    otherKey: 'stationId',
});

stationModel.belongsToMany(RouteModel, {
    through: RouteStationModel,
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
OperatingHoursModel.belongsTo(ServicePatternModel,{
    foreignKey: 'servicePatternId',
    as: 'servicePattern',
    onDelete: 'CASCADE',
});

ServicePatternModel.hasMany(OperatingHoursModel,{
    foreignKey: 'servicePatternId',
    as: 'operatingHours'
});


//-------------------------------------------------------------------------------------------------------------------------------------
//?? Schedule Model 
//-------------------------------------------------------------------------------------------------------------------------------------
ScheduleModel.belongsTo(ServicePatternModel,{
    foreignKey: 'servicePatternId',
    as: 'servicePattern', 
    onDelete: 'CASCADE',
});

ServicePatternModel.hasMany(ScheduleModel,{
    foreignKey: 'servicePatternId',
    as: 'schedules'
});







//-------------------------------------------------------------------------------------------------------------------------------------
//?? Scheduled Trips Model 
//-------------------------------------------------------------------------------------------------------------------------------------
ScheduledTripsModel.belongsTo(ScheduleModel,{
    foreignKey: 'scheduleId',
    as: 'schedule'
});

ScheduleModel.hasMany(ScheduledTripsModel,{
    foreignKey: 'scheduleId',
    as: 'trips'
});

//---------------------------------------------------------

ScheduledTripsModel.belongsTo(RouteModel,{
    foreignKey: 'routeId',
    as: 'route',
    onDelete: 'CASCADE',
});

RouteModel.hasMany(ScheduledTripsModel,{
    foreignKey: 'routeId',
});

//---------------------------------------------------------

ScheduledTripsModel.belongsTo(UserModel,{
    foreignKey: 'driverId',
    as: 'driver',
    onDelete: 'CASCADE',
});

UserModel.hasMany(ScheduledTripsModel,{
    foreignKey: 'driverId',
});

//---------------------------------------------------------

ScheduledTripsModel.belongsTo(BusModel,{
    foreignKey: 'busId',
    as: 'bus',
    onDelete: 'CASCADE',
});

BusModel.hasMany(ScheduledTripsModel,{
    foreignKey: 'busId',
});


