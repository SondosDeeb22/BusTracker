"use strict";
//==========================================================================================================
//? Import
//==========================================================================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.verifyResetPasswordToken = exports.sendEmailToResetPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
// import Models ------------------------------------------------------------------------
const userModel_1 = __importDefault(require("../../models/userModel"));
// import helpers --------------------------------------------------------------------
const authHelpher_1 = __importDefault(require("../../helpers/authHelpher"));
const authHelper = new authHelpher_1.default();
const urlTokens_1 = require("../../helpers/authHelper/urlTokens");
const sendEmail_1 = require("../../helpers/sendEmail");
//==========================================================================================================
const sendEmailToResetPassword = async (req, res, targetRole) => {
    try {
        const body = req.body;
        const { email, } = body;
        if (!email) {
            return { status: 500, messageKey: "auth.passwordReset.validation.emailRequired" };
        }
        // ensure the user is registred in out DB -------------------------------------------------------------------------------
        const uesrExists = await userModel_1.default.findOne({
            where: {
                email: email,
            },
            attributes: ["email", "role", "passwordResetVersion"],
        });
        if (!uesrExists) {
            return { status: 500, messageKey: "auth.passwordReset.errors.emailNotRegistered" };
        }
        const userRole = uesrExists.role;
        // if the user not allowed to perform this stop the opeartion (e.x: driver trying to reset his passwrod from the admin portal , visa vers )
        if (userRole !== targetRole) {
            return { status: 403, messageKey: "auth.passwordReset.errors.notTargetedRole" };
        }
        //create token and store it in cookie----------------------------------------------------------------------------------
        let resetPasswordTokenCreation;
        try {
            resetPasswordTokenCreation = (0, urlTokens_1.createResetPasswordUrlTokenWithVersion)(email, typeof uesrExists.passwordResetVersion === "number" ? uesrExists.passwordResetVersion : 0);
        }
        catch (error) {
            console.error("Error occured while creating reset password token.", error);
            return { status: 500, messageKey: "auth.common.errors.internal" };
        }
        // ==============================================================================================================================
        const mailSubject = "Password Reset";
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
        await (0, sendEmail_1.sendEmail)(email, mailSubject, htmlContent);
        return { status: 200, messageKey: "auth.passwordReset.success.emailSent" };
    }
    catch (error) {
        console.error("Error occured while sending password reset email.", error);
        return { status: 500, messageKey: "common.errors.internal" };
    }
};
exports.sendEmailToResetPassword = sendEmailToResetPassword;
// =================================================================================================================================
//? Function to verify reset password token (for frontend HEAD checks)
// =================================================================================================================================
const verifyResetPasswordToken = async (req) => {
    try {
        const userData = authHelper.verifyResetPasswordUrlTokenFromRequest(req);
        if (!userData || typeof userData !== "object" || !userData.email) {
            return null;
        }
        const user = await userModel_1.default.findOne({
            where: { email: userData.email },
            attributes: ["email", "passwordResetVersion"],
        });
        if (!user) {
            return null;
        }
        const expectedVersion = typeof user.passwordResetVersion === "number" ? user.passwordResetVersion : 0;
        const tokenVersion = typeof userData.v === "number" ? userData.v : 0;
        if (tokenVersion !== expectedVersion) {
            return null;
        }
        return userData;
    }
    catch (error) {
        console.error("Error occured while verifying token.", error);
        return null;
    }
};
exports.verifyResetPasswordToken = verifyResetPasswordToken;
//? =================================================================================================================================
//? Function to reset the password
// =================================================================================================================================
const resetPassword = async (req, res) => {
    try {
        // ensure token was provided
        const userData = await (0, exports.verifyResetPasswordToken)(req);
        if (!userData) {
            return { status: 401, messageKey: "common.auth.invalidToken" };
        }
        // get the passwords from the user input ------------------------------------------
        const body = req.body;
        const { newPassword, confirmPassword, } = body;
        if (!newPassword || !confirmPassword) {
            return { status: 500, messageKey: "auth.passwordReset.validation.passwordRequired" };
        }
        //ensure the user entered identical passwords
        if (newPassword !== confirmPassword) {
            return { status: 500, messageKey: "auth.passwordReset.validation.passwordsMustMatch" };
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
            return { status: 500, messageKey: "auth.passwordReset.errors.notUpdated" };
        }
        await userModel_1.default.increment({ passwordResetVersion: 1 }, { where: { email: userData.email } });
        return { status: 200, messageKey: "auth.passwordReset.success.updated" };
        //=========================================================================
    }
    catch (error) {
        console.error("Error occured while resetting the password.", error);
        return { status: 500, messageKey: "common.errors.internal" };
    }
};
exports.resetPassword = resetPassword;
//# sourceMappingURL=passwordReset.js.map