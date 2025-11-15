"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//======================================================================================================================
//?  Imports
//======================================================================================================================
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
//importing enums
const busScheduleEnum_1 = require("../enums/busScheduleEnum");
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
        type: sequelize_1.DataTypes.STRING(4),
        primaryKey: true,
        allowNull: false
    },
    date: { type: sequelize_1.DataTypes.DATE,
        allowNull: false
    },
    day: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(busScheduleEnum_1.weekDays)),
        allowNull: false
    },
    driverId: {
        type: sequelize_1.DataTypes.STRING(4),
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    busId: {
        type: sequelize_1.DataTypes.STRING(4),
        allowNull: false,
        references: {
            model: 'buses',
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    routeId: {
        type: sequelize_1.DataTypes.STRING(4),
        allowNull: false,
        references: {
            model: 'routes',
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false
    },
    createdBy: {
        type: sequelize_1.DataTypes.STRING(4),
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
    },
    lastupdated: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false
    },
    updatedBy: {
        type: sequelize_1.DataTypes.STRING(4),
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
    },
}, {
    sequelize: database_1.sequelize, // to attach the User model to the database connection i've defined in databaseConnection.ts
    tableName: 'bus_Schedule',
    timestamps: false, // it creates  createdAt / updatedAt columns
    indexes: [
        {
            name: 'UQ_busSchedule_date_driver_bus',
            unique: true,
            fields: ['date', 'driverId', 'busId']
        }
    ],
});
//======================================================================================================================================
exports.default = BusScheduleModel;
//# sourceMappingURL=busScheduleModel.js.map