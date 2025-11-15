import { Model, InferAttributes, InferCreationAttributes } from 'sequelize';
import { BusScheduleAttributes } from '../interfaces/busScheduleInterface';
import { weekDays } from '../enums/busScheduleEnum';
declare class BusScheduleModel extends Model<InferAttributes<BusScheduleModel>, InferCreationAttributes<BusScheduleModel>> implements BusScheduleAttributes {
    id: string;
    date: Date;
    day: keyof typeof weekDays;
    driverId: string;
    busId: string;
    routeId: string;
    createdAt: Date;
    createdBy: string;
    lastupdated: Date;
    updatedBy: string;
}
export default BusScheduleModel;
//# sourceMappingURL=busScheduleModel%20copy.d.ts.map