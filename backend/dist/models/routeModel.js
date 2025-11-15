"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//======================================================================================================================
//?  Imports
//======================================================================================================================
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
//importing enums
const routeEnum_1 = require("../enums/routeEnum");
//==============================================================================================================================================
//? Model class
//==============================================================================================================================================
class RouteModel extends sequelize_1.Model {
}
//======================================================================================================================
//? Initialize the table
//======================================================================================================================
RouteModel.init({
    id: {
        type: sequelize_1.DataTypes.STRING(4),
        primaryKey: true,
        allowNull: false
    },
    title: { type: sequelize_1.DataTypes.STRING(30),
        allowNull: false
    },
    // stopStations: {
    //   type: DataTypes.JSON,
    //   allowNull: false
    // },
    totalStops: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(routeEnum_1.status)),
        allowNull: false
    },
    // assignedBuses: {
    //   type: DataTypes.JSON,
    //   allowNull: false
    // },
}, {
    sequelize: database_1.sequelize, // to attach the User model to the database connection i've defined in databaseConnection.ts
    tableName: 'routes',
    timestamps: false, // it creates  createdAt / updatedAt columns
});
//======================================================================================================================================
exports.default = RouteModel;
//# sourceMappingURL=routeModel.js.map