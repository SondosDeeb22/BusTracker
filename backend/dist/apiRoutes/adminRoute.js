"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//===========================================================================================================================
// setup Express route
//===========================================================================================================================
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
//===========================================================================================================================
//importing authentication functions
//===========================================================================================================================
//import enums ----------------------------------------------------------------
const tokenNameEnum_1 = require("../enums/tokenNameEnum");
const userEnum_1 = require("../enums/userEnum");
//import controllers ----------------------------------------------------------
const driverController_1 = require("../controllers/driverController");
const driverController = new driverController_1.DriverController();
const busController_1 = require("../controllers/busController");
const busController = new busController_1.BusController();
const routeController_1 = require("../controllers/routeController");
const routeController = new routeController_1.RouteController();
const stationController_1 = require("../controllers/stationController");
const stationController = new stationController_1.StationController();
//import  Middlewares -------------------------------------
const tokenRequired_1 = require("../middlewares/tokenRequired"); // for authentication
const authorizeRole_1 = require("../middlewares/authorizeRole"); // for authorization
//===========================================================================================================================
// Router
//===========================================================================================================================
// Adding 
router.post('/driver/add', (0, tokenRequired_1.accessRequireToken)(tokenNameEnum_1.tokenNames.loginToken), (0, authorizeRole_1.authorizeRole)(userEnum_1.role.admin), driverController.addDriver);
router.post('/bus/add', (0, tokenRequired_1.accessRequireToken)(tokenNameEnum_1.tokenNames.loginToken), (0, authorizeRole_1.authorizeRole)(userEnum_1.role.admin), busController.addBus);
router.post('/route/add', (0, tokenRequired_1.accessRequireToken)(tokenNameEnum_1.tokenNames.loginToken), (0, authorizeRole_1.authorizeRole)(userEnum_1.role.admin), routeController.addRoute);
router.post('/station/add', (0, tokenRequired_1.accessRequireToken)(tokenNameEnum_1.tokenNames.loginToken), (0, authorizeRole_1.authorizeRole)(userEnum_1.role.admin), stationController.addStation);
// Remove
router.delete('/driver/remove', (0, tokenRequired_1.accessRequireToken)(tokenNameEnum_1.tokenNames.loginToken), (0, authorizeRole_1.authorizeRole)(userEnum_1.role.admin), driverController.removeDriver);
router.delete('/bus/remove', (0, tokenRequired_1.accessRequireToken)(tokenNameEnum_1.tokenNames.loginToken), (0, authorizeRole_1.authorizeRole)(userEnum_1.role.admin), busController.removeBus);
router.delete('/route/remove', (0, tokenRequired_1.accessRequireToken)(tokenNameEnum_1.tokenNames.loginToken), (0, authorizeRole_1.authorizeRole)(userEnum_1.role.admin), routeController.removeRoute);
router.delete('/station/remove', (0, tokenRequired_1.accessRequireToken)(tokenNameEnum_1.tokenNames.loginToken), (0, authorizeRole_1.authorizeRole)(userEnum_1.role.admin), stationController.removeStation);
//Update
router.patch('/driver/update', (0, tokenRequired_1.accessRequireToken)(tokenNameEnum_1.tokenNames.loginToken), (0, authorizeRole_1.authorizeRole)(userEnum_1.role.admin), driverController.updateDriver);
router.patch('/bus/update', (0, tokenRequired_1.accessRequireToken)(tokenNameEnum_1.tokenNames.loginToken), (0, authorizeRole_1.authorizeRole)(userEnum_1.role.admin), busController.updateBus);
router.patch('/route/update', (0, tokenRequired_1.accessRequireToken)(tokenNameEnum_1.tokenNames.loginToken), (0, authorizeRole_1.authorizeRole)(userEnum_1.role.admin), routeController.updateRoute);
router.patch('/station/update', (0, tokenRequired_1.accessRequireToken)(tokenNameEnum_1.tokenNames.loginToken), (0, authorizeRole_1.authorizeRole)(userEnum_1.role.admin), stationController.updateStation);
// fetch all drivers
router.get('/drivers/fetch', (0, tokenRequired_1.accessRequireToken)(tokenNameEnum_1.tokenNames.loginToken), (0, authorizeRole_1.authorizeRole)(userEnum_1.role.admin), driverController.fetchAllDrivers);
// fetch all buses
router.get('/buses/fetch', (0, tokenRequired_1.accessRequireToken)(tokenNameEnum_1.tokenNames.loginToken), (0, authorizeRole_1.authorizeRole)(userEnum_1.role.admin), busController.fetchAllBuses);
// fetch all stations
router.get('/stations/fetch', (0, tokenRequired_1.accessRequireToken)(tokenNameEnum_1.tokenNames.loginToken), (0, authorizeRole_1.authorizeRole)(userEnum_1.role.admin), stationController.fetchAllStations);
//===========================================================================================================================
exports.default = router;
//# sourceMappingURL=adminRoute.js.map