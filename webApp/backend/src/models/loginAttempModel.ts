//======================================================================================================================
//?  Imports
//======================================================================================================================
import {Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import {sequelize} from '../config/database';

//import interface
import { LoginAttemptData } from '../interfaces/loginAttemptInterface';

//======================================================================================================================

class LoginAttemptModel extends Model<InferAttributes<LoginAttemptModel>, InferCreationAttributes<LoginAttemptModel>>{
    declare attemptID: CreationOptional<number>;
    declare userEmail: string;
    declare IPaddress: string | null;
    declare attemptLocation: string | null;
    declare attemptSuccessful: boolean;
    declare attemptTime: string;
    declare attemptDate: Date;
}

//======================================================================================================================

LoginAttemptModel.init(
    {
        attemptID:{
            type: DataTypes.BIGINT,
            autoIncrement: true, 
            primaryKey: true,
            allowNull: false
        },userEmail:{
            type: DataTypes.STRING(100),
            allowNull: false
        }, IPaddress: {
            type: DataTypes.STRING(100),
            allowNull: true
        }, attemptLocation:{
            type: DataTypes.STRING(100),
            allowNull:true
        }, attemptSuccessful:{
            type: DataTypes.BOOLEAN,
            allowNull: false
        }, attemptTime:{
            type:DataTypes.STRING,
            allowNull:false,
        },attemptDate:{
            type: DataTypes.DATEONLY,
            allowNull:false,
        }
    },
  {
    sequelize, 
    tableName: 'login_attempt',
    timestamps: false
  }
)

//======================================================================================================================

export default LoginAttemptModel;