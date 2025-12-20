"use strict";
// //======================================================================================================================
// //?  Imports
// //======================================================================================================================
// import {Model, DataTypes, InferAttributes, InferCreationAttributes } from 'sequelize';
// import {sequelize} from '../config/database';
Object.defineProperty(exports, "__esModule", { value: true });
// //importing interfaces
// import { userAttributes } from '../interfaces/userInterface';
// //importing enums
// import {role, gender, status} from '../enums/userEnum';
// //==============================================================================================================================================
// //? Model class
// //==============================================================================================================================================
// class UserModel extends Model< InferAttributes<UserModel>, InferCreationAttributes<UserModel> > implements userAttributes { 
//   // the two generic defined help in illustrating which fileds exist in DB, and which ones are optional or default when creating  a new reacord (specially the second type allow us to skip auto-generated or default columns whe creating new record)
//   //declaring the propeties for User class. it's values will be assinged by sequelize at runtime
//   declare userID: number;
//   declare username: string;
//   declare userRole: keyof typeof role;
//   declare userBirthDate: Date;
//   declare userGender: keyof typeof gender;
//   declare userPhone: string;
//   declare userEmail: string;
//   declare userLicenseNumber: string;
//   declare userLicenseExpiryDate: Date;
//   declare userStatus: keyof typeof status;
//   declare userHashedPassword: string;
// }
// //======================================================================================================================
// //? Initialize the table
// //======================================================================================================================
// UserModel.init( {
//     userID: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       allowNull: false
//     },
//     username: { type: DataTypes.STRING(30),
//       allowNull: false
//     },
//     userRole: {
//       type: DataTypes.ENUM(...Object.values(role) as string[]),
//       allowNull: false
//     },
//     userBirthDate: { 
//       type: DataTypes.DATEONLY ,
//       allowNull: false
//     },
//     userGender: {
//       type: DataTypes.ENUM(...Object.values(gender) as string[]),
//       allowNull: false
//     },
//     userPhone: { 
//       type: DataTypes.STRING(50) ,
//       allowNull: false
//     },
//     userEmail: { 
//       type: DataTypes.STRING(50) ,
//       allowNull: false
//     },
//     userLicenseNumber: { 
//       type: DataTypes.STRING(50),
//       allowNull: false
//     },
//     userLicenseExpiryDate: {
//       type: DataTypes.DATE,
//       allowNull: false
//     },
//     userStatus: {
//       type: DataTypes.ENUM(...Object.values(status) as string[])
//     },
//     userHashedPassword: { 
//       type: DataTypes.STRING(150),
//       allowNull: false
//     }
//   },
//   {
//     sequelize,// to attach the User model to the database connection i've defined in databaseConnection.ts
//     tableName: 'users',
//     timestamps: false, // it creates  createdAt / updatedAt columns
//   }
// );
// //======================================================================================================================================
// export default UserModel;
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
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    name: { type: sequelize_1.DataTypes.STRING(30),
        allowNull: false
    },
    role: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(userEnum_1.role)),
        allowNull: false
    },
    birthDate: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: false
    },
    gender: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(userEnum_1.gender)),
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
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false
    },
    licenseExpiryDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(userEnum_1.status))
    },
    hashedPassword: {
        type: sequelize_1.DataTypes.STRING(150),
        allowNull: false
    }
}, {
    sequelize: database_1.sequelize, // to attach the User model to the database connection i've defined in databaseConnection.ts
    tableName: 'users',
    timestamps: false, // it creates  createdAt / updatedAt columns
});
//======================================================================================================================================
exports.default = UserModel;
//# sourceMappingURL=userModel%20copy.js.map