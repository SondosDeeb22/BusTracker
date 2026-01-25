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
                console.error('JWT_LOGIN_KEY is not defined');
                (0, messageTemplate_1.sendResponse)(res, 500, 'common.errors.internal');
                return;
            }
            const userData = authHelper.extractJWTData(req, tokenNameEnum_1.loginToken, jwtLoginKey);
            if (typeof userData === "string") {
                (0, messageTemplate_1.sendResponse)(res, 401, userData);
                return;
            }
            (0, messageTemplate_1.sendResponse)(res, 200, 'auth.currentUser.success', userData);
            return;
        }
        catch (error) {
            console.error('Error retrieving user data.', error);
            (0, messageTemplate_1.sendResponse)(res, 500, 'common.errors.internal');
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
                (0, messageTemplate_1.sendResponse)(res, 500, 'common.validation.fillAllFields');
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
                (0, messageTemplate_1.sendResponse)(res, 500, 'auth.login.userNotFound');
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
                        console.error('JWT_LOGIN_KEY is not defined');
                        (0, messageTemplate_1.sendResponse)(res, 500, 'common.errors.internal');
                        return;
                    }
                    authHelper.createJWTtoken(res, tokenNameEnum_1.loginToken, jwtLoginKey, { userID: userExists.id, userRole: userExists.role, userName: userExists.name
                    }, 3600000, true); // 3,600,000 millisecond = 60 minutes
                }
                catch (error) {
                    console.error('Error occured while creating JWT token.', error);
                    (0, messageTemplate_1.sendResponse)(res, 500, 'common.errors.internal');
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
            console.error('Error Found while Logging in.', error);
            (0, messageTemplate_1.sendResponse)(res, 500, 'common.errors.internal');
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
                console.error('JWT_LOGIN_KEY is not defined');
                (0, messageTemplate_1.sendResponse)(res, 500, 'common.errors.internal');
                return;
            }
            const userData = authHelper.extractJWTData(req, tokenNameEnum_1.loginToken, jwtLoginKey);
            if (typeof userData === "string") { // when userData is string (so it's not object that contains users data ). then, we  return the error message and stop the function 
                (0, messageTemplate_1.sendResponse)(res, 500, userData); // userData here is Error message , check authHelper.ts file
                return;
            }
            authHelper.removeCookieToken(res, tokenNameEnum_1.loginToken);
            (0, messageTemplate_1.sendResponse)(res, 200, 'auth.logout.success');
            return;
            // ===============================================================================================================================
        }
        catch (error) {
            console.error('Error during logout.', error);
            (0, messageTemplate_1.sendResponse)(res, 500, 'common.errors.internal');
            return;
        }
    }
    //? =================================================================================================================================
    //? Function that Send emails to Reset password
    // =================================================================================================================================
    async sendEmailToResetPassword(req, res, targetRole) {
        try {
            const body = req.body;
            const { email, } = body;
            if (!email) {
                (0, messageTemplate_1.sendResponse)(res, 500, 'auth.passwordReset.validation.emailRequired');
                return;
            }
            // ensure the user is registred in out DB -------------------------------------------------------------------------------
            const uesrExists = await userModel_1.default.findOne({
                where: {
                    email: email,
                },
                attributes: ['email', 'role']
            });
            if (!uesrExists) {
                (0, messageTemplate_1.sendResponse)(res, 500, 'auth.passwordReset.errors.emailNotRegistered');
                return;
            }
            const userRole = uesrExists.role;
            // if the user not allowed to perform this stop the opeartion (e.x: driver trying to reset his passwrod from the admin portal , visa vers )
            if (userRole !== targetRole) {
                (0, messageTemplate_1.sendResponse)(res, 403, 'auth.passwordReset.errors.notTargetedRole');
                return;
            }
            //create token and store it in cookie----------------------------------------------------------------------------------
            let resetPasswordTokenCreation;
            try {
                const jwtResetPasswordKey = process.env.JWT_RESET_PASSWORD_KEY?.trim();
                if (!jwtResetPasswordKey) {
                    console.error('JWT_RESET_PASSWORD_KEY is not defined');
                    (0, messageTemplate_1.sendResponse)(res, 500, 'common.errors.internal');
                    return;
                }
                resetPasswordTokenCreation = authHelper.createJWTtoken(res, tokenNameEnum_1.resetPasswordToken, jwtResetPasswordKey, { email: email }, 1200000, false); // 1,200,000 millisecond = 20 minutes
            }
            catch (error) {
                console.error('Error occured while creating reset password token.', error);
                (0, messageTemplate_1.sendResponse)(res, 500, 'auth.common.errors.internal');
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
            void sendEmailSResponse;
            (0, messageTemplate_1.sendResponse)(res, 200, 'auth.passwordReset.success.emailSent');
            return;
            //======================================================================================================
        }
        catch (error) {
            console.error('Error occured while sending password reset email.', error);
            (0, messageTemplate_1.sendResponse)(res, 500, 'common.errors.internal');
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
                (0, messageTemplate_1.sendResponse)(res, 401, 'auth.token.missing');
                return null;
            }
            // check that token has the email address
            const userData = jsonwebtoken_1.default.verify(token, secretKey);
            if (!userData || typeof userData !== "object" || !userData.email) {
                (0, messageTemplate_1.sendResponse)(res, 401, 'common.auth.invalidToken');
                return null;
            }
            return userData;
        }
        catch (error) {
            console.error('Error occured while verifying token.', error);
            (0, messageTemplate_1.sendResponse)(res, 401, 'common.auth.invalidToken');
            return null;
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
                console.error('JWT_RESET_PASSWORD_KEY is not defined');
                (0, messageTemplate_1.sendResponse)(res, 500, 'common.errors.internal');
                return;
            }
            // ensure token was provided 
            const userData = await this.verifyToken(req, res, jwtResetPasswordKey);
            if (!userData) {
                return;
            }
            // get the passwords from the user input ------------------------------------------
            const body = req.body;
            const { newPassword, confirmPassword } = body;
            if (!newPassword || !confirmPassword) {
                (0, messageTemplate_1.sendResponse)(res, 500, 'auth.passwordReset.validation.passwordRequired');
                return;
            }
            //ensure the user entered identical passwords
            if (newPassword !== confirmPassword) {
                (0, messageTemplate_1.sendResponse)(res, 500, 'auth.passwordReset.validation.passwordsMustMatch');
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
                (0, messageTemplate_1.sendResponse)(res, 500, 'auth.passwordReset.errors.notUpdated');
                return;
            }
            (0, messageTemplate_1.sendResponse)(res, 200, 'auth.passwordReset.success.updated');
            return;
            //=========================================================================
        }
        catch (error) {
            console.error('Error occured while resetting the password.', error);
            (0, messageTemplate_1.sendResponse)(res, 500, 'common.errors.internal');
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
            <p>Please note that this link will expire in 20 minutes</p>`;
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
                console.error('JWT_SET_PASSWORD_KEY is not defined');
                (0, messageTemplate_1.sendResponse)(res, 500, 'common.errors.internal');
                return;
            }
            // ensure token was provided 
            const userData = await this.verifyToken(req, res, jwtSetPasswordKey);
            if (!userData) {
                return;
            }
            // get the passwords from the user input ------------------------------------------
            const body = req.body;
            const { newPassword, confirmPassword } = body;
            if (!newPassword || !confirmPassword) {
                (0, messageTemplate_1.sendResponse)(res, 500, 'auth.setPassword.validation.passwordRequired');
                return;
            }
            //ensure the user entered identical passwords
            if (newPassword !== confirmPassword) {
                (0, messageTemplate_1.sendResponse)(res, 500, 'auth.setPassword.validation.passwordsMustMatch');
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
                (0, messageTemplate_1.sendResponse)(res, 500, 'auth.setPassword.errors.notUpdated');
                return;
            }
            // Clear any existing login session on this browser 
            authHelper.removeCookieToken(res, tokenNameEnum_1.loginToken);
            (0, messageTemplate_1.sendResponse)(res, 200, 'auth.setPassword.success.updated');
            return;
            //======================================================================================================
        }
        catch (error) {
            console.error('Error occurred while setting password.', error);
            (0, messageTemplate_1.sendResponse)(res, 500, 'common.errors.internal');
            return;
        }
    }
}
//=================================================================================================================================================
exports.default = AuthService;
//# sourceMappingURL=authService.js.map