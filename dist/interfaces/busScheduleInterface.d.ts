import { weekDays } from "../enums/busScheduleEnum";
export interface BusScheduleAttributes {
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
//# sourceMappingURL=busScheduleInterface.d.ts.map