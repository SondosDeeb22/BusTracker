import { Model, InferAttributes, InferCreationAttributes } from 'sequelize';
import { BusAttributes } from '../interfaces/busInterface';
import { status } from '../enums/busEnum';
declare class BusModel extends Model<InferAttributes<BusModel>, InferCreationAttributes<BusModel>> implements BusAttributes {
    id: string;
    plate: string;
    brand: string;
    status: keyof typeof status;
}
export default BusModel;
//# sourceMappingURL=busModel.d.ts.map