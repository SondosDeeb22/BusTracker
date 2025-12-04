//==============================================================================
// importing database models
//==============================================================================
import UserModel from './userModel';
import BusModel from './busModel';
import BusScheduleModel from './busScheduleModel';
import RouteModel from './routeModel';
import stationModel from './stationModel';
import RouteStationModel from './routeStationModel';



//-------------------------------------------------------------------------------------------------------------------------------------
//? Buses Tables associatoin: define the foreign keys relation
//-------------------------------------------------------------------------------------------------------------------------------------
BusModel.belongsTo(UserModel,{
    foreignKey: 'assignedDriver',
    as: 'driver', // I don't feel we need it, lets see 26/10/2025
    onDelete: 'CASCADE',
});

UserModel.hasOne(BusModel,{
    foreignKey: 'assignedDriver',
})

//---------------------------------------------------------------------------------

BusModel.belongsTo(RouteModel,{
    foreignKey: 'assignedRoute',
    as: 'route',
    onDelete: 'CASCADE',
});

RouteModel.hasMany(BusModel,{ //many buses per route
    foreignKey: 'assignedRoute',
})


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

// Route Model ---------------------------------------------------------------------------------

BusScheduleModel.belongsTo(RouteModel,{
    foreignKey: 'routeId',
    onDelete: 'CASCADE',
});

RouteModel.hasMany(BusScheduleModel,{
    foreignKey: 'routeId',
});

// User Model (creator) ---------------------------------------------------------------------------------


BusScheduleModel.belongsTo(UserModel, {
    foreignKey: 'createdBy',
    as: 'creator',
    onDelete: 'CASCADE',
});

UserModel.hasOne(BusScheduleModel,{
    foreignKey: 'createdBy',
});

// User Model (updater) ---------------------------------------------------------------------------------


BusScheduleModel.belongsTo(UserModel,{
    foreignKey: 'updatedBy',
    as: 'updater',
    onDelete: 'CASCADE',
});

UserModel.hasOne(BusScheduleModel,{
    foreignKey: 'updatedBy',
});

// User Model (driver) ---------------------------------------------------------------------------------

BusScheduleModel.belongsTo(UserModel, {
  foreignKey: 'driverId',
  onDelete: 'RESTRICT',
});
UserModel.hasMany(BusScheduleModel, {
  foreignKey: 'driverId',
});


// Bus Model ---------------------------------------------------------------------------------


BusScheduleModel.belongsTo(BusModel, {
    foreignKey: 'busId',
    onDelete: 'RESTRICT',
});

BusModel.hasMany(BusScheduleModel, {
    foreignKey: 'busId',
});