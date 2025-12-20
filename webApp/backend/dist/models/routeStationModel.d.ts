import { Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { RouteStationAttributes } from '../interfaces/routeStationInterface';
declare class RouteStationModel extends Model<InferAttributes<RouteStationModel>, InferCreationAttributes<RouteStationModel>> implements RouteStationAttributes {
    routeStationId: CreationOptional<number>;
    routeId: string;
    stationId: string;
    orderIndex: number;
}
export default RouteStationModel;
//# sourceMappingURL=routeStationModel.d.ts.map