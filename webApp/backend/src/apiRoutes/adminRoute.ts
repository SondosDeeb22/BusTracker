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
 

import { ScheduleController } from "../controllers/scheduleController";
const scheduleController = new ScheduleController();

import { ServicePatternController } from "../controllers/servicePatternController";
const servicePatternController = new ServicePatternController();
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

// add service pattern with operating hours
router.post('/service-patterns/add', accessRequireToken(loginToken), authorizeRole(role.admin), servicePatternController.addServicePattern);



// Remove

router.delete('/driver/remove', accessRequireToken(loginToken), authorizeRole(role.admin), driverController.removeDriver);

router.delete('/bus/remove', accessRequireToken(loginToken), authorizeRole(role.admin), busController.removeBus);

router.delete('/route/remove', accessRequireToken(loginToken), authorizeRole(role.admin), routeController.removeRoute);

router.delete('/station/remove', accessRequireToken(loginToken), authorizeRole(role.admin), stationController.removeStation);


// remove service pattern with operating hours
router.delete('/service-patterns/remove', accessRequireToken(loginToken), authorizeRole(role.admin), servicePatternController.deleteServicePattern);


//Update

router.patch('/driver/update',  accessRequireToken(loginToken), authorizeRole(role.admin), driverController.updateDriver);

router.patch('/bus/update', accessRequireToken(loginToken), authorizeRole(role.admin), busController.updateBus);

router.patch('/route/update',  accessRequireToken(loginToken), authorizeRole(role.admin), routeController.updateRoute);

router.patch('/station/update',  accessRequireToken(loginToken), authorizeRole(role.admin), stationController.updateStation);

router.patch('/service-patterns/update', accessRequireToken(loginToken), authorizeRole(role.admin), servicePatternController.updateServicePattern);


// fetch 
router.get('/drivers/fetch', accessRequireToken(loginToken), authorizeRole(role.admin), driverController.fetchAllDrivers);

router.get('/buses/fetch', accessRequireToken(loginToken), authorizeRole(role.admin), busController.fetchAllBuses);


router.get('/stations/fetch', accessRequireToken(loginToken), authorizeRole(role.admin), stationController.fetchAllStations);

// fetch schedules with their operating hours timeline and scheduled trips
router.get('/schedule/fetch', accessRequireToken(loginToken), authorizeRole(role.admin), scheduleController.getSchedule);

// fetch service patterns with their operating hours
router.get('/service-patterns/fetch', accessRequireToken(loginToken), authorizeRole(role.admin), servicePatternController.getServicePatterns);

//===========================================================================================================================
export default router;