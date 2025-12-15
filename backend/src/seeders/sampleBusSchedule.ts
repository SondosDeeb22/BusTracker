//============================================================================================
// import BusSchedule table interface 
//============================================================================================

import { BusScheduleAttributes } from "../interfaces/busScheduleInterface";

//============================================================================================

const busSchedules: Array<BusScheduleAttributes> = [
  {
    id: "SCH1",
    date: new Date("2026-07-15T00:00:00Z"),
    day: "tuesday",
    driverId: "U001",
    busId: "B001",
    routeId: "R001",
    createdAt: new Date("2026-07-01T10:00:00Z"),
    createdBy: "U003"
  },
  {
    id: "SCH2",
    date: new Date("2026-07-16T00:00:00Z"),
    day: "wednesday",
    driverId: "U002",
    busId: "B002",
    routeId: "R001",
    createdAt: new Date("2026-07-02T09:00:00Z"),
    createdBy: "A001"
  },
  {
    id: "SCH3",
    date: new Date("2026-07-17T00:00:00Z"),
    day: "thursday",
    driverId: "U002",
    busId: "B003",
    routeId: "R002",
    createdAt: new Date("2026-07-03T08:00:00Z"),
    createdBy: "A001",
    updatedAt: new Date("2026-07-07T12:00:00Z"),
    updatedBy: "U003",
  },
  {
    id: "SCH4",
    date: new Date("2026-07-18T00:00:00Z"),
    day: "friday",
    driverId: "U004",
    busId: "B004",
    routeId: "R003",
    createdAt: new Date("2026-07-04T08:00:00Z"),
    createdBy: "A001",
    updatedAt: new Date("2026-07-08T12:00:00Z"),
    updatedBy: "A002",
  },
];

//============================================================================================
export default busSchedules;
