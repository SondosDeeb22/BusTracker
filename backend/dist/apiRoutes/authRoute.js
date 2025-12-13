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
router.get('/user-info', (0, tokenRequired_1.accessRequireToken)(tokenNameEnum_1.loginToken), authController.getCurrentUser);
// Reset Password process
router.post('/forgot-password', authController.sendEmailToResetPassword);
router.head('/reset-password', (0, tokenRequired_1.accessRequireToken)(tokenNameEnum_1.resetPasswordToken), (req, res) => {
    res.sendStatus(200);
});
router.patch('/reset-password', (0, tokenRequired_1.accessRequireToken)(tokenNameEnum_1.resetPasswordToken), authController.resetPassword); /// reset-password-token is the name of required token
// this endpoint for drivers only 
router.patch('/set-password/:token', authController.setPassword);
//===========================================================================================================================
exports.default = router;
//# sourceMappingURL=authRoute.js.map