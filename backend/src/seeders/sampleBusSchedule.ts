//============================================================================================
// import BusSchedule table interface 
//============================================================================================

import { BusScheduleAttributes } from "../interfaces/busScheduleInterface";

//============================================================================================

const busSchedules: Array<BusScheduleAttributes> = [
  {
    id: "SCH1",
    date: new Date("2025-07-15T00:00:00Z"),
    day: "tuesday",
    driverId: "D001",
    busId: "B001",
    routeId: "R001",
    createdAt: new Date("2025-07-01T10:00:00Z"),
    createdBy: "A001",
    lastupdated: new Date("2025-07-05T12:00:00Z"),
    updatedBy: "A002",
  },
  {
    id: "SCH2",
    date: new Date("2025-07-16T00:00:00Z"),
    day: "wednesday",
    driverId: "D002",
    busId: "B002",
    routeId: "R001",
    createdAt: new Date("2025-07-02T09:00:00Z"),
    createdBy: "A001",
    lastupdated: new Date("2025-07-06T12:00:00Z"),
    updatedBy: "A002",
  },
  {
    id: "SCH3",
    date: new Date("2025-07-17T00:00:00Z"),
    day: "thursday",
    driverId: "D003",
    busId: "B003",
    routeId: "R002",
    createdAt: new Date("2025-07-03T08:00:00Z"),
    createdBy: "A001",
    lastupdated: new Date("2025-07-07T12:00:00Z"),
    updatedBy: "A002",
  },
  {
    id: "SCH4",
    date: new Date("2025-07-18T00:00:00Z"),
    day: "friday",
    driverId: "D004",
    busId: "B004",
    routeId: "R003",
    createdAt: new Date("2025-07-04T08:00:00Z"),
    createdBy: "A001",
    lastupdated: new Date("2025-07-08T12:00:00Z"),
    updatedBy: "A002",
  },
];

//============================================================================================
export default busSchedules;
