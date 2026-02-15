//======================================================================================================================
//?  Imports
//======================================================================================================================
import {Model, DataTypes, InferAttributes, InferCreationAttributes } from 'sequelize';
import {sequelize} from '../config/database';


//importing interfaces
import { BusScheduleAttributes } from '../interfaces/busScheduleInterface';

//importing enums
import {weekDays, shiftType} from '../enums/busScheduleEnum';

//==============================================================================================================================================
//? Model class
//==============================================================================================================================================
class BusScheduleModel extends Model< InferAttributes<BusScheduleModel>, InferCreationAttributes<BusScheduleModel> > implements BusScheduleAttributes { 
  // the two generic defined help in illustrating which fileds exist in DB, and which ones are optional or default when creating  a new reacord (specially the second type allow us to skip auto-generated or default columns whe creating new record)
  
  //declaring the propeties for User class. it's values will be assinged by sequelize at runtime


    declare id:string;
    declare date:Date;
    declare day: keyof typeof weekDays;
    declare shiftType: keyof typeof shiftType;
    declare driverId: string;
    declare routeId: string;
    declare busId: string;
    declare createdAt: Date;
    declare createdBy: string;
    declare updatedAt?: Date;
    declare updatedBy?: string;
}

//======================================================================================================================
//? Initialize the table
//======================================================================================================================
BusScheduleModel.init( {
    id: {
      type: DataTypes.STRING(4),
      primaryKey: true,
      allowNull: false
    },
    date: { type: DataTypes.DATE,
      allowNull: false
    },
    day: {
      type: DataTypes.ENUM(...Object.values(weekDays) as string[]),
      allowNull: false
    },
    shiftType: {
      type: DataTypes.ENUM(...Object.values(shiftType) as string[]),
      allowNull: false
    },



    driverId: { 
      type: DataTypes.STRING(4),
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    busId: {
      type: DataTypes.STRING(4),
      allowNull: false,
      references: {
        model: 'buses',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    routeId: {
      type: DataTypes.STRING(4),
      allowNull: false,
      references: {
        model: 'routes',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },

    
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    createdBy: {
      type: DataTypes.STRING(4),
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedBy: {
      type: DataTypes.STRING(4),
      allowNull: true,
      
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },

  },
  {
    sequelize,// to attach the User model to the database connection i've defined in databaseConnection.ts
    tableName: 'bus_schedule',
    timestamps: false, // it creates  createdAt / updatedAt columns
    indexes: [ // defining the uniquness for the bus schedule keys
      {
        name: 'UQ_busSchedule_date_shiftType_driver',
        unique: true,
        fields: ['date', 'shiftType', 'driverId']
      },
      {
        name: 'UQ_busSchedule_date_shiftType_bus',
        unique: true,
        fields: ['date', 'shiftType', 'busId']
      }
    ],
  }
);


//======================================================================================================================================

export default BusScheduleModel;
