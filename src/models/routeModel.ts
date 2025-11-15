//======================================================================================================================
//?  Imports
//======================================================================================================================
import {Model, DataTypes, InferAttributes, InferCreationAttributes } from 'sequelize';
import {sequelize} from '../config/database';


//importing interfaces
import { RouteAttributes } from '../interfaces/routeInterface';

//importing enums
import {status} from '../enums/routeEnum';

//==============================================================================================================================================
//? Model class
//==============================================================================================================================================
class RouteModel extends Model< InferAttributes<RouteModel>, InferCreationAttributes<RouteModel> > implements RouteAttributes { 
  // the two generic defined help in illustrating which fileds exist in DB, and which ones are optional or default when creating  a new reacord (specially the second type allow us to skip auto-generated or default columns whe creating new record)
  
  //declaring the propeties for User class. it's values will be assinged by sequelize at runtime

    declare id: string;
    declare title: string;
    // declare stopStations: string[];
    declare totalStops: number;
    declare status: keyof typeof status;
    // declare assignedBuses: string[];
}

//======================================================================================================================
//? Initialize the table
//======================================================================================================================
RouteModel.init( {
    id: {
      type: DataTypes.STRING(4),
      primaryKey: true,
      allowNull: false
    },
    title: { type: DataTypes.STRING(30),
      allowNull: false
    },
    // stopStations: {
    //   type: DataTypes.JSON,
    //   allowNull: false
    // },
    totalStops: { 
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM(...Object.values(status) as string[]),
      allowNull: false
    },
    // assignedBuses: {
    //   type: DataTypes.JSON,
    //   allowNull: false
    // },


  },
  {
    sequelize,// to attach the User model to the database connection i've defined in databaseConnection.ts
    tableName: 'routes',
    timestamps: false, // it creates  createdAt / updatedAt columns
  }
);

//======================================================================================================================================

export default RouteModel;
