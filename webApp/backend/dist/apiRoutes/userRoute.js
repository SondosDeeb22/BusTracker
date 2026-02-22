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
//import controllers ----------------------------------------------------------
const routeController_1 = require("../controllers/routeController");
const routeController = new routeController_1.RouteController();
const userController_1 = require("../controllers/userController");
const userController = new userController_1.UserController();
const scheduleController_1 = require("../controllers/scheduleController");
const scheduleController = new scheduleController_1.ScheduleController();
//import enums ----------------------------------------------------------------
const tokenNameEnum_1 = require("../enums/tokenNameEnum");
//import  Middlewares -------------------------------------
const tokenRequired_1 = require("../middlewares/tokenRequired"); // for authentication
//===========================================================================================================================
// Router
//===========================================================================================================================
// view all routes buses are covering
router.get('/routes/all', routeController.viewAllRoutes);
// view routes points for map display
router.get('/routes/map', routeController.viewRoutesMap);
// view routes of operating buses
router.get('/routes/operating', routeController.viewOperatingRoutes);
// view bus schedule for users (no auth)
router.get('/schedule/fetch', scheduleController.getUserSchedule);
//change the language or appeareance
router.patch('/language', (0, tokenRequired_1.accessRequireToken)(tokenNameEnum_1.loginToken), userController.changeLanguage);
router.patch('/appearance', (0, tokenRequired_1.accessRequireToken)(tokenNameEnum_1.loginToken), userController.changeAppearance);
//===========================================================================================================================
exports.default = router;
//# sourceMappingURL=userRoute.js.map