//======================================================================================================================
//?  Imports
//======================================================================================================================
import {Model, DataTypes, InferAttributes, InferCreationAttributes } from 'sequelize';
import {sequelize} from '../config/database';


//importing interfaces
import { BusAttributes } from '../interfaces/busInterface';

//importing enums
import {status} from '../enums/busEnum';

//==============================================================================================================================================
//? Model class
//==============================================================================================================================================
class BusModel extends Model< InferAttributes<BusModel>, InferCreationAttributes<BusModel> > implements BusAttributes { 
  // the two generic defined help in illustrating which fileds exist in DB, and which ones are optional or default when creating  a new reacord (specially the second type allow us to skip auto-generated or default columns whe creating new record)
  
  //declaring the propeties for User class. it's values will be assinged by sequelize at runtime


    declare id: string;
    declare plate: string;
    declare brand: string;
    declare status: keyof typeof status;
    declare assignedRoute: string;
    declare assignedDriver: string;
}

//======================================================================================================================
//? Initialize the table
//======================================================================================================================
BusModel.init( {
    id: {
      type: DataTypes.STRING(4),
      primaryKey: true,
      allowNull: false
    },
    plate: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true
    },    
    brand: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    status: { 
      type: DataTypes.ENUM(...Object.values(status) as string[]),
      allowNull: false
    },
    assignedRoute: {
      type: DataTypes.STRING(4),
      allowNull: false,
      references: {
        model: 'routes',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    assignedDriver: {
      type: DataTypes.STRING(4),
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },


  },
  {
    sequelize,// to attach the User model to the database connection i've defined in databaseConnection.ts
    tableName: 'buses',
    timestamps: false, // it creates  createdAt / updatedAt columns
  }
);

//======================================================================================================================================

export default BusModel;
