//======================================================================================================================
//?  Imports
//======================================================================================================================
import { Model, DataTypes, InferAttributes, InferCreationAttributes } from 'sequelize';
import { sequelize } from '../config/database';

//==============================================================================================================================================
//? Model class
//==============================================================================================================================================
class ServicePatternModel extends Model<InferAttributes<ServicePatternModel>, InferCreationAttributes<ServicePatternModel>> {
  declare servicePatternId: string;
  declare title: string;
}

//======================================================================================================================
//? Initialize the table
//======================================================================================================================
ServicePatternModel.init(
  {
    servicePatternId: {
      type: DataTypes.STRING(4),
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'service_patterns',
    timestamps: false,
  }
);
//======================================================================================================================================

export default ServicePatternModel;
