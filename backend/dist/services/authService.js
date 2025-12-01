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
//==========================================================================================================
class AuthService {
    //==========================================================================================================
    //? Get Current User 
    //==========================================================================================================
    async getCurrentUser(req, res) {
        try {
            // Use the secure extractJWTData function to get user data
            const userData = authHelper.extractJWTData(req, tokenNameEnum_1.tokenNames.loginToken);
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
            //====================================================================================================================================================
            // check if user registed in the system
            const userExists = await userModel_1.default.findOne({
                where: {
                    email: email
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
                    authHelper.createJWTtoken(res, "loginToken", { userID: userExists.id, userRole: userExists.role, userName: userExists.name
                    }, 3600000); // 3,600,000 millisecond = 60 minutes
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
            const userData = authHelper.extractJWTData(req, tokenNameEnum_1.tokenNames.loginToken);
            if (typeof userData === "string") { // when userData is string (so it's not object that contains users data ). then, we  return the error message and stop the function 
                (0, messageTemplate_1.sendResponse)(res, 500, userData); // userData here is Error message , check authHelper.ts file
                return;
            }
            // get the user name from the token
            const name = userData.userName; //"fix the auth func "
            authHelper.removeCookieToken(res, tokenNameEnum_1.tokenNames.loginToken);
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
    async sendPasswordResetEmail(req, res) {
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
            try {
                authHelper.createJWTtoken(res, tokenNameEnum_1.tokenNames.resetPasswordToken, { email: email }, 600000); // 600,000 millisecond = 10 minutes
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
            const resetLink = "http://localhost:3000/reset-password";
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
    //? =================================================================================================================================
    //? Function to reset the password
    // =================================================================================================================================
    async resetPassword(req, res) {
        try {
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
            // extract email from the token ---------------------------------------
            const userData = authHelper.extractJWTData(req, tokenNameEnum_1.tokenNames.resetPasswordToken);
            if (typeof userData === "string") { // when no userData is string (so it's not object that contains users data ) we stop the function 
                console.log(userData);
                (0, messageTemplate_1.sendResponse)(res, 500, userData);
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
                return;
            }
            // remove the token from the cookie
            authHelper.removeCookieToken(res, tokenNameEnum_1.tokenNames.resetPasswordToken);
            (0, messageTemplate_1.sendResponse)(res, 200, 'Password was resetted successfully');
            return;
            //=========================================================================
        }
        catch (error) {
            (0, messageTemplate_1.sendResponse)(res, 500, `Error occured while resetting the password. ${error}`);
            return;
        }
    }
}
//=================================================================================================================================================
exports.default = AuthService;
//# sourceMappingURL=authService.js.map