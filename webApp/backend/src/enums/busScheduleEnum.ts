//==============================
//? week days
//==============================

export enum weekDays{
    monday = 'Monday',
    tuesday = 'Tuesday',
    wednesday = 'Wednesday',
    thursday = 'Thursday',
    friday = 'Friday',
    saturday = 'Saturday',
    sunday = 'Sunday'
};

export enum shiftType {
  Morning = "Morning",
  Afternoon = "Afternoon",
  Evening = "Evening",
}

export const ShiftTimeRanges = {
  [shiftType.Morning]: { start: "07:15", end: "12:15" },
  [shiftType.Afternoon]: { start: "12:15", end: "17:15" },
  [shiftType.Evening]: { start: "17:15", end: "22:15" },
};
