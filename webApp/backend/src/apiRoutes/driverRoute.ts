//===========================================================================================================================
// setup Express route
//===========================================================================================================================
import express, { Router } from "express";

const router: Router = express.Router();

//===========================================================================================================================
//importing authentication functions
//===========================================================================================================================

//import controllers ----------------------------------------------------------

import { DriverController } from "../controllers/driverController";
const driverController = new DriverController();

import { UserController } from "../controllers/userController";
const userController = new UserController();

import { LiveLocationController } from "../controllers/liveLocationController";
const liveLocationController = new LiveLocationController();

//import enums ----------------------------------------------------------------
import { loginToken } from '../enums/tokenNameEnum';

import { role } from '../enums/userEnum';

//import  Middlewares -------------------------------------
import { accessRequireToken } from '../middlewares/tokenRequired'; // for authentication

import { authorizeRole } from '../middlewares/authorizeRole'; // for authorization
//===========================================================================================================================
// Router
//===========================================================================================================================



router.get('/profile', accessRequireToken(loginToken), authorizeRole(role.driver), driverController.fetchDriverProfile);

router.patch('/update',  accessRequireToken(loginToken), authorizeRole(role.driver), driverController.updateDriverData);

// change the route (by driver)
router.patch('/change-route', accessRequireToken(loginToken), authorizeRole(role.driver),  userController.changeRoute);

// Start/Stop real-time tracking 
router.patch('/tracking', accessRequireToken(loginToken), userController.changeBusStatus);

// Update live location
router.post('/live-location/update', accessRequireToken(loginToken), authorizeRole(role.driver), liveLocationController.updateLiveLocation);

// Fetch driver schedule 
router.get('/schedule/fetch', accessRequireToken(loginToken), driverController.fetchDriverSchedule);


// Buttons Control Unit (Determine when buttons should be visible in driver homepage)
router.get('/buttons-control', accessRequireToken(loginToken), authorizeRole(role.driver), driverController.buttonsControlUnit);

//===========================================================================================================================
export default router;