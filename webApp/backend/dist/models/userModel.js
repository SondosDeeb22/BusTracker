"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//======================================================================================================================
//?  Imports
//======================================================================================================================
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
//importing enums
const userEnum_1 = require("../enums/userEnum");
//==============================================================================================================================================
//? Model class
//==============================================================================================================================================
class UserModel extends sequelize_1.Model {
}
//======================================================================================================================
//? Initialize the table
//======================================================================================================================
UserModel.init({
    id: {
        type: sequelize_1.DataTypes.STRING(4),
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false
    },
    role: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(userEnum_1.role)),
        allowNull: false
    },
    gender: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(userEnum_1.gender)),
        allowNull: false,
        defaultValue: userEnum_1.gender.male
    },
    birthDate: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: false
    },
    phone: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false
    },
    email: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false
    },
    licenseNumber: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false
    },
    licenseExpiryDate: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: false
    },
    status: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(userEnum_1.status)),
        allowNull: false,
        defaultValue: userEnum_1.status.passive
    },
    hashedPassword: {
        type: sequelize_1.DataTypes.STRING(150),
        allowNull: true,
        defaultValue: null
    },
    language: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(userEnum_1.language)),
        allowNull: false,
        defaultValue: userEnum_1.language.turkish
    },
    appearance: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(userEnum_1.appearance)),
        allowNull: false,
        defaultValue: userEnum_1.appearance.light
    }
}, {
    sequelize: database_1.sequelize, // to attach the User model to the database connection i've defined in databaseConnection.ts
    tableName: 'users',
    timestamps: false, // it creates  createdAt / updatedAt columns
});
//======================================================================================================================================
exports.default = UserModel;
//# sourceMappingURL=userModel.js.map