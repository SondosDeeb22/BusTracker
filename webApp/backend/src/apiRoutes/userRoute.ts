//===========================================================================================================================
// setup Express route
//===========================================================================================================================
import express, { Router } from "express";

const router: Router = express.Router();

//===========================================================================================================================
//importing authentication functions
//===========================================================================================================================

//import controllers ----------------------------------------------------------

import { RouteController } from "../controllers/routeController";
const routeController = new RouteController();

import { UserController } from "../controllers/userController";
const userController = new UserController();

import { ScheduleController } from "../controllers/scheduleController";
const scheduleController = new ScheduleController();

//import enums ----------------------------------------------------------------
import { loginToken } from '../enums/tokenNameEnum';

//import  Middlewares -------------------------------------
import { accessRequireToken } from '../middlewares/tokenRequired'; // for authentication

//===========================================================================================================================
// Router
//===========================================================================================================================

// view all routes buses are covering
router.get('/routes/all' , routeController.viewAllRoutes);

// view routes points for map display
router.get('/routes/map' , routeController.viewRoutesMap);

// view routes of operating buses
router.get('/routes/operating', routeController.viewOperatingRoutes);



// view bus schedule for users (no auth)
router.get('/schedule/fetch', scheduleController.getUserSchedule);



//change the language or appeareance
router.patch('/language', accessRequireToken(loginToken), userController.changeLanguage);
router.patch('/appearance', accessRequireToken(loginToken), userController.changeAppearance);


//===========================================================================================================================
export default router;