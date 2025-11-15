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
class RouteStationModel extends sequelize_1.Model {
}
//======================================================================================================================
//? Initialize the table
//======================================================================================================================
RouteStationModel.init({
    routeStationId: {
        type: sequelize_1.DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
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
    stationId: {
        type: sequelize_1.DataTypes.STRING(4),
        allowNull: false,
        references: {
            model: 'bus_Stations',
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    orderIndex: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'route_stations',
    timestamps: false,
    indexes: [
        {
            name: 'UQ_route_station_pair',
            unique: true,
            fields: ['routeId', 'stationId'],
        },
    ],
});
//======================================================================================================================================
exports.default = RouteStationModel;
//# sourceMappingURL=routeStationModel.js.map