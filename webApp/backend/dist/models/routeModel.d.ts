import { Model, InferAttributes, InferCreationAttributes } from 'sequelize';
import { RouteAttributes } from '../interfaces/routeInterface';
import { status } from '../enums/routeEnum';
declare class RouteModel extends Model<InferAttributes<RouteModel>, InferCreationAttributes<RouteModel>> implements RouteAttributes {
    id: string;
    title: string;
    color: string;
    totalStops: number;
    status: keyof typeof status;
}
export default RouteModel;
//# sourceMappingURL=routeModel.d.ts.map