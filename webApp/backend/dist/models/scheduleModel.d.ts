import { Model, InferAttributes, InferCreationAttributes } from 'sequelize';
declare class ScheduleModel extends Model<InferAttributes<ScheduleModel>, InferCreationAttributes<ScheduleModel>> {
    scheduleId: string;
    date: Date;
    time: string;
    servicePatternId: string;
}
export default ScheduleModel;
//# sourceMappingURL=scheduleModel.d.ts.map