"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//======================================================================================================================
//?  Imports
//======================================================================================================================
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
//importing enums
const stationEnum_1 = require("../enums/stationEnum");
//==============================================================================================================================================
//? Model class
//==============================================================================================================================================
class stationModel extends sequelize_1.Model {
}
//======================================================================================================================
//? Initialize the table
//======================================================================================================================
stationModel.init({
    id: {
        type: sequelize_1.DataTypes.STRING(4),
        primaryKey: true,
        allowNull: false
    },
    stationName: {
        type: sequelize_1.DataTypes.STRING(250),
        allowNull: false
    },
    latitude: {
        type: sequelize_1.DataTypes.DOUBLE,
        allowNull: false
    },
    longitude: {
        type: sequelize_1.DataTypes.DOUBLE,
        allowNull: false
    },
    status: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(stationEnum_1.status)),
        allowNull: false,
        defaultValue: stationEnum_1.status.notCovered
    },
    // assignedRoute: {
    //   type: DataTypes.JSON,
    //   allowNull: false
    // },
}, {
    sequelize: database_1.sequelize, // to attach the User model to the database connection i've defined in databaseConnection.ts
    tableName: 'stations',
    timestamps: false, // it creates  createdAt / updatedAt columns
});
//======================================================================================================================================
exports.default = stationModel;
//# sourceMappingURL=stationModel.js.map