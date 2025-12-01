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
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', (0, tokenRequired_1.accessRequireToken)(tokenNameEnum_1.tokenNames.loginToken), authController.getCurrentUser);
// Reset Password process
router.post('/forgot-password', authController.sendEmailToResetPassword);
router.patch('/reset-password', (0, tokenRequired_1.accessRequireToken)(tokenNameEnum_1.tokenNames.resetPasswordToken), authController.resetPassword); /// reset-password-token is the name of required token
//===========================================================================================================================
exports.default = router;
//# sourceMappingURL=authRoute.js.map