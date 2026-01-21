//======================================================================================================================
//?  Imports
//======================================================================================================================
import { Model, DataTypes, InferAttributes, InferCreationAttributes } from 'sequelize';
import { sequelize } from '../config/database';

class ScheduledTripsModel extends Model<InferAttributes<ScheduledTripsModel>, InferCreationAttributes<ScheduledTripsModel>> {
  declare detailedScheduleId: string;
  declare scheduleId: string;
  declare time: string;
  declare routeId: string;
  declare driverId: string;
  declare busId: string;
}


//======================================================================================================================
//? Initialize the table
//======================================================================================================================

ScheduledTripsModel.init(
  {
    detailedScheduleId: {
      type: DataTypes.STRING(4),
      primaryKey: true,
      allowNull: false,
    },
    scheduleId: {
      type: DataTypes.STRING(4),
      allowNull: false,
      references: {
        model: 'schedules',
        key: 'scheduleId',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    time: {
      type: DataTypes.TIME,
      allowNull: false,
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
  },
  {
    sequelize,
    tableName: 'scheduled_trips',
    timestamps: false,
  }
);

export default ScheduledTripsModel;
