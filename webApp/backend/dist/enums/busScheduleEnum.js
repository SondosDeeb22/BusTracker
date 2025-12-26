"use strict";
//==============================
//? week days
//==============================
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShiftTimeRanges = exports.shiftType = exports.weekDays = void 0;
var weekDays;
(function (weekDays) {
    weekDays["monday"] = "Monday";
    weekDays["tuesday"] = "Tuesday";
    weekDays["wednesday"] = "Wednesday";
    weekDays["thursday"] = "Thursday";
    weekDays["friday"] = "Friday";
    weekDays["saturday"] = "Saturday";
    weekDays["sunday"] = "Sunday";
})(weekDays || (exports.weekDays = weekDays = {}));
;
var shiftType;
(function (shiftType) {
    shiftType["Morning"] = "Morning";
    shiftType["Afternoon"] = "Afternoon";
    shiftType["Evening"] = "Evening";
})(shiftType || (exports.shiftType = shiftType = {}));
exports.ShiftTimeRanges = {
    [shiftType.Morning]: { start: "07:00", end: "12:00" },
    [shiftType.Afternoon]: { start: "12:00", end: "17:00" },
    [shiftType.Evening]: { start: "17:00", end: "22:00" },
};
//# sourceMappingURL=busScheduleEnum.js.map