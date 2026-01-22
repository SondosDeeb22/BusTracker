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

//import enums ----------------------------------------------------------------
import { loginToken } from '../enums/tokenNameEnum';

import { role } from '../enums/userEnum';

//import  Middlewares -------------------------------------
import { accessRequireToken } from '../middlewares/tokenRequired'; // for authentication

import { authorizeRole } from '../middlewares/authorizeRole'; // for authorization
//===========================================================================================================================
// Router
//===========================================================================================================================

// view all routes buses are covering
router.get('/routes/all' , routeController.viewAllRoutes);

// view routes of operating buses
router.get('/routes/operating', routeController.viewOperatingRoutes);

//change the language or appeareance
router.patch('/language', accessRequireToken(loginToken), userController.changeLanguage);
router.patch('/appearance', accessRequireToken(loginToken), userController.changeAppearance);

// change the route (by admin)
router.patch('/change-route', accessRequireToken(loginToken), authorizeRole(role.driver),  userController.changeRoute);

// Start / Stop real-time tracking 
router.patch('/tracking', accessRequireToken(loginToken), userController.changeBusStatus);
//===========================================================================================================================
export default router;