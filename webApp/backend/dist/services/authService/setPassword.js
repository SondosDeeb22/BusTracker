"use strict";
//==========================================================================================================
//? Import
//==========================================================================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPassword = exports.sendValidateEmail = exports.verifySetPasswordToken = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
// import Models ------------------------------------------------------------------------
const userModel_1 = __importDefault(require("../../models/userModel"));
// import helpers --------------------------------------------------------------------
const authHelpher_1 = __importDefault(require("../../helpers/authHelpher"));
const authHelper = new authHelpher_1.default();
const sendEmail_1 = require("../../helpers/sendEmail");
//==========================================================================================================
// =================================================================================================================================
//? Function to verify set password token (for frontend HEAD checks)
// =================================================================================================================================
const verifySetPasswordToken = async (req) => {
    try {
        const userData = authHelper.verifySetPasswordUrlTokenFromRequest(req);
        if (!userData || typeof userData !== "object" || !userData.email) {
            return null;
        }
        return userData;
    }
    catch (error) {
        console.error("Error occured while verifying token.", error);
        return null;
    }
};
exports.verifySetPasswordToken = verifySetPasswordToken;
//====================================================================================================
//? send Validation Email for new user (in order to set his password)
//=========================================================================================
const sendValidateEmail = async (email) => {
    const setPasswordTokenCreation = authHelper.createSetPasswordUrlToken(email);
    const mailSubject = "Set your Password";
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
    await (0, sendEmail_1.sendEmail)(email, mailSubject, htmlContent);
    return { status: 200, messageKey: "common.crud.sent" };
};
exports.sendValidateEmail = sendValidateEmail;
//===================================================================================================================================
//? set password 
//===================================================================================================================================
const setPassword = async (req, res) => {
    try {
        // ensure token was provided
        const userData = await (0, exports.verifySetPasswordToken)(req);
        if (!userData) {
            return { status: 401, messageKey: "common.auth.invalidToken" };
        }
        // get the passwords from the user input ------------------------------------------
        const body = req.body;
        const { newPassword, confirmPassword, } = body;
        if (!newPassword || !confirmPassword) {
            return { status: 500, messageKey: "auth.setPassword.validation.passwordRequired" };
        }
        //ensure the user entered identical passwords
        if (newPassword !== confirmPassword) {
            return { status: 500, messageKey: "auth.setPassword.validation.passwordsMustMatch" };
        }
        // update the password in the database ----------------------------------------------------------
        const hashedPassword = await bcrypt_1.default.hash(newPassword, 8);
        const [updatedPassword] = await userModel_1.default.update({
            hashedPassword: hashedPassword,
        }, {
            where: {
                email: userData.email,
            },
        });
        if (updatedPassword === 0) {
            return { status: 500, messageKey: "auth.setPassword.errors.notUpdated" };
        }
        // Clear any existing login session on this browser
        authHelper.clearLoginSession(res);
        return { status: 200, messageKey: "auth.setPassword.success.updated" };
    }
    catch (error) {
        console.error("Error occurred while setting password.", error);
        return { status: 500, messageKey: "common.errors.internal" };
    }
};
exports.setPassword = setPassword;
//# sourceMappingURL=setPassword.js.map