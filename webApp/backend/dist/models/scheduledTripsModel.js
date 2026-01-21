"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//======================================================================================================================
//?  Imports
//======================================================================================================================
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class ScheduledTripsModel extends sequelize_1.Model {
}
//======================================================================================================================
//? Initialize the table
//======================================================================================================================
ScheduledTripsModel.init({
    detailedScheduleId: {
        type: sequelize_1.DataTypes.STRING(4),
        primaryKey: true,
        allowNull: false,
    },
    scheduleId: {
        type: sequelize_1.DataTypes.STRING(4),
        allowNull: false,
        references: {
            model: 'schedules',
            key: 'scheduleId',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    time: {
        type: sequelize_1.DataTypes.TIME,
        allowNull: false,
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
}, {
    sequelize: database_1.sequelize,
    tableName: 'scheduled_trips',
    timestamps: false,
});
exports.default = ScheduledTripsModel;
//# sourceMappingURL=scheduledTripsModel.js.map