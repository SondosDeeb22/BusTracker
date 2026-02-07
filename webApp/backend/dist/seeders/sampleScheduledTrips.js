"use strict";
//============================================================================================
// ScheduledTrips sample data
//============================================================================================
Object.defineProperty(exports, "__esModule", { value: true });
//============================================================================================
const scheduledTrips = [
    // For SC01 (Weekday)
    { detailedScheduleId: "DT01", scheduleId: "SC01", time: "08:15:00", routeId: "R001", driverId: "U001", busId: "B001" },
    { detailedScheduleId: "DT02", scheduleId: "SC01", time: "09:15:00", routeId: "R001", driverId: "U002", busId: "B002" },
    { detailedScheduleId: "DT09", scheduleId: "SC01", time: "07:15:00", routeId: "R002", driverId: "U003", busId: "B003" },
    { detailedScheduleId: "DT10", scheduleId: "SC01", time: "10:15:00", routeId: "R003", driverId: "U004", busId: "B004" },
    { detailedScheduleId: "DT11", scheduleId: "SC01", time: "11:15:00", routeId: "R001", driverId: "U001", busId: "B001" },
    { detailedScheduleId: "DT12", scheduleId: "SC01", time: "12:15:00", routeId: "R002", driverId: "U002", busId: "B002" },
    { detailedScheduleId: "DT13", scheduleId: "SC01", time: "14:15:00", routeId: "R003", driverId: "U003", busId: "B003" },
    { detailedScheduleId: "DT14", scheduleId: "SC01", time: "16:15:00", routeId: "R001", driverId: "U004", busId: "B004" },
    { detailedScheduleId: "DT15", scheduleId: "SC01", time: "18:15:00", routeId: "R002", driverId: "U001", busId: "B001" },
    { detailedScheduleId: "DT16", scheduleId: "SC01", time: "20:15:00", routeId: "R003", driverId: "U002", busId: "B002" },
    { detailedScheduleId: "DT17", scheduleId: "SC01", time: "22:15:00", routeId: "R001", driverId: "U003", busId: "B003" },
    { detailedScheduleId: "DT62", scheduleId: "SC01", time: "12:15:00", routeId: "R002", driverId: "U006", busId: "B001" },
    { detailedScheduleId: "DT61", scheduleId: "SC01", time: "16:15:00", routeId: "R004", driverId: "U006", busId: "B005" },
    // For SC02 (Weekday)
    // { detailedScheduleId: "DT03", scheduleId: "SC02", time: "09:15:00", routeId: "R001", driverId: "U003", busId: "B003" },
    // { detailedScheduleId: "DT04", scheduleId: "SC02", time: "10:15:00", routeId: "R002", driverId: "U004", busId: "B004" },
    // { detailedScheduleId: "DT18", scheduleId: "SC02", time: "07:15:00", routeId: "R003", driverId: "U001", busId: "B001" },
    // { detailedScheduleId: "DT19", scheduleId: "SC02", time: "08:15:00", routeId: "R002", driverId: "U002", busId: "B002" },
    // { detailedScheduleId: "DT20", scheduleId: "SC02", time: "11:15:00", routeId: "R001", driverId: "U004", busId: "B004" },
    // { detailedScheduleId: "DT21", scheduleId: "SC02", time: "12:15:00", routeId: "R003", driverId: "U003", busId: "B003" },
    // { detailedScheduleId: "DT22", scheduleId: "SC02", time: "13:15:00", routeId: "R002", driverId: "U001", busId: "B001" },
    // { detailedScheduleId: "DT23", scheduleId: "SC02", time: "15:15:00", routeId: "R001", driverId: "U002", busId: "B002" },
    // { detailedScheduleId: "DT24", scheduleId: "SC02", time: "17:15:00", routeId: "R003", driverId: "U004", busId: "B004" },
    // { detailedScheduleId: "DT25", scheduleId: "SC02", time: "19:15:00", routeId: "R002", driverId: "U003", busId: "B003" },
    // { detailedScheduleId: "DT26", scheduleId: "SC02", time: "20:15:00", routeId: "R001", driverId: "U001", busId: "B001" },
    // { detailedScheduleId: "DT99", scheduleId: "SC02", time: "20:15:00", routeId: "R004", driverId: "U005", busId: "B006" },
    // { detailedScheduleId: "DT98", scheduleId: "SC02", time: "20:15:00", routeId: "R008", driverId: "U004", busId: "B002" },
    // { detailedScheduleId: "DT90", scheduleId: "SC02", time: "20:15:00", routeId: "R010", driverId: "U003", busId: "B005" },
    // For SC03 (Weekend)
    { detailedScheduleId: "DT05", scheduleId: "SC03", time: "10:15:00", routeId: "R003", driverId: "U004", busId: "B004" },
    { detailedScheduleId: "DT27", scheduleId: "SC03", time: "08:15:00", routeId: "R001", driverId: "U001", busId: "B001" },
    { detailedScheduleId: "DT28", scheduleId: "SC03", time: "14:15:00", routeId: "R003", driverId: "U002", busId: "B002" },
    { detailedScheduleId: "DT29", scheduleId: "SC03", time: "16:15:00", routeId: "R002", driverId: "U004", busId: "B004" },
    { detailedScheduleId: "DT33", scheduleId: "SC03", time: "08:15:00", routeId: "R002", driverId: "U002", busId: "B002" },
    { detailedScheduleId: "DT34", scheduleId: "SC03", time: "10:15:00", routeId: "R001", driverId: "U003", busId: "B003" },
    { detailedScheduleId: "DT35", scheduleId: "SC03", time: "12:15:00", routeId: "R001", driverId: "U004", busId: "B004" },
    { detailedScheduleId: "DT36", scheduleId: "SC03", time: "14:15:00", routeId: "R001", driverId: "U001", busId: "B001" },
    { detailedScheduleId: "DT37", scheduleId: "SC03", time: "16:15:00", routeId: "R003", driverId: "U003", busId: "B003" },
    { detailedScheduleId: "DT38", scheduleId: "SC03", time: "18:15:00", routeId: "R001", driverId: "U002", busId: "B002" },
    { detailedScheduleId: "DT39", scheduleId: "SC03", time: "18:15:00", routeId: "R002", driverId: "U004", busId: "B004" },
    { detailedScheduleId: "DT72", scheduleId: "SC03", time: "12:15:00", routeId: "R003", driverId: "U006", busId: "B001" },
    { detailedScheduleId: "DT78", scheduleId: "SC03", time: "14:15:00", routeId: "R001", driverId: "U006", busId: "B004" },
    { detailedScheduleId: "DT79", scheduleId: "SC03", time: "13:15:00", routeId: "R003", driverId: "U006", busId: "B001" },
    { detailedScheduleId: "DT63", scheduleId: "SC03", time: "15:15:00", routeId: "R001", driverId: "U006", busId: "B004" },
    // For SC04 (Weekend)
    { detailedScheduleId: "DT07", scheduleId: "SC04", time: "12:15:00", routeId: "R001", driverId: "U002", busId: "B002" },
    { detailedScheduleId: "DT08", scheduleId: "SC04", time: "14:15:00", routeId: "R003", driverId: "U001", busId: "B001" },
    { detailedScheduleId: "DT30", scheduleId: "SC04", time: "08:15:00", routeId: "R002", driverId: "U003", busId: "B003" },
    { detailedScheduleId: "DT31", scheduleId: "SC04", time: "10:15:00", routeId: "R001", driverId: "U004", busId: "B004" },
    { detailedScheduleId: "DT32", scheduleId: "SC04", time: "16:15:00", routeId: "R003", driverId: "U002", busId: "B002" },
    { detailedScheduleId: "DT40", scheduleId: "SC04", time: "08:15:00", routeId: "R001", driverId: "U001", busId: "B001" },
    { detailedScheduleId: "DT41", scheduleId: "SC04", time: "10:15:00", routeId: "R003", driverId: "U003", busId: "B003" },
    { detailedScheduleId: "DT42", scheduleId: "SC04", time: "12:15:00", routeId: "R002", driverId: "U004", busId: "B004" },
    { detailedScheduleId: "DT43", scheduleId: "SC04", time: "14:15:00", routeId: "R001", driverId: "U002", busId: "B002" },
    { detailedScheduleId: "DT44", scheduleId: "SC04", time: "16:15:00", routeId: "R001", driverId: "U001", busId: "B001" },
    { detailedScheduleId: "DT45", scheduleId: "SC04", time: "18:15:00", routeId: "R002", driverId: "U003", busId: "B003" },
    { detailedScheduleId: "DT46", scheduleId: "SC04", time: "18:15:00", routeId: "R003", driverId: "U004", busId: "B004" },
    { detailedScheduleId: "DT89", scheduleId: "SC05", time: "08:15:00", routeId: "R005", driverId: "U001", busId: "B001" },
    { detailedScheduleId: "DT77", scheduleId: "SC05", time: "12:15:00", routeId: "R006", driverId: "U003", busId: "B003" },
    { detailedScheduleId: "DT86", scheduleId: "SC05", time: "16:15:00", routeId: "R005", driverId: "U005", busId: "B005" },
    { detailedScheduleId: "DT55", scheduleId: "SC05", time: "18:15:00", routeId: "R006", driverId: "U001", busId: "B006" },
    { detailedScheduleId: "DT83", scheduleId: "SC06", time: "13:15:00", routeId: "R004", driverId: "U002", busId: "B004" },
    { detailedScheduleId: "DT82", scheduleId: "SC06", time: "15:15:00", routeId: "R004", driverId: "U001", busId: "B005" },
    { detailedScheduleId: "DT59", scheduleId: "SC06", time: "15:15:00", routeId: "R004", driverId: "U006", busId: "B005" },
    { detailedScheduleId: "DT48", scheduleId: "SC06", time: "16:15:00", routeId: "R004", driverId: "U006", busId: "B005" },
];
//============================================================================================
exports.default = scheduledTrips;
//# sourceMappingURL=sampleScheduledTrips.js.map