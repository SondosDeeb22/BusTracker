import { Model, InferAttributes, InferCreationAttributes } from 'sequelize';
declare class ScheduledTripsModel extends Model<InferAttributes<ScheduledTripsModel>, InferCreationAttributes<ScheduledTripsModel>> {
    detailedScheduleId: string;
    scheduleId: string;
    time: string;
    routeId: string;
    driverId: string;
    busId: string;
}
export default ScheduledTripsModel;
//# sourceMappingURL=scheduledTripsModel.d.ts.map