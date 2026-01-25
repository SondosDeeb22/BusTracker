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
//import controller ----------------------------------------------------------
const authController_1 = require("../controllers/authController");
const authController = new authController_1.AuthController();
//import  Middlewares  for authentication -------------------------------------
const tokenRequired_1 = require("../middlewares/tokenRequired");
//===========================================================================================================================
// Router
//===========================================================================================================================
// Login, Logout, get user info --------------------------------------------------------------------------------------
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/user-info', (0, tokenRequired_1.accessRequireToken)(tokenNameEnum_1.loginToken), authController.getCurrentUser);
// send reset password email( Forgot Password page) -----------------------------------------------------------------
router.post('/admin/forgot-password', authController.sendEmailToResetAdminPassword);
router.post('/driver/forgot-password', authController.sendEmailToResetDriverPassword);
// Reset password -----------------------------------------------------------------------------------------
// public token verification endpoint for reset password (HEAD) using same handler for shared logic
router.head('/reset-password/:token', authController.verifyResetPasswordToken);
router.patch('/reset-password/:token', authController.resetPassword); /// reset-password-token is the name of required token
// password setup (fresh-driver) ----------------------------------------------------------------------------
router.head('/set-password/:token', authController.verifySetPasswordToken);
router.patch('/set-password/:token', authController.setPassword);
//===========================================================================================================================
exports.default = router;
//# sourceMappingURL=authRoute.js.map