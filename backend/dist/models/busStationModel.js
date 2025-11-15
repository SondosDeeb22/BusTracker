"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//======================================================================================================================
//?  Imports
//======================================================================================================================
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
//importing enums
const busStationEnum_1 = require("../enums/busStationEnum");
//==============================================================================================================================================
//? Model class
//==============================================================================================================================================
class BusStationModel extends sequelize_1.Model {
}
//======================================================================================================================
//? Initialize the table
//======================================================================================================================
BusStationModel.init({
    id: {
        type: sequelize_1.DataTypes.STRING(4),
        primaryKey: true,
        allowNull: false
    },
    stationName: {
        type: sequelize_1.DataTypes.STRING(30),
        allowNull: false
    },
    latitude: {
        type: sequelize_1.DataTypes.STRING(30),
        allowNull: false
    },
    longitude: {
        type: sequelize_1.DataTypes.STRING(30),
        allowNull: false
    },
    status: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(busStationEnum_1.status)),
        allowNull: false
    },
    // assignedRoute: {
    //   type: DataTypes.JSON,
    //   allowNull: false
    // },
}, {
    sequelize: database_1.sequelize, // to attach the User model to the database connection i've defined in databaseConnection.ts
    tableName: 'bus_Stations',
    timestamps: false, // it creates  createdAt / updatedAt columns
});
//======================================================================================================================================
exports.default = BusStationModel;
//# sourceMappingURL=busStationModel.js.map