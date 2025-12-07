//============================================================================================================================================================
//?importing 
//============================================================================================================================================================
import  AuthService  from '../services/authService';
import { Request, Response } from 'express';

//import Enums ------------------------------------------------------------------------------
import { tokenNames } from "../enums/tokenNameEnum";


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
    // function send email for user for password resetting
    async sendEmailToResetPassword(req: Request, res: Response):Promise<void>{
        return authService.sendPasswordResetEmail(req, res);
    }

    //=================================================================================================================================
    // function to rest the password
    async resetPassword(req: Request, res: Response): Promise<void>{
        return authService.resetPassword(req, res);
    }
    //==================================================================================================================================
    // function to send validate email to set password (for fresh user, like just added dirver)
    async sendValidateEmail(req: Request, res: Response, email: string){
        return authService.sendValidateEmail(req, res, email);
    }

    //================================================================================================================================
    //function to set password (if it's new user, e.x: new driver )
    async setPassword(req: Request , res: Response):Promise<void | string>{
        return authService.setPassword(req, res, tokenNames.setPasswordToken);
    }

}

//============================================================================================================================================================