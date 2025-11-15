import { Model, InferAttributes, InferCreationAttributes } from 'sequelize';
import { stationAttributes } from '../interfaces/stationInterface';
import { status } from '../enums/stationEnum';
declare class stationModel extends Model<InferAttributes<stationModel>, InferCreationAttributes<stationModel>> implements stationAttributes {
    id: string;
    stationName: string;
    latitude: number;
    longitude: number;
    status: keyof typeof status;
}
export default stationModel;
//# sourceMappingURL=stationModel.d.ts.map