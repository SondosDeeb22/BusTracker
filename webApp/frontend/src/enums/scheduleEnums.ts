//===============================================================================================
//? Schedule-related enums / constants used on frontend
//===============================================================================================

export const weekDays = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
} as const;

export type WeekDay = (typeof weekDays)[keyof typeof weekDays];

export const shiftType = {
  Morning: 'Morning',
  Afternoon: 'Afternoon',
  Evening: 'Evening',
} as const;

export type ShiftType = (typeof shiftType)[keyof typeof shiftType];
