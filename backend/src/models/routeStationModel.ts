//======================================================================================================================
//?  Imports
//======================================================================================================================
import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { sequelize } from '../config/database';


//import Interface
import {RouteStationAttributes} from '../interfaces/routeStationInterface';

//==============================================================================================================================================
//? Model class
//==============================================================================================================================================
class RouteStationModel extends Model<InferAttributes<RouteStationModel>, InferCreationAttributes<RouteStationModel>> implements RouteStationAttributes {
  declare routeStationId: CreationOptional<number>;
  declare routeId: string;
  declare stationId: string;
  declare orderIndex: number;
}

//======================================================================================================================
//? Initialize the table
//======================================================================================================================
RouteStationModel.init(
  {
    routeStationId:{
      type: DataTypes.BIGINT,
            autoIncrement: true, 
            primaryKey: true,
            allowNull: false
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
    stationId: {
      type: DataTypes.STRING(4),
      allowNull: false,
      references: {
        model: 'bus_Stations',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },


    orderIndex: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'route_stations',
    timestamps: false,
    indexes: [
      {
        name: 'UQ_route_station_pair',
        unique: true,
        fields: ['routeId', 'stationId'],
      },
    ],
  }
);

//======================================================================================================================================

export default RouteStationModel;
