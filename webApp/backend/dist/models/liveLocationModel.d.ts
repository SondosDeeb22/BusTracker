import { Model, InferAttributes, InferCreationAttributes } from 'sequelize';
import { LiveLocationInterface } from '../interfaces/liveLocationInterface';
declare class LiveLocationModel extends Model<InferAttributes<LiveLocationModel>, InferCreationAttributes<LiveLocationModel>> implements LiveLocationInterface {
    busId: string;
    latitude: number | null;
    longitude: number | null;
    lastUpdate: Date | null;
}
export default LiveLocationModel;
//# sourceMappingURL=liveLocationModel.d.ts.map