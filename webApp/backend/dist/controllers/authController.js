"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
//============================================================================================================================================================
//?importing 
//============================================================================================================================================================
const authService_1 = __importDefault(require("../services/authService"));
const messageTemplate_1 = require("../exceptions/messageTemplate");
const userEnum_1 = require("../enums/userEnum");
const authService = new authService_1.default();
//============================================================================================================================================================
class AuthController {
    //=================================================================================================================================
    // Login function
    async login(req, res) {
        const result = await authService.login(req, res);
        (0, messageTemplate_1.sendResponse)(res, result.status, result.messageKey, result.data);
        return;
    }
    //=================================================================================================================================
    // Get current user data
    async getCurrentUser(req, res) {
        const result = await authService.getCurrentUser(req, res);
        (0, messageTemplate_1.sendResponse)(res, result.status, result.messageKey, result.data);
        return;
    }
    //=================================================================================================================================
    // Logout function
    async logout(req, res) {
        const result = await authService.logout(req, res);
        (0, messageTemplate_1.sendResponse)(res, result.status, result.messageKey, result.data);
        return;
    }
    // =================================================================================================================================
    //? 1. Reset Password (Forgot password page)
    // 1.1. function send email for user for password resetting
    async sendEmailToResetAdminPassword(req, res) {
        const result = await authService.sendEmailToResetPassword(req, res, userEnum_1.role.admin);
        (0, messageTemplate_1.sendResponse)(res, result.status, result.messageKey, result.data);
        return;
    }
    //==================================================================================================================================
    // 1.2. function send email for user for password resetting
    async sendEmailToResetDriverPassword(req, res) {
        const result = await authService.sendEmailToResetPassword(req, res, userEnum_1.role.driver);
        (0, messageTemplate_1.sendResponse)(res, result.status, result.messageKey, result.data);
        return;
    }
    //==================================================================================================================================
    // 1.3. verify reset password token (HEAD)
    async verifyResetPasswordToken(req, res) {
        // ensure that JWT_RESET_PASSWORD_KEY exists in .env
        const jwtResetPasswordKey = process.env.JWT_RESET_PASSWORD_KEY?.trim();
        if (!jwtResetPasswordKey) {
            console.error('JWT_RESET_PASSWORD_KEY is not defined');
            (0, messageTemplate_1.sendResponse)(res, 500, 'common.errors.internal');
            return null;
        }
        const userData = await authService.verifyToken(req, res, jwtResetPasswordKey);
        if (!userData) {
            return null;
        }
        res.sendStatus(200);
        return userData;
    }
    //=================================================================================================================================
    // 1.4. function to rest the password
    async resetPassword(req, res) {
        const result = await authService.resetPassword(req, res);
        (0, messageTemplate_1.sendResponse)(res, result.status, result.messageKey, result.data);
        return;
    }
    //==================================================================================================================================
    //? ==================================================================================================================================
    //=================================================================================================================================
    //? 2. Set Password 
    //? 2.1 function to send validate email to set password (for fresh user, like newly added dirver)
    async sendValidateEmail(req, res, email) {
        const result = await authService.sendValidateEmail(email);
        (0, messageTemplate_1.sendResponse)(res, result.status, result.messageKey, result.data);
        return;
    }
    //==================================================================================================================================
    //? 2.2.  verify set password token (HEAD)
    async verifySetPasswordToken(req, res) {
        // ensure that JWT_RESET_PASSWORD_KEY exists in .env
        const jwtSetPasswordKey = process.env.JWT_SET_PASSWORD_KEY;
        if (!jwtSetPasswordKey) {
            console.error('JWT_SET_PASSWORD_KEY is not defined');
            (0, messageTemplate_1.sendResponse)(res, 500, 'common.errors.internal');
            return null;
        }
        const userData = await authService.verifyToken(req, res, jwtSetPasswordKey);
        if (!userData) {
            return null;
        }
        res.sendStatus(200);
        return userData;
    }
    //==================================================================================================================================
    //? 2.3. function to set password (if it's new user, e.x: new driver )
    async setPassword(req, res) {
        const result = await authService.setPassword(req, res);
        (0, messageTemplate_1.sendResponse)(res, result.status, result.messageKey, result.data);
        return;
    }
}
exports.AuthController = AuthController;
//============================================================================================================================================================
//# sourceMappingURL=authController.js.map