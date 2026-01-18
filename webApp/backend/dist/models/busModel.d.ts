import { Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { BusAttributes } from '../interfaces/busInterface';
import { status } from '../enums/busEnum';
declare class BusModel extends Model<InferAttributes<BusModel>, InferCreationAttributes<BusModel>> implements BusAttributes {
    id: string;
    plate: string;
    brand: string;
    status: keyof typeof status;
    assignedRoute: CreationOptional<string | null>;
    assignedDriver: CreationOptional<string | null>;
}
export default BusModel;
//# sourceMappingURL=busModel.d.ts.map