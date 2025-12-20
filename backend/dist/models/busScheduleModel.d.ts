import { Model, InferAttributes, InferCreationAttributes } from 'sequelize';
import { BusScheduleAttributes } from '../interfaces/busScheduleInterface';
import { weekDays } from '../enums/busScheduleEnum';
declare class BusScheduleModel extends Model<InferAttributes<BusScheduleModel>, InferCreationAttributes<BusScheduleModel>> implements BusScheduleAttributes {
    id: string;
    date: Date;
    day: keyof typeof weekDays;
    driverId: string;
    routeId: string;
    busId: string;
    createdAt: Date;
    createdBy: string;
    updatedAt?: Date;
    updatedBy?: string;
}
export default BusScheduleModel;
//# sourceMappingURL=busScheduleModel.d.ts.map