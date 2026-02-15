//======================================================================================================================
//?  Imports
//======================================================================================================================
import {Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import {sequelize} from '../config/database';

//import interface
import { LiveLocationInterface } from '../interfaces/liveLocationInterface';
//======================================================================================================================

class LiveLocationModel extends Model<InferAttributes<LiveLocationModel>, InferCreationAttributes<LiveLocationModel>> implements LiveLocationInterface{
    declare busId: string;
    declare latitude: number| null ;
    declare longitude: number | null;
    declare lastUpdate: Date | null;

}

//======================================================================================================================

LiveLocationModel.init(
    {
        busId:{
            type: DataTypes.STRING(50),
            primaryKey: true,
            allowNull: false

        },latitude:{
            type: DataTypes.DOUBLE,
            allowNull: true

        }, longitude: {
            type: DataTypes.DOUBLE,
            allowNull: true
            
        }, lastUpdate:{
            type: DataTypes.DATE,
            allowNull:true
        }
    },
  {
    sequelize, 
    tableName: 'live_location',
    timestamps: false
  }
)

//======================================================================================================================

export default LiveLocationModel;