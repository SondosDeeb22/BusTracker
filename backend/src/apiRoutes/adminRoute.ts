//===========================================================================================================================
// setup Express route
//===========================================================================================================================
import express, { Router } from "express";

const router: Router = express.Router();

//===========================================================================================================================
//importing authentication functions
//===========================================================================================================================

//import enums ----------------------------------------------------------------
import { loginToken } from '../enums/tokenNameEnum';

import {role} from '../enums/userEnum';

//import controllers ----------------------------------------------------------
import { DriverController } from "../controllers/driverController";
const driverController = new DriverController();


import {BusController} from "../controllers/busController";
const busController = new BusController();


import { RouteController } from "../controllers/routeController";
const routeController = new RouteController();

import { StationController } from "../controllers/stationController";
const stationController = new StationController();


import { UserController } from "../controllers/userController";
const userController = new UserController();
 
import {BusScheduleController} from "../controllers/busScheduleController";
const busScheduleController = new BusScheduleController();
//import  Middlewares -------------------------------------
import { accessRequireToken } from '../middlewares/tokenRequired'; // for authentication

import  {authorizeRole} from '../middlewares/authorizeRole'; // for authorization


//===========================================================================================================================
// Router
//===========================================================================================================================


// Adding 
router.post('/driver/add', accessRequireToken(loginToken), authorizeRole(role.admin), driverController.addDriver);

router.post('/bus/add', accessRequireToken(loginToken), authorizeRole(role.admin), busController.addBus);

router.post('/route/add', accessRequireToken(loginToken), authorizeRole(role.admin), routeController.addRoute);

router.post('/station/add', accessRequireToken(loginToken), authorizeRole(role.admin), stationController.addStation);

router.post('/schedule/add', accessRequireToken(loginToken), authorizeRole(role.admin), busScheduleController.addSchedule);


// Remove

router.delete('/driver/remove', accessRequireToken(loginToken), authorizeRole(role.admin), driverController.removeDriver);

router.delete('/bus/remove', accessRequireToken(loginToken), authorizeRole(role.admin), busController.removeBus);

router.delete('/route/remove', accessRequireToken(loginToken), authorizeRole(role.admin), routeController.removeRoute);

router.delete('/station/remove', accessRequireToken(loginToken), authorizeRole(role.admin), stationController.removeStation);

router.delete('/schedule/remove', accessRequireToken(loginToken), authorizeRole(role.admin), busScheduleController.removeSchedule);


//Update

router.patch('/driver/update',  accessRequireToken(loginToken), authorizeRole(role.admin), driverController.updateDriver);

router.patch('/bus/update', accessRequireToken(loginToken), authorizeRole(role.admin), busController.updateBus);

router.patch('/route/update',  accessRequireToken(loginToken), authorizeRole(role.admin), routeController.updateRoute);

router.patch('/station/update',  accessRequireToken(loginToken), authorizeRole(role.admin), stationController.updateStation);

router.patch('/schedule/update', accessRequireToken(loginToken), authorizeRole(role.admin), busScheduleController.updateSchedule);


// fetch 
router.get('/drivers/fetch', accessRequireToken(loginToken), authorizeRole(role.admin), driverController.fetchAllDrivers);

router.get('/buses/fetch', accessRequireToken(loginToken), authorizeRole(role.admin), busController.fetchAllBuses);


router.get('/stations/fetch', accessRequireToken(loginToken), authorizeRole(role.admin), stationController.fetchAllStations);

router.get('/schedule/fetch', accessRequireToken(loginToken), authorizeRole(role.admin), busScheduleController.getSchedules);
//===========================================================================================================================
export default router;