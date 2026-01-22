//======================================================================================================================
//?  Imports
//======================================================================================================================
import { Model, DataTypes, InferAttributes, InferCreationAttributes } from 'sequelize';
import { sequelize } from '../config/database';
import ServicePatternModel from './servicePatternModel';

//==============================================================================================================================================
//? Model class
//==============================================================================================================================================
class ScheduleModel extends Model<InferAttributes<ScheduleModel>, InferCreationAttributes<ScheduleModel>> {
  declare scheduleId: string;
  declare date: Date;
  declare day: string;
  declare servicePatternId: string;
}

//======================================================================================================================
//? Initialize the table
//======================================================================================================================
ScheduleModel.init(
  {
    scheduleId: {
      type: DataTypes.STRING(4),
      primaryKey: true,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    day: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    servicePatternId: {
      type: DataTypes.STRING(4),
      allowNull: false,
      references: {
        model: ServicePatternModel,
        key: 'servicePatternId',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  },
  {
    sequelize,
    tableName: 'schedules',
    timestamps: false,
  }
);
//======================================================================================================================================

export default ScheduleModel;
