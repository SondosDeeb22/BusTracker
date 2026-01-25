"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//======================================================================================================================
//?  Imports
//======================================================================================================================
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
//======================================================================================================================
class LoginAttemptModel extends sequelize_1.Model {
}
//======================================================================================================================
LoginAttemptModel.init({
    attemptID: {
        type: sequelize_1.DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    }, userEmail: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false
    }, IPaddress: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true
    }, attemptLocation: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true
    }, attemptSuccessful: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false
    }, attemptTime: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    }, attemptDate: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: false,
    }
}, {
    sequelize: database_1.sequelize,
    tableName: 'login_attempt',
    timestamps: false
});
//======================================================================================================================
exports.default = LoginAttemptModel;
//# sourceMappingURL=loginAttempModel.js.map