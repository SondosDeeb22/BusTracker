"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//======================================================================================================================
//?  Imports
//======================================================================================================================
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const routeStationModel_1 = __importDefault(require("./routeStationModel"));
const stationModel_1 = __importDefault(require("./stationModel"));
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
    color: { type: sequelize_1.DataTypes.STRING(30),
        allowNull: false
    },
    totalStops: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(routeEnum_1.status)),
        allowNull: false
    },
}, {
    sequelize: database_1.sequelize, // to attach the User model to the database connection i've defined in databaseConnection.ts
    tableName: 'routes',
    timestamps: false, // it creates  createdAt / updatedAt columns
});
//======================================================================================================================================
exports.default = RouteModel;
// Associations (keeps station links discoverable in DB)
RouteModel.hasMany(routeStationModel_1.default, {
    foreignKey: 'routeId',
    as: 'routeStations'
});
routeStationModel_1.default.belongsTo(RouteModel, {
    foreignKey: 'routeId',
    as: 'route'
});
routeStationModel_1.default.belongsTo(stationModel_1.default, {
    foreignKey: 'stationId',
    as: 'station'
});
stationModel_1.default.hasMany(routeStationModel_1.default, {
    foreignKey: 'stationId',
    as: 'routeStations'
});
//# sourceMappingURL=routeModel.js.map