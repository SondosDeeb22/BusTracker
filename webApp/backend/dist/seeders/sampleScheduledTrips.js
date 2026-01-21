"use strict";
//============================================================================================
// ScheduledTrips sample data
//============================================================================================
Object.defineProperty(exports, "__esModule", { value: true });
//============================================================================================
const scheduledTrips = [
    // For SC01 (Weekday)
    { detailedScheduleId: "DT01", scheduleId: "SC01", time: "08:00:00", routeId: "R001", driverId: "U001", busId: "B001" },
    { detailedScheduleId: "DT02", scheduleId: "SC01", time: "09:00:00", routeId: "R001", driverId: "U002", busId: "B002" },
    // For SC02 (Weekday)
    { detailedScheduleId: "DT03", scheduleId: "SC02", time: "09:00:00", routeId: "R001", driverId: "U003", busId: "B003" },
    { detailedScheduleId: "DT04", scheduleId: "SC02", time: "10:00:00", routeId: "R002", driverId: "U004", busId: "B004" },
    // For SC03 (Weekend)
    { detailedScheduleId: "DT05", scheduleId: "SC03", time: "10:00:00", routeId: "R003", driverId: "U004", busId: "B004" },
    { detailedScheduleId: "DT06", scheduleId: "SC03", time: "12:00:00", routeId: "R002", driverId: "U003", busId: "B003" },
    // For SC04 (Weekend)
    { detailedScheduleId: "DT07", scheduleId: "SC04", time: "12:00:00", routeId: "R001", driverId: "U002", busId: "B002" },
    { detailedScheduleId: "DT08", scheduleId: "SC04", time: "14:00:00", routeId: "R003", driverId: "U001", busId: "B001" },
];
//============================================================================================
exports.default = scheduledTrips;
//# sourceMappingURL=sampleScheduledTrips.js.map