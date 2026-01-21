"use strict";
//============================================================================================
// Schedule sample data
//============================================================================================
Object.defineProperty(exports, "__esModule", { value: true });
//============================================================================================
const schedules = [
    {
        scheduleId: "SC01",
        date: new Date("2026-07-15T00:00:00Z"),
        time: "08:00:00",
        servicePatternId: "SP01",
    },
    {
        scheduleId: "SC02",
        date: new Date("2026-07-15T00:00:00Z"),
        time: "09:00:00",
        servicePatternId: "SP01",
    },
    {
        scheduleId: "SC03",
        date: new Date("2026-07-16T00:00:00Z"),
        time: "10:00:00",
        servicePatternId: "SP02",
    },
    {
        scheduleId: "SC04",
        date: new Date("2026-07-16T00:00:00Z"),
        time: "12:00:00",
        servicePatternId: "SP02",
    },
];
//============================================================================================
exports.default = schedules;
//# sourceMappingURL=sampleSchedule.js.map