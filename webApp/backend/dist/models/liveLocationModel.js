"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//======================================================================================================================
//?  Imports
//======================================================================================================================
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
//======================================================================================================================
class LiveLocationModel extends sequelize_1.Model {
}
//======================================================================================================================
LiveLocationModel.init({
    busId: {
        type: sequelize_1.DataTypes.STRING(50),
        primaryKey: true,
        allowNull: false
    }, latitude: {
        type: sequelize_1.DataTypes.DOUBLE,
        allowNull: true
    }, longitude: {
        type: sequelize_1.DataTypes.DOUBLE,
        allowNull: true
    }, lastUpdate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    }
}, {
    sequelize: database_1.sequelize,
    tableName: 'live_location',
    timestamps: false
});
//======================================================================================================================
exports.default = LiveLocationModel;
//# sourceMappingURL=liveLocationModel.js.map