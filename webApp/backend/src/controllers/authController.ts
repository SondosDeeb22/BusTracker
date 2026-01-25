//============================================================================================================================================================
//?importing 
//============================================================================================================================================================
import  AuthService  from '../services/authService';
import { Request, Response } from 'express';
import { sendResponse } from '../exceptions/messageTemplate';

//import Enums ------------------------------------------------------------------------------
import { setPasswordToken } from "../enums/tokenNameEnum";
import { loginData, emailInterface, NewPassword} from "../interfaces/authServiceInterface";    
import {role} from '../enums/userEnum';

const authService = new AuthService();


//============================================================================================================================================================

export class AuthController{

    //=================================================================================================================================
    // Login function
    async login(req: Request, res: Response): Promise<void>{
        return authService.login(req, res);
    }

    //=================================================================================================================================
    // Get current user data
    async getCurrentUser(req: Request, res: Response): Promise<void>{
        return authService.getCurrentUser(req, res);
    }

    //=================================================================================================================================
    // Logout function
    async logout(req: Request, res: Response): Promise<void>{
        return authService.logout(req, res);
    }
    
    // =================================================================================================================================
    //? 1. Reset Password (Forgot password page)

    // 1.1. function send email for user for password resetting
    async sendEmailToResetAdminPassword(req: Request, res: Response): Promise<void>{
        return authService.sendEmailToResetPassword(req, res, role.admin);
    }

    //==================================================================================================================================
    // 1.2. function send email for user for password resetting
    async sendEmailToResetDriverPassword(req: Request, res: Response): Promise<void>{
        return authService.sendEmailToResetPassword(req, res, role.driver);
    }

    //==================================================================================================================================
        
    // 1.3. verify reset password token (HEAD)

    async verifyResetPasswordToken(req: Request, res: Response): Promise<emailInterface | null>{
        // ensure that JWT_RESET_PASSWORD_KEY exists in .env
            const jwtResetPasswordKey = process.env.JWT_RESET_PASSWORD_KEY?.trim();
            if (!jwtResetPasswordKey) {
                console.error('JWT_RESET_PASSWORD_KEY is not defined');
                sendResponse(res, 500, 'common.errors.internal');
                return null;
            }

        const userData = await authService.verifyToken(req, res, jwtResetPasswordKey);
        if (!userData) {
            return null;
        }

        res.sendStatus(200);
        return userData;
    }
    //=================================================================================================================================
    // 1.4. function to rest the password
    async resetPassword(req: Request, res: Response): Promise<void>{
        return authService.resetPassword(req, res);
    }


    //==================================================================================================================================
    //? ==================================================================================================================================
    //=================================================================================================================================
    //? 2. Set Password 

    //? 2.1 function to send validate email to set password (for fresh user, like newly added dirver)
    async sendValidateEmail(req: Request, res: Response, email: string): Promise<void>{
        return authService.sendValidateEmail( res, email);
    }
    //==================================================================================================================================
    //? 2.2.  verify set password token (HEAD)

    async verifySetPasswordToken(req: Request, res: Response): Promise<emailInterface | null>{
        // ensure that JWT_RESET_PASSWORD_KEY exists in .env
            const jwtSetPasswordKey = process.env.JWT_SET_PASSWORD_KEY;
            if (!jwtSetPasswordKey) {
                console.error('JWT_SET_PASSWORD_KEY is not defined');
                sendResponse(res, 500, 'common.errors.internal');
                return null;
            }

        const userData = await authService.verifyToken(req, res, jwtSetPasswordKey);
        if (!userData) {
            return null;
        }

        res.sendStatus(200);
        return userData;
    }
    //==================================================================================================================================
    //? 2.3. function to set password (if it's new user, e.x: new driver )
    async setPassword(req: Request , res: Response): Promise<void>{
        return authService.setPassword(req, res);
    }
}

//============================================================================================================================================================