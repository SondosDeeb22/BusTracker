"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//======================================================================================================================
//?  Imports
//======================================================================================================================
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
//importing enums
const busEnum_1 = require("../enums/busEnum");
//==============================================================================================================================================
//? Model class
//==============================================================================================================================================
class BusModel extends sequelize_1.Model {
}
//======================================================================================================================
//? Initialize the table
//======================================================================================================================
BusModel.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    serialNumber: { type: sequelize_1.DataTypes.STRING(30),
        allowNull: false
    },
    brand: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(busEnum_1.status)),
        allowNull: false
    },
    assignedRoute: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    assignedDriver: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
}, {
    sequelize: database_1.sequelize, // to attach the User model to the database connection i've defined in databaseConnection.ts
    tableName: 'buses',
    timestamps: false, // it creates  createdAt / updatedAt columns
});
//======================================================================================================================================
exports.default = BusModel;
//# sourceMappingURL=busModel%20copy.js.map