"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//======================================================================================================================
//?  Imports
//======================================================================================================================
// import {Model, DataTypes, InferAttributes, InferCreationAttributes } from 'sequelize';
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
        type: sequelize_1.DataTypes.STRING(4),
        primaryKey: true,
        allowNull: false
    },
    plate: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false,
        unique: true
    },
    brand: {
        type: sequelize_1.DataTypes.STRING(15),
        allowNull: false
    },
    status: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(busEnum_1.status)),
        allowNull: false
    },
    assignedRoute: {
        type: sequelize_1.DataTypes.STRING(4) || null,
        allowNull: true,
        references: {
            model: 'routes',
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    assignedDriver: {
        type: sequelize_1.DataTypes.STRING(4) || null,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
}, {
    sequelize: database_1.sequelize, // to attach the User model to the database connection i've defined in databaseConnection.ts
    tableName: 'buses',
    timestamps: false, // it creates  createdAt / updatedAt columns
});
//======================================================================================================================================
exports.default = BusModel;
//# sourceMappingURL=busModel.js.map