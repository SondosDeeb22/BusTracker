"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//======================================================================================================================
//?  Imports
//======================================================================================================================
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
//==============================================================================================================================================
//? Model class
//==============================================================================================================================================
class BusScheduleModel extends sequelize_1.Model {
}
//======================================================================================================================
//? Initialize the table
//======================================================================================================================
BusScheduleModel.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    date: { type: sequelize_1.DataTypes.DATE,
        allowNull: false
    },
    day: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    driverId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    busId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    routeId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false
    },
    createdBy: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    lastupdated: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false
    },
    updatedBy: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
}, {
    sequelize: database_1.sequelize, // to attach the User model to the database connection i've defined in databaseConnection.ts
    tableName: 'busSchedule',
    timestamps: false, // it creates  createdAt / updatedAt columns
});
//======================================================================================================================================
exports.default = BusScheduleModel;
//# sourceMappingURL=busScheduleModel%20copy.js.map