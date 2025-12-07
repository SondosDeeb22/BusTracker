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
router.get('/me', accessRequireToken(tokenNames.loginToken), authController.getCurrentUser);

// Reset Password process
router.post('/forgot-password', authController.sendEmailToResetPassword);
router.head('/reset-password', accessRequireToken(tokenNames.resetPasswordToken), (req, res) => {
  res.sendStatus(200);
});
router.patch('/reset-password', accessRequireToken(tokenNames.resetPasswordToken), authController.resetPassword); /// reset-password-token is the name of required token


// this endpoint for drivers only 
router.patch('/set-password/:token', authController.setPassword); 

//===========================================================================================================================
export default router;