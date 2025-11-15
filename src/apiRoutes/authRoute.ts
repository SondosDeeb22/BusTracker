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

//import controller ----------------------------------------------------------
import {AuthController} from "../controllers/authController";
const authController = new AuthController();


//import  Middlewares  for authentication -------------------------------------
import { accessRequireToken } from '../middlewares/tokenRequired';

//===========================================================================================================================
// Router
//===========================================================================================================================



router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Reset Password process
router.post('/forgot-password', authController.sendEmailToResetPassword);
router.patch('/reset-password', accessRequireToken(tokenNames.resetPasswordToken), authController.resetPassword); /// reset-password-token is the name of required token



//===========================================================================================================================
export default router;