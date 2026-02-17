import { Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { stationAttributes } from '../interfaces/stationInterface';
import { status } from '../enums/stationEnum';
declare class stationModel extends Model<InferAttributes<stationModel>, InferCreationAttributes<stationModel>> implements stationAttributes {
    id: string;
    stationName: string;
    latitude: number;
    longitude: number;
    status: CreationOptional<keyof typeof status>;
}
export default stationModel;
//# sourceMappingURL=stationModel.d.ts.map