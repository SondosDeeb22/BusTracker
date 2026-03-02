//==============================================================================
// importing database models
//==============================================================================
import UserModel from './userModel';
import BusModel from './busModel';
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


