import { Model, InferAttributes, InferCreationAttributes } from 'sequelize';
import { BusAttributes } from '../interfaces/busInterface';
import { status } from '../enums/busEnum';
declare class BusModel extends Model<InferAttributes<BusModel>, InferCreationAttributes<BusModel>> implements BusAttributes {
    id: string;
    serialNumber: string;
    brand: string;
    status: keyof typeof status;
    assignedRoute: string;
    assignedDriver: string;
}
export default BusModel;
//# sourceMappingURL=busModel%20copy.d.ts.map