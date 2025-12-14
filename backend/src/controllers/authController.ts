//============================================================================================================================================================
//?importing 
//============================================================================================================================================================
import  AuthService  from '../services/authService';
import { Request, Response } from 'express';

//import Enums ------------------------------------------------------------------------------
import { setPasswordToken } from "../enums/tokenNameEnum";
import { loginData, emailInterface, NewPassword} from "../interfaces/authServiceInterface";    


const authService = new AuthService();


//============================================================================================================================================================

export class AuthController{

    //=================================================================================================================================
    // Login function
    async login(req: Request, res: Response){
        return authService.login(req, res);
    }

    //=================================================================================================================================
    // Get current user data
    async getCurrentUser(req: Request, res: Response){
        return authService.getCurrentUser(req, res);
    }

    //=================================================================================================================================
    // Logout function
    async logout(req: Request, res: Response){
        return authService.logout(req, res);
    }
    
    // =================================================================================================================================
    //? 1. Reset Password 
    //? 1.1. function send email for user for password resetting
    async sendEmailToResetPassword(req: Request, res: Response):Promise<void>{
        return authService.sendEmailToResetPassword(req, res);
    }

    //==================================================================================================================================
    //? 1.2. verify reset password token (HEAD)

    async verifyResetPasswordToken(req: Request, res: Response): Promise<void | string | emailInterface>{
        // ensure that JWT_RESET_PASSWORD_KEY exists in .env
            const jwtResetPasswordKey = process.env.JWT_RESET_PASSWORD_KEY;
            if (!jwtResetPasswordKey) {
                res.sendStatus(500);
                return  "jwt key is not defined";
            }

        return authService.verifyToken(req, res, jwtResetPasswordKey);
    }
    //=================================================================================================================================
    //? 1.3. function to rest the password
    async resetPassword(req: Request, res: Response): Promise<void | string>{
        return authService.resetPassword(req, res);
    }


    //==================================================================================================================================
    //? ==================================================================================================================================
    //=================================================================================================================================
    //? 2. Set Password 

    //? 2.1 function to send validate email to set password (for fresh user, like newly added dirver)
    async sendValidateEmail(req: Request, res: Response, email: string){
        return authService.sendValidateEmail( res, email);
    }
    //==================================================================================================================================
    //? 2.2.  verify set password token (HEAD)

    async verifySetPasswordToken(req: Request, res: Response): Promise<void | string | emailInterface>{
        // ensure that JWT_RESET_PASSWORD_KEY exists in .env
            const jwtSetPasswordKey = process.env.JWT_SET_PASSWORD_KEY;
            if (!jwtSetPasswordKey) {
                res.sendStatus(500);
                return  "jwt key is not defined";
            }

        return authService.verifyToken(req, res, jwtSetPasswordKey);
    }
    //==================================================================================================================================
    //? 2.3. function to set password (if it's new user, e.x: new driver )
    async setPassword(req: Request , res: Response):Promise<void | string>{
        return authService.setPassword(req, res);
    }
}

//============================================================================================================================================================