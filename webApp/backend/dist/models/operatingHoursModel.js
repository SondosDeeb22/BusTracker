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
const servicePatternModel_1 = __importDefault(require("./servicePatternModel"));
//==============================================================================================================================================
//? Model class
//==============================================================================================================================================
class OperatingHoursModel extends sequelize_1.Model {
}
//======================================================================================================================
//? Initialize the table
//======================================================================================================================
OperatingHoursModel.init({
    operatingHourId: {
        type: sequelize_1.DataTypes.STRING(4),
        primaryKey: true,
        allowNull: false,
    },
    servicePatternId: {
        type: sequelize_1.DataTypes.STRING(4),
        allowNull: false,
        references: {
            model: servicePatternModel_1.default,
            key: 'servicePatternId',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    hour: {
        type: sequelize_1.DataTypes.TIME,
        allowNull: false,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'operating_hours',
    timestamps: false,
});
//======================================================================================================================================
exports.default = OperatingHoursModel;
//# sourceMappingURL=operatingHoursModel.js.map