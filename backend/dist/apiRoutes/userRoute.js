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
//import enums ----------------------------------------------------------------
const tokenNameEnum_1 = require("../enums/tokenNameEnum");
const userEnum_1 = require("../enums/userEnum");
//import  Middlewares -------------------------------------
const tokenRequired_1 = require("../middlewares/tokenRequired"); // for authentication
const authorizeRole_1 = require("../middlewares/authorizeRole"); // for authorization
//===========================================================================================================================
// Router
//===========================================================================================================================
// view all routes buses are covering
router.get('/routes/all', routeController.viewAllRoutes);
// view routes of operating buses
router.get('/routes/operating', routeController.viewOperatingRoutes);
//change the language or appeareance
router.patch('/language', (0, tokenRequired_1.accessRequireToken)(tokenNameEnum_1.loginToken), userController.changeLanguage);
router.patch('/appearance', (0, tokenRequired_1.accessRequireToken)(tokenNameEnum_1.loginToken), userController.changeAppearance);
// change the route (by admin)
router.patch('/change-route', (0, tokenRequired_1.accessRequireToken)(tokenNameEnum_1.loginToken), (0, authorizeRole_1.authorizeRole)(userEnum_1.role.driver), userController.changeRoute);
// Start / Stop real-time tracking 
router.patch('/tracking', (0, tokenRequired_1.accessRequireToken)(tokenNameEnum_1.loginToken), userController.changeBusStatus);
//===========================================================================================================================
exports.default = router;
//# sourceMappingURL=userRoute.js.map