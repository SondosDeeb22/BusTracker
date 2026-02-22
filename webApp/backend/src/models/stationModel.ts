//======================================================================================================================
//?  Imports
//======================================================================================================================
import {Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional} from 'sequelize';
import {sequelize} from '../config/database';


//importing interfaces
import { stationAttributes } from '../interfaces/stationInterface';

//importing enums
import {defaultType, status} from '../enums/stationEnum';

//==============================================================================================================================================
//? Model class
//==============================================================================================================================================
class stationModel extends Model< InferAttributes<stationModel>, InferCreationAttributes<stationModel> > implements stationAttributes { 
  // the two gener76ic defined help in illustrating which fileds exist in DB, and which ones are optional or default when creating  a new reacord (specially the second type allow us to skip auto-generated or default columns whe creating new record)
  
  //declaring the propeties for User class. it's values will be assinged by sequelize at runtime


    declare id:string;
    declare stationName: string;
    declare latitude: number;
    declare longitude: number;
    declare status: CreationOptional<keyof typeof status>;
    declare isDefault: CreationOptional<boolean>;
    declare defaultType: CreationOptional<keyof typeof defaultType> | null;
}

//======================================================================================================================
//? Initialize the table
//======================================================================================================================
stationModel.init( {
    id: {
      type: DataTypes.STRING(4),
      primaryKey: true,
      allowNull: false
    },
    stationName: { 
       type: DataTypes.STRING(250),
      allowNull: false
    },
    latitude: { 
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    longitude: { 
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    status: { 
      type: DataTypes.ENUM(...Object.values(status) as string[]),
      allowNull: false,
      defaultValue: status.notCovered
    },
	isDefault: {
	  type: DataTypes.BOOLEAN,
	  allowNull: false,
	  defaultValue: false
	},
	defaultType: {
	  type: DataTypes.ENUM(...Object.values(defaultType) as string[]),
	  allowNull: true,
	  defaultValue: null
	},
    // assignedRoute: {
    //   type: DataTypes.JSON,
    //   allowNull: false
    // },

  },
  {
    sequelize,// to attach the User model to the database connection i've defined in databaseConnection.ts
    tableName: 'stations',
    timestamps: false, // it creates  createdAt / updatedAt columns
  }
);

//======================================================================================================================================

export default stationModel;
