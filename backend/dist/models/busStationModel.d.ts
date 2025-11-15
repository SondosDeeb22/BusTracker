import { Model, InferAttributes, InferCreationAttributes } from 'sequelize';
import { BusStationAttributes } from '../interfaces/busStationInterface';
import { status } from '../enums/busStationEnum';
declare class BusStationModel extends Model<InferAttributes<BusStationModel>, InferCreationAttributes<BusStationModel>> implements BusStationAttributes {
    id: string;
    stationName: string;
    latitude: number;
    longitude: number;
    status: keyof typeof status;
}
export default BusStationModel;
//# sourceMappingURL=busStationModel.d.ts.map