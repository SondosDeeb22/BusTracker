//======================================================================================================================
//?  Imports
//======================================================================================================================
import { Model, DataTypes, InferAttributes, InferCreationAttributes } from 'sequelize';
import { sequelize } from '../config/database';
import ServicePatternModel from './servicePatternModel';

//==============================================================================================================================================
//? Model class
//==============================================================================================================================================
class OperatingHoursModel extends Model<InferAttributes<OperatingHoursModel>, InferCreationAttributes<OperatingHoursModel>> {
  declare operatingHourId: string;
  declare servicePatternId: string;
  declare hour: string;
}

//======================================================================================================================
//? Initialize the table
//======================================================================================================================
OperatingHoursModel.init(
  {
    operatingHourId: {
      type: DataTypes.STRING(4),
      primaryKey: true,
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
    hour: {
      type: DataTypes.TIME,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'operating_hours',
    timestamps: false,
  }
);
//======================================================================================================================================

export default OperatingHoursModel;
