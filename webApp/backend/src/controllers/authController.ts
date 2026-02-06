//============================================================================================================================================================
//?importing 
//============================================================================================================================================================

import { Request, Response } from 'express';
import { sendResponse } from '../exceptions/messageTemplate';

import { AuthRequest, AuthResponse } from '../types/express/auth';

//import Enums ------------------------------------------------------------------------------
import { setPasswordToken } from "../enums/tokenNameEnum";
import { loginData, emailInterface, NewPassword} from "../interfaces/authServiceInterface";    
import {role} from '../enums/userEnum';

// import service 
import  AuthService  from '../services/authService';
const authService = new AuthService();


//============================================================================================================================================================

export class AuthController{

    // =========================================================================================
    // used to convert Express Request to AuthRequest (so we can pass it to service functions)
    private toAuthReq = (req: Request): AuthRequest => {
        return {
            body: req.body,
            cookies: req.cookies,
            ip: req.ip,
            params: req.params,
            query: req.query,
        };
    }

    // used to convert Express Response to AuthResponse (so we can pass it to service functions)
    private toAuthRes = (res: Response): AuthResponse => {
        return {
            setCookie: res.cookie.bind(res),
            clearCookie: res.clearCookie.bind(res),
        };
    }

    //=================================================================================================================================
    // Login function
    login = async (req: Request, res: Response): Promise<void> => {
        const result = await authService.login(this.toAuthReq(req), this.toAuthRes(res));
        sendResponse(res, result.status, result.messageKey, (result as any).data);
        return;
    }

    //=================================================================================================================================
    // Get current user data
    getCurrentUser = async (req: Request, res: Response): Promise<void> => {
        const result = await authService.getCurrentUser(this.toAuthReq(req), this.toAuthRes(res));
        sendResponse(res, result.status, result.messageKey, (result as any).data);
        return;
    }

    //=================================================================================================================================
    // Logout function
    logout = async (req: Request, res: Response): Promise<void> => {
        const result = await authService.logout(this.toAuthReq(req), this.toAuthRes(res));
        sendResponse(res, result.status, result.messageKey, (result as any).data);
        return;
    }
    
    // =================================================================================================================================
    //? 1. Reset Password (Forgot password page)

    // 1.1. function send email for user for password resetting
    sendEmailToResetAdminPassword = async (req: Request, res: Response): Promise<void> => {
        const result = await authService.sendEmailToResetPassword(this.toAuthReq(req), this.toAuthRes(res), role.admin);
        sendResponse(res, result.status, result.messageKey, (result as any).data);
        return;
    }

    //==================================================================================================================================
    // 1.2. function send email for user for password resetting
    sendEmailToResetDriverPassword = async (req: Request, res: Response): Promise<void> => {
        const result = await authService.sendEmailToResetPassword(this.toAuthReq(req), this.toAuthRes(res), role.driver);
        sendResponse(res, result.status, result.messageKey, (result as any).data);
        return;
    }

    //==================================================================================================================================
        
    // 1.3. verify reset password token (HEAD)

    verifyResetPasswordToken = async (req: Request, res: Response): Promise<emailInterface | null> => {
        const userData = await authService.verifyResetPasswordToken(this.toAuthReq(req));
        if (!userData) {
            res.sendStatus(401);
            return null;
        }

        res.sendStatus(200);
        return userData;
    }
    //=================================================================================================================================
    // 1.4. function to rest the password
    resetPassword = async (req: Request, res: Response): Promise<void> => {
        const result = await authService.resetPassword(this.toAuthReq(req), this.toAuthRes(res));
        sendResponse(res, result.status, result.messageKey, (result as any).data);
        return;
    }


    //==================================================================================================================================
    //? ==================================================================================================================================
    //=================================================================================================================================
    //? 2. Set Password 

    //? 2.1 function to send validate email to set password (for fresh user, like newly added dirver)
    sendValidateEmail = async (req: Request, res: Response, email: string): Promise<void> => {
        const result = await authService.sendValidateEmail(email);
        sendResponse(res, result.status, result.messageKey, (result as any).data);
        return;
    }
    //==================================================================================================================================
    //? 2.2.  verify set password token (HEAD)

    verifySetPasswordToken = async (req: Request, res: Response): Promise<emailInterface | null> => {
        const userData = await authService.verifySetPasswordToken(this.toAuthReq(req));
        if (!userData) {
            res.sendStatus(401);
            return null;
        }

        res.sendStatus(200);
        return userData;
    }
    //==================================================================================================================================
    //? 2.3. function to set password (if it's new user, e.x: new driver )
    setPassword = async (req: Request , res: Response): Promise<void> => {
        const result = await authService.setPassword(this.toAuthReq(req), this.toAuthRes(res));
        sendResponse(res, result.status, result.messageKey, (result as any).data);
        return;
    }
}

//============================================================================================================================================================