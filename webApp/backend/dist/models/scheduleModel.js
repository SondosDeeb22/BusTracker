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
class ScheduleModel extends sequelize_1.Model {
}
//======================================================================================================================
//? Initialize the table
//======================================================================================================================
ScheduleModel.init({
    scheduleId: {
        type: sequelize_1.DataTypes.STRING(4),
        primaryKey: true,
        allowNull: false,
    },
    date: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: false,
    },
    day: {
        type: sequelize_1.DataTypes.STRING(10),
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
}, {
    sequelize: database_1.sequelize,
    tableName: 'schedules',
    timestamps: false,
});
//======================================================================================================================================
exports.default = ScheduleModel;
//# sourceMappingURL=scheduleModel.js.map