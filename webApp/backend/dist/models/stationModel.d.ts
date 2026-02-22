import { Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { stationAttributes } from '../interfaces/stationInterface';
import { defaultType, status } from '../enums/stationEnum';
declare class stationModel extends Model<InferAttributes<stationModel>, InferCreationAttributes<stationModel>> implements stationAttributes {
    id: string;
    stationName: string;
    latitude: number;
    longitude: number;
    status: CreationOptional<keyof typeof status>;
    isDefault: CreationOptional<boolean>;
    defaultType: CreationOptional<keyof typeof defaultType>;
}
export default stationModel;
//# sourceMappingURL=stationModel.d.ts.map