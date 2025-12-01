//===========================================================================================================================
// setup Express route
//===========================================================================================================================
import express, { Router } from "express";

const router: Router = express.Router();

//===========================================================================================================================
//importing authentication functions
//===========================================================================================================================

//import enums ----------------------------------------------------------------
import { tokenNames } from '../enums/tokenNameEnum';

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


//import  Middlewares -------------------------------------
import { accessRequireToken } from '../middlewares/tokenRequired'; // for authentication

import  {authorizeRole} from '../middlewares/authorizeRole'; // for authorization


//===========================================================================================================================
// Router
//===========================================================================================================================


// Adding 
router.post('/driver/add', accessRequireToken(tokenNames.loginToken), authorizeRole(role.admin), driverController.addDriver);

router.post('/bus/add', accessRequireToken(tokenNames.loginToken), authorizeRole(role.admin), busController.addBus);

router.post('/route/add', accessRequireToken(tokenNames.loginToken), authorizeRole(role.admin), routeController.addRoute);

router.post('/station/add', accessRequireToken(tokenNames.loginToken), authorizeRole(role.admin), stationController.addStation);


// Remove

router.delete('/driver/remove', accessRequireToken(tokenNames.loginToken), authorizeRole(role.admin), driverController.removeDriver);

router.delete('/bus/remove', accessRequireToken(tokenNames.loginToken), authorizeRole(role.admin), busController.removeBus);

router.delete('/route/remove', accessRequireToken(tokenNames.loginToken), authorizeRole(role.admin), routeController.removeRoute);

router.delete('/station/remove', accessRequireToken(tokenNames.loginToken), authorizeRole(role.admin), stationController.removeStation);


//Update

router.patch('/driver/update',  accessRequireToken(tokenNames.loginToken), authorizeRole(role.admin), driverController.updateDriver);

router.patch('/bus/update', accessRequireToken(tokenNames.loginToken), authorizeRole(role.admin), busController.updateBus);

router.patch('/route/update',  accessRequireToken(tokenNames.loginToken), authorizeRole(role.admin), routeController.updateRoute);

router.patch('/station/update',  accessRequireToken(tokenNames.loginToken), authorizeRole(role.admin), stationController.updateStation);

// fetch all drivers
router.get('/drivers/fetch', accessRequireToken(tokenNames.loginToken), authorizeRole(role.admin), driverController.fetchAllDrivers);

// fetch all buses
router.get('/buses/fetch', accessRequireToken(tokenNames.loginToken), authorizeRole(role.admin), busController.fetchAllBuses);

// fetch all stations
router.get('/stations/fetch', accessRequireToken(tokenNames.loginToken), authorizeRole(role.admin), stationController.fetchAllStations);
//===========================================================================================================================
export default router;