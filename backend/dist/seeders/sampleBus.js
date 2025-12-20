"use strict";
//============================================================================================
// import Bus table interface 
//============================================================================================
Object.defineProperty(exports, "__esModule", { value: true });
//============================================================================================
const buses = [
    {
        id: "B001",
        serialNumber: "SN-0001",
        brand: "Volvo",
        status: "operating",
        assignedRoute: "R001",
        assignedDriver: "U001",
    },
    {
        id: "B002",
        serialNumber: "SN-0002",
        brand: "Mercedes",
        status: "maintenance",
        assignedRoute: "R001",
        assignedDriver: "U002",
    },
    {
        id: "B003",
        serialNumber: "SN-0003",
        brand: "Scania",
        status: "offline",
        assignedRoute: "R002",
        assignedDriver: "U003",
    },
    {
        id: "B004",
        serialNumber: "SN-0004",
        brand: "MAN",
        status: "operating",
        assignedRoute: "R003",
        assignedDriver: "U004",
    },
];
//============================================================================================
exports.default = buses;
//# sourceMappingURL=sampleBus.js.map