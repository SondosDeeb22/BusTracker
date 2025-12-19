"use strict";
//==========================================================================================================
//? Import Sections
//==========================================================================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
//import Enums ------------------------------------------------------------------------------
const tokenNameEnum_1 = require("../enums/tokenNameEnum");
//importing libraries
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import Models ------------------------------------------------------------------------
const userModel_1 = __importDefault(require("../models/userModel"));
// import exceptions --------------------------------------------------------------------
const messageTemplate_1 = require("../exceptions/messageTemplate");
// import helpers --------------------------------------------------------------------
const authHelpher_1 = __importDefault(require("../helpers/authHelpher"));
const authHelper = new authHelpher_1.default();
const sendEmail_1 = require("../helpers/sendEmail");
//==========================================================================================================
//? Function we have in this class
// - store loginAttempt
// - login
// - logout
// - send email to reset user password
// - reset user password
//- set password (for freash user , e.x: drivers created by admin)
//==========================================================================================================
class AuthService {
    //==========================================================================================================
    //? Get Current User 
    //==========================================================================================================
    async getCurrentUser(req, res) {
        try {
            //check if JWT exists in .env file
            const jwtLoginKey = process.env.JWT_LOGIN_KEY;
            if (!jwtLoginKey) {
                (0, messageTemplate_1.sendResponse)(res, 500, `JWT_LOGIN_KEY is not defined : ${jwtLoginKey}`);
                return;
            }
            const userData = authHelper.extractJWTData(req, tokenNameEnum_1.loginToken, jwtLoginKey);
            if (typeof userData === "string") {
                (0, messageTemplate_1.sendResponse)(res, 401, userData);
                return;
            }
            (0, messageTemplate_1.sendResponse)(res, 200, "User data retrieved successfully", userData);
            return;
        }
        catch (error) {
            (0, messageTemplate_1.sendResponse)(res, 500, `Error retrieving user data. ${error}`);
            return;
        }
    }
    //==========================================================================================================
    //? Login 
    //==========================================================================================================
    async login(req, res) {
        try {
            // the provided login data
            const body = req.body;
            const { email, password } = body;
            //check if the user provided all the needed data
            if (!email || !password) {
                (0, messageTemplate_1.sendResponse)(res, 500, "Fill all Fields please");
                return;
            }
            const userEmail = email.trim();
            //====================================================================================================================================================
            // check if user registed in the system
            const userExists = await userModel_1.default.findOne({
                where: {
                    email: userEmail
                }
            });
            if (!userExists) {
                (0, messageTemplate_1.sendResponse)(res, 500, "No user found with the provided data");
                return;
            }
            //=================================================================================================================================================
            // validate the provided password 
            const validPassword = await bcrypt_1.default.compare(password, userExists.hashedPassword);
            let attemptSuccessful;
            let resultMessage;
            let status;
            if (validPassword) {
                //---------------------------------------------------------------------------------------------------------------------------------------------
                // Create JWT 
                try {
                    //check if JWT exists in .env file
                    const jwtLoginKey = process.env.JWT_LOGIN_KEY;
                    if (!jwtLoginKey) {
                        (0, messageTemplate_1.sendResponse)(res, 500, `JWT_LOGIN_KEY is not defined : ${jwtLoginKey}`);
                        return;
                    }
                    authHelper.createJWTtoken(res, tokenNameEnum_1.loginToken, jwtLoginKey, { userID: userExists.id, userRole: userExists.role, userName: userExists.name
                    }, 3600000, true); // 3,600,000 millisecond = 60 minutes
                }
                catch (error) {
                    (0, messageTemplate_1.sendResponse)(res, 500, error.message);
                    return;
                }
                attemptSuccessful = true;
                resultMessage = `${userExists.name} logged in`;
                status = 200;
            }
            //=================================================================================================================================================
            else {
                attemptSuccessful = false;
                resultMessage = "password is wrong, please try again";
                status = 401;
            }
            authHelper.loginAttempt(req, res, attemptSuccessful, email, status, resultMessage);
            return;
        }
        catch (error) {
            (0, messageTemplate_1.sendResponse)(res, 500, `Error Found while Logging in. ${error}`);
            return;
        }
    }
    //? =================================================================================================================================
    //? Logout function
    // =================================================================================================================================
    async logout(req, res) {
        try {
            //check if JWT exists in .env file
            const jwtLoginKey = process.env.JWT_LOGIN_KEY;
            if (!jwtLoginKey) {
                (0, messageTemplate_1.sendResponse)(res, 500, `JWT_LOGIN_KEY is not defined : ${jwtLoginKey}`);
                return;
            }
            const userData = authHelper.extractJWTData(req, tokenNameEnum_1.loginToken, jwtLoginKey);
            if (typeof userData === "string") { // when userData is string (so it's not object that contains users data ). then, we  return the error message and stop the function 
                (0, messageTemplate_1.sendResponse)(res, 500, userData); // userData here is Error message , check authHelper.ts file
                return;
            }
            // get the user name from the token
            const name = userData.userName; //"fix the auth func "
            authHelper.removeCookieToken(res, tokenNameEnum_1.loginToken);
            (0, messageTemplate_1.sendResponse)(res, 200, `${name} logged out`);
            return;
            // ===============================================================================================================================
        }
        catch (error) {
            (0, messageTemplate_1.sendResponse)(res, 500, `Error during logout. ${error}`);
            return;
        }
    }
    //? =================================================================================================================================
    //? Function that Send emails to Reset password
    // =================================================================================================================================
    async sendEmailToResetPassword(req, res) {
        try {
            const body = req.body;
            const { email } = body;
            if (!email) {
                (0, messageTemplate_1.sendResponse)(res, 500, 'Enter Email address to proceed in Reset password operation');
                return;
            }
            // ensure the user is registred in out DB -------------------------------------------------------------------------------
            const uesrExists = await userModel_1.default.findOne({
                where: {
                    email: email
                }
            });
            if (!uesrExists) {
                (0, messageTemplate_1.sendResponse)(res, 500, "This email is not registered in our system. Please use the email associated with your account");
                return;
            }
            //create token and store it in cookie----------------------------------------------------------------------------------
            let resetPasswordTokenCreation;
            try {
                //check if JWT exists in .env file
                const jwtResetPasswordKey = process.env.JWT_RESET_PASSWORD_KEY;
                if (!jwtResetPasswordKey) {
                    (0, messageTemplate_1.sendResponse)(res, 500, `JWT_RESET_PASSWORD_KEY is not defined : ${jwtResetPasswordKey}`);
                    return;
                }
                resetPasswordTokenCreation = authHelper.createJWTtoken(res, tokenNameEnum_1.resetPasswordToken, jwtResetPasswordKey, { email: email }, 1200000, false); // 1,200,000 millisecond = 20 minutes
            }
            catch (error) {
                (0, messageTemplate_1.sendResponse)(res, 500, error.message);
                return;
            }
            // ==============================================================================================================================
            const mailSubject = "Password Reset";
            // const mailText: string = `A request has been received to reset the password for your account in Health App.
            // If you would like to proceed in this operation, please click on the button below 
            // Please note that this Reset Link will expire in 10 minutes`;
            // ---------------------------------------------------------------------
            const resetLink = `http://localhost:3000/reset-password?token=${resetPasswordTokenCreation}`;
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
            const sendEmailSResponse = await (0, sendEmail_1.sendEmail)(email, mailSubject, htmlContent);
            (0, messageTemplate_1.sendResponse)(res, 200, sendEmailSResponse);
            return;
            //======================================================================================================
        }
        catch (error) {
            (0, messageTemplate_1.sendResponse)(res, 500, `Error occured while sending password reset email. ${error}`);
            return;
        }
    }
    // =================================================================================================================================
    //? Function to verify token (for frontend HEAD checks)
    // =================================================================================================================================
    async verifyToken(req, res, secretKey) {
        try {
            //get token from url 
            const token = String(req.params.token || req.query.token);
            if (!token) {
                res.sendStatus(401);
                return "Error occured, token was not found";
            }
            // check that token has the email address
            const userData = jsonwebtoken_1.default.verify(token, secretKey);
            if (!userData || typeof userData !== "object" || !userData.email) {
                res.sendStatus(401);
                return "Invalid JWT token";
            }
            // send the userdata (email as respond)
            res.sendStatus(200);
            return userData;
        }
        catch (error) {
            res.sendStatus(401);
            return;
        }
    }
    //? =================================================================================================================================
    //? Function to reset the password
    // =================================================================================================================================
    async resetPassword(req, res) {
        try {
            // ensure that JWT_RESET_PASSWORD_KEY exists in .env
            const jwtResetPasswordKey = process.env.JWT_RESET_PASSWORD_KEY;
            if (!jwtResetPasswordKey) {
                res.sendStatus(500);
                return "jwt key is not defined";
            }
            // ensure token was provided 
            const userData = await this.verifyToken(req, res, jwtResetPasswordKey);
            if (!userData || typeof userData === "string") {
                (0, messageTemplate_1.sendResponse)(res, 401, "Error occurred while verifying reset-password-token");
                return;
            }
            // get the passwords from the user input ------------------------------------------
            const body = req.body;
            const { newPassword, confirmPassword } = body;
            if (!newPassword || !confirmPassword) {
                (0, messageTemplate_1.sendResponse)(res, 500, "Please provide a password to proceed with the Password Reset operation");
                return;
            }
            //ensure the user entered identical passwords
            if (newPassword !== confirmPassword) {
                (0, messageTemplate_1.sendResponse)(res, 500, "Make sure both passwords are identical");
                return;
            }
            // update the password in the database ----------------------------------------------------------
            const hashedPassword = await bcrypt_1.default.hash(newPassword, 8);
            const [updatedPassword] = await userModel_1.default.update({
                hashedPassword: hashedPassword
            }, {
                where: {
                    email: userData.email
                }
            });
            if (updatedPassword === 0) {
                (0, messageTemplate_1.sendResponse)(res, 500, 'Error Occured. Try resetting your password again');
                return 'Error Occured. Try resetting your password again';
            }
            (0, messageTemplate_1.sendResponse)(res, 200, 'Password was resetted successfully');
            return;
            //=========================================================================
        }
        catch (error) {
            (0, messageTemplate_1.sendResponse)(res, 500, `Error occured while resetting the password. ${error}`);
            return;
        }
    }
    //====================================================================================================
    //? send Validation Email for new user (in order to set his password) 
    //=========================================================================================
    async sendValidateEmail(res, email) {
        try {
            //create token WITHOUT storing in cookie (only in URL)----------------------------------------------------------------------------------
            let setPasswordTokenCreation;
            try {
                //check if JWT exists in .env file
                const jwtSetPasswordKey = process.env.JWT_SET_PASSWORD_KEY;
                if (!jwtSetPasswordKey) {
                    (0, messageTemplate_1.sendResponse)(res, 500, `JWT_SET_PASSWORD_KEY is not defined : ${jwtSetPasswordKey}`);
                    return;
                }
                setPasswordTokenCreation = authHelper.createJWTtoken(res, tokenNameEnum_1.setPasswordToken, jwtSetPasswordKey, { email: email }, 1200000, false); // 1,200,000 millisecond = 20 minutes
            }
            catch (error) {
                console.log('Error occured while creating token:', error);
                return;
            }
            // ==============================================================================================================================
            const mailSubject = "Set your Password";
            // ---------------------------------------------------------------------
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
            <p>Please note that this Reset Link will expire in 10 minutes</p>`;
            const sendEmailSResponse = await (0, sendEmail_1.sendEmail)(email, mailSubject, htmlContent);
            console.log('this is sendEmailSResponse from sendValidation Email function authServices --------', sendEmailSResponse);
            //=========================================================================================
        }
        catch (error) {
            console.log('Error occured while sending validation email. ', error);
        }
    }
    //===================================================================================================================================
    //? set password 
    //===================================================================================================================================
    async setPassword(req, res) {
        try {
            // ensure that JWT_RESET_PASSWORD_KEY exists in .env
            const jwtSetPasswordKey = process.env.JWT_SET_PASSWORD_KEY;
            if (!jwtSetPasswordKey) {
                res.sendStatus(500);
                return "jwt key is not defined";
            }
            // ensure token was provided 
            const userData = await this.verifyToken(req, res, jwtSetPasswordKey);
            if (!userData || typeof userData === "string") {
                (0, messageTemplate_1.sendResponse)(res, 401, "Error occurred while verifying reset-password-token");
                return;
            }
            // get the passwords from the user input ------------------------------------------
            const body = req.body;
            const { newPassword, confirmPassword } = body;
            if (!newPassword || !confirmPassword) {
                (0, messageTemplate_1.sendResponse)(res, 500, "Please provide a password to proceed with the Password Setting operation");
                return "Please provide a password to proceed with the Password Setting operation";
            }
            //ensure the user entered identical passwords
            if (newPassword !== confirmPassword) {
                (0, messageTemplate_1.sendResponse)(res, 500, "Make sure both passwords are identical");
                return "Make sure both passwords are identical";
            }
            // update the password in the database ----------------------------------------------------------
            const hashedPassword = await bcrypt_1.default.hash(newPassword, 8);
            const [updatedPassword] = await userModel_1.default.update({
                hashedPassword: hashedPassword
            }, {
                where: {
                    email: userData.email
                }
            });
            if (updatedPassword === 0) {
                (0, messageTemplate_1.sendResponse)(res, 500, 'Error Occured. Try setting your password again');
                return 'Error Occured. Try setting your password again';
            }
            // Clear any existing login session on this browser 
            authHelper.removeCookieToken(res, tokenNameEnum_1.loginToken);
            (0, messageTemplate_1.sendResponse)(res, 200, 'Password was stored successfully');
            return;
            //======================================================================================================
        }
        catch (error) {
            (0, messageTemplate_1.sendResponse)(res, 500, `Error occurred while setting password. ${error}`);
            return;
        }
    }
}
//=================================================================================================================================================
exports.default = AuthService;
//# sourceMappingURL=authService.js.map