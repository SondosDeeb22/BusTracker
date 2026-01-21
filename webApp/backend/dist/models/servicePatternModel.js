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
class ServicePatternModel extends sequelize_1.Model {
}
//======================================================================================================================
//? Initialize the table
//======================================================================================================================
ServicePatternModel.init({
    servicePatternId: {
        type: sequelize_1.DataTypes.STRING(4),
        primaryKey: true,
        allowNull: false,
    },
    title: {
        type: sequelize_1.DataTypes.STRING(30),
        allowNull: false,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'service_patterns',
    timestamps: false,
});
//======================================================================================================================================
exports.default = ServicePatternModel;
//# sourceMappingURL=servicePatternModel.js.map