//============================================================================================
// import Bus table interface 
//============================================================================================

import { BusAttributes } from "../interfaces/busInterface";

//============================================================================================

const buses: Array<BusAttributes> = [
  {
    id: "B001",
    serialNumber: "SN-0001",
    brand: "Volvo",
    status: "operating",
    assignedRoute: "R001",
    assignedDriver: "D001",
  },
  {
    id: "B002",
    serialNumber: "SN-0002",
    brand: "Mercedes",
    status: "maintenance",
    assignedRoute: "R001",
    assignedDriver: "D002",
  },
  {
    id: "B003",
    serialNumber: "SN-0003",
    brand: "Scania",
    status: "offline",
    assignedRoute: "R002",
    assignedDriver: "D003",
  },
  {
    id: "B004",
    serialNumber: "SN-0004",
    brand: "MAN",
    status: "operating",
    assignedRoute: "R003",
    assignedDriver: "D004",
  },
];

//============================================================================================
export default buses;
