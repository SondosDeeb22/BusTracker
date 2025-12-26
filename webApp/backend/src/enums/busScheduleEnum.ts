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
  [shiftType.Morning]: { start: "07:00", end: "12:00" },
  [shiftType.Afternoon]: { start: "12:00", end: "17:00" },
  [shiftType.Evening]: { start: "17:00", end: "22:00" },
};
