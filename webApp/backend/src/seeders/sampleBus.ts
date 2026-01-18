//============================================================================================
// import Bus table interface 
//============================================================================================

import { BusAttributes } from "../interfaces/busInterface";

//============================================================================================

const buses: Array<BusAttributes> = [
  {
    id: "B001",
    plate: "P-0001",
    brand: "Volvo",
    status: "operating",
    assignedRoute: "R001",
    assignedDriver: "U001",
  },
  {
    id: "B002",
    plate: "P-0002",
    brand: "Mercedes",
    status: "maintenance",
    assignedRoute: "R001",
    assignedDriver: "U002",
  },
  {
    id: "B003",
    plate: "P-0003",
    brand: "Scania",
    status: "offline",
    assignedRoute: "R002",
    assignedDriver: "U003",
  },
  {
    id: "B004",
    plate: "P-0004",
    brand: "MAN",
    status: "operating",
    assignedRoute: "R003",
    assignedDriver: "U004",
  },
  {
    id: "B005",
    plate: "PSWE-0005",
    brand: "MAN",
    status: "offline",
  },
  {
    id: "B006",
    plate: "SDFG-1706",
    brand: "MAN",
    status: "maintenance",
  },
];

//============================================================================================
export default buses;
