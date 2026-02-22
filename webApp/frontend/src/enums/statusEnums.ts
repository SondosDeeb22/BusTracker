//===============================================================================================
//? Enums / constants used on frontend (do not import backend enums)
//===============================================================================================


//? Bus Status
export const busStatus = {
  operating: 'operating',
  offline: 'offline',
  maintenance: 'maintenance',
} as const;

export type BusStatus = (typeof busStatus)[keyof typeof busStatus];
//-----------------------------------------------------------------------------------

//? User Role
export const userRole = {
  driver: 'driver',
  admin: 'admin',
} as const;

export type UserRole = (typeof userRole)[keyof typeof userRole];
//-----------------------------------------------------------------------------------

//? User Gender
export const userGender = {
  female: 'female',
  male: 'male',
} as const;

export type UserGender = (typeof userGender)[keyof typeof userGender];
//-----------------------------------------------------------------------------------

//? User Status
export const userStatus = {
  active: 'active',
  passive: 'passive',
} as const;

export type UserStatus = (typeof userStatus)[keyof typeof userStatus];
//-----------------------------------------------------------------------------------

//? Route Status
export const routeStatus = {
  covered: 'covered',
  unassigned: 'unassigned',
} as const;

export type RouteStatus = (typeof routeStatus)[keyof typeof routeStatus];
//-----------------------------------------------------------------------------------

//? Station Status
export const stationStatus = {
  covered: 'covered',
  notCovered: 'notCovered',
} as const;

export type StationStatus = (typeof stationStatus)[keyof typeof stationStatus];
//-----------------------------------------------------------------------------------

//? Station Default Type
export const stationDefaultType = {
  start: 'START',
  end: 'END',
  notDefault: 'NOT_DEFAULT',
} as const;

export type StationDefaultType = (typeof stationDefaultType)[keyof typeof stationDefaultType];

