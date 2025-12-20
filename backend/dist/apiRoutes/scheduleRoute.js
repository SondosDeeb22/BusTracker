"use strict";
// //===========================================================================================================================
// // setup Express route
// //===========================================================================================================================
// import express, { Router } from "express";
// const router: Router = express.Router();
// //===========================================================================================================================
// //importing authentication functions
// //===========================================================================================================================
// //import enums ----------------------------------------------------------------
// import { tokenNames } from '../enums/tokenNameEnum';
// import { role } from '../enums/userEnum';
// //import controllers ----------------------------------------------------------
// import { BusScheduleController } from "../controllers/busScheduleController";
// const busScheduleController = new BusScheduleController();
// //import  Middlewares -------------------------------------
// import { accessRequireToken } from '../middlewares/tokenRequired'; // for authentication
// import { authorizeRole } from '../middlewares/authorizeRole'; // for authorization
// //===========================================================================================================================
// // Router
// //===========================================================================================================================
// // Adding schedule
// router.post('/add', accessRequireToken(tokenNames.loginToken), authorizeRole(role.admin), busScheduleController.addSchedule);
// // Remove schedule
// router.delete('/remove', accessRequireToken(tokenNames.loginToken), authorizeRole(role.admin), busScheduleController.removeSchedule);
// // Update schedule
// router.patch('/update', accessRequireToken(tokenNames.loginToken), authorizeRole(role.admin), busScheduleController.updateSchedule);
// // Fetch all schedules
// router.get('/fetch', accessRequireToken(tokenNames.loginToken), authorizeRole(role.admin), busScheduleController.fetchAllSchedules);
// // Fetch drivers for dropdown
// router.get('/drivers', accessRequireToken(tokenNames.loginToken), authorizeRole(role.admin), busScheduleController.fetchDrivers);
// // Fetch routes for dropdown
// router.get('/routes', accessRequireToken(tokenNames.loginToken), authorizeRole(role.admin), busScheduleController.fetchRoutes);
// // Fetch buses for dropdown
// router.get('/buses', accessRequireToken(tokenNames.loginToken), authorizeRole(role.admin), busScheduleController.fetchBuses);
// //===========================================================================================================================
// export default router;
//# sourceMappingURL=scheduleRoute.js.map