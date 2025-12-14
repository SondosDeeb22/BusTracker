//==========================================================================================================
//? Import Sections
//==========================================================================================================

import { Request, Response } from "express"
import bcrypt from "bcrypt";

//import Enums ------------------------------------------------------------------------------
import { loginToken, resetPasswordToken, setPasswordToken } from "../enums/tokenNameEnum";

// import interfaces ------------------------------------------------------------------------
import { loginData, resetPassword, NewPassword} from "../interfaces/authServiceInterface";    
import { JWTdata } from "../interfaces/helper&middlewareInterface";
//importing libraries
import jwt from 'jsonwebtoken';


// import Models ------------------------------------------------------------------------
import UserModel from "../models/userModel";



// import exceptions --------------------------------------------------------------------
import { sendResponse } from "../exceptions/messageTemplate";



// import helpers --------------------------------------------------------------------
import AuthHelper from "../helpers/authHelpher";
const authHelper = new AuthHelper();

import {sendEmail} from "../helpers/sendEmail";

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
    async getCurrentUser(req: Request, res: Response): Promise<void>{
        try {
            //check if JWT exists in .env file
            const jwtLoginKey = process.env.JWT_LOGIN_KEY;
            if (!jwtLoginKey) {
                sendResponse(res, 500, `JWT_LOGIN_KEY is not defined : ${jwtLoginKey}`);
            return;
            }
           
            const userData = authHelper.extractJWTData<{userID: number, userRole: string, userName: string}>(req, loginToken, jwtLoginKey);

            if(typeof userData === "string"){
                sendResponse(res, 401, userData);
                return;
            }

            sendResponse(res, 200, "User data retrieved successfully", userData);
            return;
            
        } catch (error) {
            sendResponse(res, 500, `Error retrieving user data. ${error}`);
            return;
        }

    }

    //==========================================================================================================
    //? Login 
    //==========================================================================================================
    async login(req: Request, res: Response): Promise<void>{
        try {
            // the provided login data
            const body: loginData = req.body;

            const {
                email, 
                password
            } = body;

            //check if the user provided all the needed data
            if( !email || !password){
                sendResponse(res, 500, "Fill all Fields please");
                return;
            }

            //====================================================================================================================================================
            // check if user registed in the system

            const userExists = await UserModel.findOne({
                where:{
                    email: email
                }
            })

            if(!userExists){
                sendResponse(res, 500, "No user found with the provided data");
                return;
            }
            //=================================================================================================================================================
            // validate the provided password 

            const validPassword: boolean = await bcrypt.compare(password, userExists.hashedPassword);

            let attemptSuccessful: boolean;
            let resultMessage: string;
            let status: number;
            if(validPassword){
                //---------------------------------------------------------------------------------------------------------------------------------------------
                // Create JWT 

                try{
                    //check if JWT exists in .env file
                    const jwtLoginKey = process.env.JWT_LOGIN_KEY;
                    if (!jwtLoginKey) {
                        sendResponse(res, 500, `JWT_LOGIN_KEY is not defined : ${jwtLoginKey}`);
                        return;
                    }
                
                    authHelper.createJWTtoken( res, loginToken, jwtLoginKey,
                        {userID: userExists.id, userRole: userExists.role, userName: userExists.name                        
                        }, 3600000, true);// 3,600,000 millisecond = 60 minutes
                    
                }catch(error){
                    sendResponse(res, 500, (error as Error).message);
                    return;
                }
                
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

            authHelper.loginAttempt(req, res, attemptSuccessful, email, status, resultMessage);

            return;
            
        } catch (error) {
            sendResponse(res, 500, `Error Found while Logging in. ${error}`);
            return;
        }

    }

    //? =================================================================================================================================
    //? Logout function
    // =================================================================================================================================

    async logout(req: Request, res: Response): Promise<void>{
        try {
            //check if JWT exists in .env file
            const jwtLoginKey = process.env.JWT_LOGIN_KEY;
            if (!jwtLoginKey) {
                sendResponse(res, 500, `JWT_LOGIN_KEY is not defined : ${jwtLoginKey}`);
                return;
            }
           
            const userData = authHelper.extractJWTData<JWTdata>(req, loginToken, jwtLoginKey);

            if(typeof userData === "string"){ // when userData is string (so it's not object that contains users data ). then, we  return the error message and stop the function 
                sendResponse(res, 500, userData);// userData here is Error message , check authHelper.ts file
                return;
            }

            // get the user name from the token
            const name: string = userData.userName //"fix the auth func "

            authHelper.removeCookieToken(res, loginToken)

            

            sendResponse(res, 200, `${name} logged out`);
            return;

        // ===============================================================================================================================
        } catch (error) {
            sendResponse(res, 500, `Error during logout. ${error}`);
            return;
        }
    } 
    
    //? =================================================================================================================================
    //? Function that Send emails to Reset password
    // =================================================================================================================================

    async sendPasswordResetEmail(req: Request, res: Response): Promise<void>{
        try{
            const body:resetPassword = req.body;

            const {
                email
            } = body;
            
            if(!email){
                sendResponse(res, 500, 'Enter Email address to proceed in Reset password operation');
                return;
            }
            
            // ensure the user is registred in out DB -------------------------------------------------------------------------------
            const uesrExists = await UserModel.findOne({
                where :{
                    email: email
                }
            })

            if(!uesrExists){
                sendResponse(res, 500, "This email is not registered in our system. Please use the email associated with your account");
                return;
            }
            //create token and store it in cookie----------------------------------------------------------------------------------
            try{

                //check if JWT exists in .env file
                const jwtResetPasswordKey = process.env.JWT_RESET_PASSWORD_KEY;
                if (!jwtResetPasswordKey) {
                    sendResponse(res, 500, `JWT_RESET_PASSWORD_KEY is not defined : ${jwtResetPasswordKey}`);
                    return;
                }
                authHelper.createJWTtoken( res, 
                    resetPasswordToken, 
                    jwtResetPasswordKey, 
                    {email: email}, 
                    1200000, 
                    true);// 1,200,000 millisecond = 20 minutes
                
            }catch(error){
                sendResponse(res, 500, (error as Error).message);
                return;
            }
            // ==============================================================================================================================
            const mailSubject: string = "Password Reset";
            // const mailText: string = `A request has been received to reset the password for your account in Health App.
            // If you would like to proceed in this operation, please click on the button below 
            // Please note that this Reset Link will expire in 10 minutes`;

            // ---------------------------------------------------------------------
            const resetLink = "http://localhost:3000/reset-password" 
            const htmlContent = `
            <p>A request has been received to reset the password for your account in NEU Bus Tracker</p>
            <p>If you would like to proceed in this operation, please click on the button below</p>
            <a href="${resetLink}"
                style="display: inline-block;
                background-color:blue;
                color:white;
                text-decoration:none;
                border-radious: 4px;
                cursor: pointer;
                padding: 12px 24px;">Reset Password</a>
            <br><br>
            <p>Please note that this Reset Link will expire in 10 minutes</p>`;

            
            const sendEmailSResponse = await sendEmail(email, mailSubject, htmlContent);

            sendResponse(res, 200, sendEmailSResponse);
            return ;
            //======================================================================================================
        }catch(error){
            sendResponse(res, 500, `Error occured while sending password reset email. ${error}`);
            return;
        }
    }
    //? =================================================================================================================================
    //? Function to reset the password
    // =================================================================================================================================
    async resetPassword(req: Request, res: Response):Promise<void>{
        try{
            const body: NewPassword = req.body;

            const{
                newPassword,
                confirmPassword
            }= body;

            if(!newPassword || !confirmPassword){
                sendResponse(res, 500, "Please provide a password to proceed with the Password Reset operation");
                return;
            }

            //ensure the user entered identical passwords
            if(newPassword !== confirmPassword){
                sendResponse(res, 500, "Make sure both passwords are identical");
                return;
            }

            // extract email from the token ---------------------------------------

            //check if JWT exists in .env file
            const jwtResetPasswordKey = process.env.JWT_RESET_PASSWORD_KEY;
            if (!jwtResetPasswordKey) {
                sendResponse(res, 500, `JWT_RESET_PASSWORD_KEY is not defined : ${jwtResetPasswordKey}`);
                return;
            }
            const userData= authHelper.extractJWTData<resetPassword>(req, resetPasswordToken, jwtResetPasswordKey);

            if(typeof userData === "string"){ // when no userData is string (so it's not object that contains users data ) we stop the function 
                console.log(userData);
                sendResponse(res, 500, userData);   
                return;
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
                sendResponse(res, 500, 'Error Occured. Try resetting your password again');
                return;
            }

            // remove the token from the cookie
            authHelper.removeCookieToken( res, resetPasswordToken);

            sendResponse(res, 200, 'Password was resetted successfully');
            return;

            //=========================================================================
        }catch(error){
            sendResponse(res, 500, `Error occured while resetting the password. ${error}`);
            return;

        }
    }

    //====================================================================================================
    //? send Validation Email for new user (in order to set his password) 
    //=========================================================================================
    async sendValidateEmail(res: Response, email: string, ){
        try{
            //create token WITHOUT storing in cookie (only in URL)----------------------------------------------------------------------------------
            let setPasswordTokenCreation: string;
            try{
                //check if JWT exists in .env file
                const jwtSetPasswordKey = process.env.JWT_SET_PASSWORD_KEY;
                if (!jwtSetPasswordKey) {
                    sendResponse(res, 500, `JWT_SET_PASSWORD_KEY is not defined : ${jwtSetPasswordKey}`);
                    return;
                 }   
                setPasswordTokenCreation = authHelper.createJWTtoken( res, setPasswordToken, jwtSetPasswordKey
                , {email: email}, 1200000, false);// 1,200,000 millisecond = 20 minutes
                
                
            }catch(error){
                console.log('Error occured while creating token:', error);
                return;
            }

            // ==============================================================================================================================
            const mailSubject: string = "Set your Password";
            // ---------------------------------------------------------------------
            const setLink = `http://localhost:3000/set-password?token=${setPasswordTokenCreation}`; 
            const htmlContent = `
            <p>Hello,</p>

            <p>Your account was created in NEU Bus Tracker platform.</p>

            <p>To finish setting up your account, please set up your password from the link below:</p>

            <a href="${setLink}"
                style="display: inline-block;
                background-color:blue;
                color:white;
                text-decoration:none;
                border-radious: 4px;
                cursor: pointer;
                padding: 12px 24px;">Set Password</a>
            <br><br>

            
            <br><br>
            <p>Thank you,</p>
            <p>NEU Bus Tracker Team</p>
            
            <br><br>
            <p>Please note that this Reset Link will expire in 10 minutes</p>`;

            
            const sendEmailSResponse = await sendEmail(email, mailSubject, htmlContent);
            console.log('this is sendEmailSResponse from sendValidation Email function authServices --------', sendEmailSResponse);
           

        //=========================================================================================
        }catch(error){
            console.log('Error occured while sending validation email. ', error);
        }
    }
    
    //===================================================================================================================================
    //? set password 
    //===================================================================================================================================
    async setPassword(req: Request, res: Response): Promise<string | void>{
        try{ 
            // Extract token from URL parameters (/set-password/:token) -----------------

            const token = String(req.params.token || req.query.token);
            
            if(!token){
                sendResponse(res, 400, "Error occured, No token were found");
                return  "Error occured, No token were found";
            }

            // get the passwords from the user input ------------------------------------------
            const body: NewPassword = req.body;

            const{
                newPassword,
                confirmPassword
            }= body;

            console.log("=============");
            console.log(token);
            if(!newPassword || !confirmPassword){
                sendResponse(res, 500, "Please provide a password to proceed with the Password Setting operation");
                return "Please provide a password to proceed with the Password Setting operation";
            }

            //ensure the user entered identical passwords
            if(newPassword !== confirmPassword){
                sendResponse(res, 500, "Make sure both passwords are identical");
                return "Make sure both passwords are identical";
            }

            // check if user is authorized to commit this action (user has valid setPasswordToken )-----------

            // extract email from the token ---------------------------------------

    
            //check if JWT exists in .env file
            const jwtSetPasswordKey = process.env.JWT_SET_PASSWORD_KEY;
            if (!jwtSetPasswordKey) {
                sendResponse(res, 500, `JWT_SET_PASSWORD_KEY is not defined : ${jwtSetPasswordKey}`);
            return;
            }

            const userData = jwt.verify(token, jwtSetPasswordKey) ;
            if(!userData || typeof userData !== "object"){
                sendResponse(res, 500, "Invalid JWT token");
                return "Invalid JWT token";
            }

            // Validate token has email field (setPasswordToken should have email, not userID/userRole)
            if(!userData.email){
                sendResponse(res, 500, "Invalid token format");
                return "Invalid token format";
            }
        
            // set password in the db ----------------------------------------------------------------------------------------

            const hashedPassword: string = await bcrypt.hash(newPassword, 8);

            const [updatedPassword] = await UserModel.update({ // updatedPassword return the number of rows that has been changed
                hashedPassword: hashedPassword
            },{
                where:{
                    email: userData.email
                }
            });

            if(updatedPassword === 0){
                sendResponse(res, 500, 'Error Occured. Try setting your password again');
                return 'Error Occured. Try setting your password again';
            }

    
            // Clear any existing login session on this browser (e.g., if an admin session was open)
            authHelper.removeCookieToken(res, loginToken);

            sendResponse(res, 200, 'Password was stored successfully');
            return;

        //======================================================================================================
        }catch(error){
            sendResponse(res, 500, `Error occurred while setting password. ${error}`);
            return;
        }
    }
}
//=================================================================================================================================================

export default AuthService;
