//======================================================================================================================
//?  Imports
//======================================================================================================================
import {Model, DataTypes, InferAttributes, InferCreationAttributes } from 'sequelize';
import {sequelize} from '../config/database';


//importing interfaces
import { userAttributes } from '../interfaces/userInterface';

//importing enums
import {role, gender, status, language, appearance} from '../enums/userEnum';

//==============================================================================================================================================
//? Model class
//==============================================================================================================================================
class UserModel extends Model< InferAttributes<UserModel>, InferCreationAttributes<UserModel> > implements userAttributes { 
  // the two generic defined help in illustrating which fileds exist in DB, and which ones are optional or default when creating  a new reacord (specially the second type allow us to skip auto-generated or default columns whe creating new record)
  
  //declaring the propeties for User class. it's values will be assinged by sequelize at runtime

  declare id: string;
  declare name: string;
  declare role: keyof typeof role;
  declare birthDate: string;
  declare gender: keyof typeof gender;

  declare phone: string;
  declare email: string;

  declare licenseNumber: string;
  declare licenseExpiryDate: string;

  declare status: keyof typeof status;
  declare hashedPassword: string | null;
  declare passwordResetVersion: number;

  declare language: keyof typeof language;
  declare appearance: keyof typeof appearance;
}

//======================================================================================================================
//? Initialize the table
//======================================================================================================================
UserModel.init( {
    id: {
      type: DataTypes.STRING(4),
      primaryKey: true,
      allowNull: false
    },
    name: { 
      type: DataTypes.STRING(50),
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM(...Object.values(role) as string[]),
      allowNull: false
    },
    gender: {
      type: DataTypes.ENUM(...Object.values(gender) as string[]),
      allowNull: false,
      defaultValue: gender.male
    },
    birthDate: { 
      type: DataTypes.DATEONLY,
      allowNull: false
    },


    phone: { 
      type: DataTypes.STRING(50) ,
      allowNull: false
    },
    email: { 
      type: DataTypes.STRING(50) ,
      allowNull: false
    },



    licenseNumber: { 
      type: DataTypes.STRING(10),
      allowNull: false
    },
    licenseExpiryDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },



    status: {
      type: DataTypes.ENUM(...Object.values(status) as string[]),
      allowNull: false,
      defaultValue: status.inactive
    },
    hashedPassword: { 
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: null
    }, 
    passwordResetVersion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    language: {
      type: DataTypes.ENUM(...Object.values(language) as string[]),
      allowNull: false,
      defaultValue: language.turkish
    },
    appearance: {
      type: DataTypes.ENUM(...Object.values(appearance) as string[]),
      allowNull: false,
      defaultValue: appearance.light
    }
  },
  {
    sequelize,// to attach the User model to the database connection i've defined in databaseConnection.ts
    tableName: 'users',
    timestamps: false, // it creates  createdAt / updatedAt columns
  }
);

//======================================================================================================================================

export default UserModel;
