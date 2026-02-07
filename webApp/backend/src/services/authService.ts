//==========================================================================================================
//? Import Sections
//==========================================================================================================

import { AuthRequest, AuthResponse } from "../types/express/auth";

// import interfaces ------------------------------------------------------------------------
import { emailInterface } from "../interfaces/authServiceInterface";

//import enums -----------------------
import { role } from "../enums/userEnum";

import { AuthServiceResult } from "./authService/types";

import { getCurrentUser } from "./authService/getCurrentUser";
import { login } from "./authService/login";
import { logout } from "./authService/logout";
import { resetPassword, sendEmailToResetPassword, verifyResetPasswordToken } from "./authService/passwordReset";
import { sendValidateEmail, setPassword, verifySetPasswordToken } from "./authService/setPassword";

//==========================================================================================================
//? Function we have in this class
// - store loginAttempt
// - login
// - logout

// - send email to reset user password
// - reset user password

//- set password (for freash user , e.x: drivers created by admin)

//==========================================================================================================


class AuthService{

    //==========================================================================================================
    //? Get Current User 
    //==========================================================================================================
    async getCurrentUser(req: AuthRequest, res: AuthResponse): Promise<AuthServiceResult<{ userID: string; userRole: string; userName: string }>>{
        return getCurrentUser(req, res);
    }

    //==========================================================================================================
    //? Login 
    //==========================================================================================================
    async login(req: AuthRequest, res: AuthResponse): Promise<AuthServiceResult>{
        return login(req, res);
    }

    //? =================================================================================================================================
    //? Logout function
    // =================================================================================================================================

    async logout(req: AuthRequest, res: AuthResponse): Promise<AuthServiceResult>{
        return logout(req, res);
    } 
    
    //? =================================================================================================================================
    //? Function that Send emails to Reset password
    // =================================================================================================================================

    async sendEmailToResetPassword(req: AuthRequest, res: AuthResponse, targetRole: role):Promise<AuthServiceResult>{
        return sendEmailToResetPassword(req, res, targetRole);
    }

    // =================================================================================================================================
    //? Function to verify reset password token (for frontend HEAD checks)
    // =================================================================================================================================
    async verifyResetPasswordToken(req: AuthRequest): Promise<emailInterface | null>{
        return verifyResetPasswordToken(req);
    }

    // =================================================================================================================================
    //? Function to verify set password token (for frontend HEAD checks)
    // =================================================================================================================================
    async verifySetPasswordToken(req: AuthRequest): Promise<emailInterface | null>{
        return verifySetPasswordToken(req);
    }

    //? =================================================================================================================================
    //? Function to reset the password
    // =================================================================================================================================
    async resetPassword(req: AuthRequest, res: AuthResponse):Promise<AuthServiceResult>{
        return resetPassword(req, res);
    }

    //====================================================================================================
    //? send Validation Email for new user (in order to set his password)
    //=========================================================================================
    async sendValidateEmail(email: string): Promise<AuthServiceResult> {
        return sendValidateEmail(email);
    }
    
    //===================================================================================================================================
    //? set password 
    //===================================================================================================================================
    async setPassword(req: AuthRequest, res: AuthResponse): Promise<AuthServiceResult>{
        return setPassword(req, res);
    }
}
//=================================================================================================================================================

export default AuthService;
