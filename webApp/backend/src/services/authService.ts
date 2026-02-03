//==========================================================================================================
//? Import Sections
//==========================================================================================================

import bcrypt from "bcrypt";

import { AuthRequest, AuthResponse } from "../types/express/auth";

// import interfaces ------------------------------------------------------------------------
import { loginData, emailInterface, NewPassword} from "../interfaces/authServiceInterface";    
import { JWTdata } from "../interfaces/helper&middlewareInterface";


// import Models ------------------------------------------------------------------------
import UserModel from "../models/userModel";



//import enums -----------------------
import {role} from  '../enums/userEnum';

// import helpers --------------------------------------------------------------------
import AuthHelper from "../helpers/authHelpher";
const authHelper = new AuthHelper();

import {sendEmail} from "../helpers/sendEmail";

import { InternalError, UnauthorizedError } from '../errors';

type AuthServiceResult<T = undefined> = {
    status: number;
    messageKey: string;
    data?: T;
};

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
    async getCurrentUser(req: AuthRequest, res: AuthResponse): Promise<AuthServiceResult<{ userID: number; userRole: string; userName: string }>>{
        try {
            const userData = authHelper.getUserData(req);
            return { status: 200, messageKey: 'auth.currentUser.success', data: userData };
            
        // ----------------------------------------
        } catch (error) {
            console.error('Error retrieving user data.', error);

            if (error instanceof UnauthorizedError) {
                return { status: 401, messageKey: error.message };
            }

            return { status: 500, messageKey: 'common.errors.internal' };
        }

    }

    //==========================================================================================================
    //? Login 
    //==========================================================================================================
    async login(req: AuthRequest, res: AuthResponse): Promise<AuthServiceResult>{
        try {
            // the provided login data
            const body: loginData = req.body;

            const {
                email, 
                password
            } = body;

            //check if the user provided all the needed data
            if( !email || !password){
                return { status: 500, messageKey: 'common.errors.validation.fillAllFields' };
            }
            const userEmail = email.trim();

            //====================================================================================================================================================
            // check if user registed in the system

            const userExists = await UserModel.findOne({
                where:{
                    email: userEmail
                }
            })

            if(!userExists){
                return { status: 404, messageKey: 'auth.login.userNotFound' };
            }
            //=================================================================================================================================================
            // validate the provided password 

            const validPassword: boolean = await bcrypt.compare(password, userExists.hashedPassword);

            let attemptSuccessful: boolean;
            let resultMessage: string;
            let status: number;
            if(validPassword){
                authHelper.createLoginSession(res, { userID: Number(userExists.id), userRole: userExists.role, userName: userExists.name } as JWTdata);
                
                attemptSuccessful = true;
                resultMessage = `${userExists.name} logged in`;
                status= 200;
            }
                //=================================================================================================================================================
            else{
                attemptSuccessful = false;
                resultMessage = "password is wrong, please try again";
                status = 401;
            }

            void authHelper.loginAttempt(req, attemptSuccessful, email);

            return { status, messageKey: attemptSuccessful ? 'auth.login.success' : 'auth.login.invalidCredentials' };
            
        } catch (error) {
            console.error('Error Found while Logging in.', error);
            return { status: 500, messageKey: 'common.errors.internal' };
        }

    }

    //? =================================================================================================================================
    //? Logout function
    // =================================================================================================================================

    async logout(req: AuthRequest, res: AuthResponse): Promise<AuthServiceResult>{
        try {
            authHelper.getUserData(req);
            authHelper.clearLoginSession(res);

            

            return { status: 200, messageKey: 'auth.logout.success' };

        // -----------------------------------------------------------
        } catch (error) {
            console.error('Error during logout.', error);

            if (error instanceof UnauthorizedError) {
                return { status: 401, messageKey: error.message };
            }

            return { status: 500, messageKey: 'common.errors.internal' };
        }
    } 
    
    //? =================================================================================================================================
    //? Function that Send emails to Reset password
    // =================================================================================================================================

    async sendEmailToResetPassword(req: AuthRequest, res: AuthResponse, targetRole: role):Promise<AuthServiceResult>{
        try{
            const body:emailInterface = req.body;

            const {
                email,
            } = body;

            if(!email){
                return { status: 500, messageKey: 'auth.passwordReset.validation.emailRequired' };
            }
            
            // ensure the user is registred in out DB -------------------------------------------------------------------------------
            const uesrExists = await UserModel.findOne({
                where :{
                    email: email,
                }, 
                attributes: ['email', 'role']
            })
            
            if(!uesrExists){
                return { status: 500, messageKey: 'auth.passwordReset.errors.emailNotRegistered' };
            }

            const userRole = uesrExists.role;

            // if the user not allowed to perform this stop the opeartion (e.x: driver trying to reset his passwrod from the admin portal , visa vers )
            if(userRole !== targetRole){
                return { status: 403, messageKey: 'auth.passwordReset.errors.notTargetedRole' };
            }
            //create token and store it in cookie----------------------------------------------------------------------------------
            let resetPasswordTokenCreation : string;
            try{
                resetPasswordTokenCreation = authHelper.createResetPasswordUrlToken(email);
                
            }catch(error){
                console.error('Error occured while creating reset password token.', error);
                return { status: 500, messageKey: 'auth.common.errors.internal' };
            }
            // ==============================================================================================================================
            const mailSubject: string = "Password Reset";
            // const mailText: string = `A request has been received to reset the password for your account in Health App.
            // If you would like to proceed in this operation, please click on the button below 
            // Please note that this Reset Link will expire in 10 minutes`;

            // ---------------------------------------------------------------------
            const resetLink = `http://localhost:3000/reset-password?token=${resetPasswordTokenCreation}`
            const htmlContent = `
            <p>A request has been received to reset the password for your account in NEU Bus Tracker</p>
            <p>If you would like to proceed in this operation, please click on the button below</p>
            <a href="${resetLink}"
                style="display: inline-block;
                background-color:#59011A;
                color:white;
                text-decoration:none;
                font-weight:bold;
                border-radious: 4px;
                cursor: pointer;
                padding: 12px 24px;">Reset Password</a>
            <br><br>
            <p>Please note that this Reset Link will expire in 10 minutes</p>`;

            
            await sendEmail(email, mailSubject, htmlContent);

            return { status: 200, messageKey: 'auth.passwordReset.success.emailSent' };
            // ----------------------------------------------------------
        }catch(error){
            console.error('Error occured while sending password reset email.', error);
            return { status: 500, messageKey: 'common.errors.internal' };
        }
    }

    // =================================================================================================================================
    //? Function to verify reset password token (for frontend HEAD checks)
    // =================================================================================================================================
    async verifyResetPasswordToken(req: AuthRequest): Promise<emailInterface | null>{
        try{
            const userData = authHelper.verifyResetPasswordUrlTokenFromRequest<emailInterface>(req);
            if(!userData || typeof userData !== "object" || !userData.email){
                return null;
            }
            return userData;
            
        }catch(error){
            console.error('Error occured while verifying token.', error);
            return null;
        }
    }

    // =================================================================================================================================
    //? Function to verify set password token (for frontend HEAD checks)
    // =================================================================================================================================
    async verifySetPasswordToken(req: AuthRequest): Promise<emailInterface | null>{
        try{
            const userData = authHelper.verifySetPasswordUrlTokenFromRequest<emailInterface>(req);
            if(!userData || typeof userData !== "object" || !userData.email){
                return null;
            }
            return userData;
        }catch(error){
            console.error('Error occured while verifying token.', error);
            return null;
        }
    }

    //? =================================================================================================================================
    //? Function to reset the password
    // =================================================================================================================================
    async resetPassword(req: AuthRequest, res: AuthResponse):Promise<AuthServiceResult>{
        try{
            // ensure token was provided 
            const userData = await this.verifyResetPasswordToken(req);

            if(!userData){
                return { status: 401, messageKey: 'common.auth.invalidToken' };
            }

            // get the passwords from the user input ------------------------------------------
            
            const body: NewPassword = req.body;

            const{
                newPassword,
                confirmPassword
            }= body;

            if(!newPassword || !confirmPassword){
                return { status: 500, messageKey: 'auth.passwordReset.validation.passwordRequired' };
            }

            //ensure the user entered identical passwords
            if(newPassword !== confirmPassword){
                return { status: 500, messageKey: 'auth.passwordReset.validation.passwordsMustMatch' };
            }

            // update the password in the database ----------------------------------------------------------

            const hashedPassword: string = await bcrypt.hash(newPassword, 8);

            const [updatedPassword] = await UserModel.update({ // updatedPassword return the number of rows that has been changed
                hashedPassword: hashedPassword
            },{
                where:{
                    email: userData.email
                }
            });

            if(updatedPassword === 0){
                return { status: 500, messageKey: 'auth.passwordReset.errors.notUpdated' };
            }

            return { status: 200, messageKey: 'auth.passwordReset.success.updated' };

            //=========================================================================
        }catch(error){
            console.error('Error occured while resetting the password.', error);

            return { status: 500, messageKey: 'common.errors.internal' };

        }
    }

    //====================================================================================================
    //? send Validation Email for new user (in order to set his password)
    //=========================================================================================
    async sendValidateEmail(email: string): Promise<AuthServiceResult> {
        const setPasswordTokenCreation = authHelper.createSetPasswordUrlToken(email);

        const mailSubject: string = "Set your Password";
        const setLink = `http://localhost:3000/set-password?token=${setPasswordTokenCreation}`;
        const htmlContent = `
            <p>Hello,</p>

            <p>Your account was created in NEU Bus Tracker platform.</p>

            <p>To finish setting up your account, please set up your password from the link below:</p>

            <a href="${setLink}"
                style="display: inline-block;
                background-color:#59011A;
                color:white;
                text-decoration:none;
                font-weight:bold;
                border-radious: 15px;
                cursor: pointer;
                padding: 12px 24px;">Set Password</a>
            <br><br>
       
            <br><br>

            <p>Please note that this link will expire in 20 minutes</p>`;

        await sendEmail(email, mailSubject, htmlContent);

        return { status: 200, messageKey: 'common.crud.sent' };
    }
    
    //===================================================================================================================================
    //? set password 
    //===================================================================================================================================
    async setPassword(req: AuthRequest, res: AuthResponse): Promise<AuthServiceResult>{
        try{
            // ensure token was provided 
            const userData = await this.verifySetPasswordToken(req);

            if(!userData){
                return { status: 401, messageKey: 'common.auth.invalidToken' };
            }


            // get the passwords from the user input ------------------------------------------
            const body: NewPassword = req.body;

            const{
                newPassword,
                confirmPassword
            }= body;

 
            if(!newPassword || !confirmPassword){
                return { status: 500, messageKey: 'auth.setPassword.validation.passwordRequired' };
            }

            //ensure the user entered identical passwords
            if(newPassword !== confirmPassword){
                return { status: 500, messageKey: 'auth.setPassword.validation.passwordsMustMatch' };
            }


        
            // update the password in the database ----------------------------------------------------------

            const hashedPassword: string = await bcrypt.hash(newPassword, 8);

            const [updatedPassword] = await UserModel.update({ // updatedPassword return the number of rows that has been changed
                hashedPassword: hashedPassword
            },{
                where:{
                    email: userData.email
                }
            });

            if(updatedPassword === 0){
                return { status: 500, messageKey: 'auth.setPassword.errors.notUpdated' };
            }

    
            // Clear any existing login session on this browser 
            authHelper.clearLoginSession(res);

            return { status: 200, messageKey: 'auth.setPassword.success.updated' };

        //======================================================================================================
        }catch(error){
            console.error('Error occurred while setting password.', error);
            return { status: 500, messageKey: 'common.errors.internal' };
        }
    }
}
//=================================================================================================================================================

export default AuthService;
