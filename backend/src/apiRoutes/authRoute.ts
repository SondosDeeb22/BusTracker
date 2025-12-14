//===========================================================================================================================
// setup Express route
//===========================================================================================================================
import express, { Router } from "express";

const router: Router = express.Router();

//===========================================================================================================================
//importing authentication functions
//===========================================================================================================================

//import enums ----------------------------------------------------------------
import { loginToken, resetPasswordToken } from '../enums/tokenNameEnum';

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
router.get('/user-info', accessRequireToken(loginToken), authController.getCurrentUser);


router.post('/forgot-password', authController.sendEmailToResetPassword);


// public token verification endpoint for reset password (HEAD) using same handler for shared logic
router.head('/reset-password/:token', authController.verifyResetPasswordToken);
router.patch('/reset-password/:token', authController.resetPassword); /// reset-password-token is the name of required token


// this endpoint for drivers only 
router.head('/set-password/:token', authController.verifySetPasswordToken); 
router.patch('/set-password/:token', authController.setPassword); 


//===========================================================================================================================
export default router;