import { Model, InferAttributes, InferCreationAttributes } from 'sequelize';
declare class OperatingHoursModel extends Model<InferAttributes<OperatingHoursModel>, InferCreationAttributes<OperatingHoursModel>> {
    operatingHourId: string;
    servicePatternId: string;
    hour: string;
}
export default OperatingHoursModel;
//# sourceMappingURL=operatingHoursModel.d.ts.map