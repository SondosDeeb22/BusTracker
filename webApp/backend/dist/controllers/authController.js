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
const authService = new authService_1.default();
//============================================================================================================================================================
class AuthController {
    //=================================================================================================================================
    // Login function
    async login(req, res) {
        return authService.login(req, res);
    }
    //=================================================================================================================================
    // Get current user data
    async getCurrentUser(req, res) {
        return authService.getCurrentUser(req, res);
    }
    //=================================================================================================================================
    // Logout function
    async logout(req, res) {
        return authService.logout(req, res);
    }
    // =================================================================================================================================
    //? 1. Reset Password 
    //? 1.1. function send email for user for password resetting
    async sendEmailToResetPassword(req, res) {
        return authService.sendEmailToResetPassword(req, res);
    }
    //==================================================================================================================================
    //? 1.2. verify reset password token (HEAD)
    async verifyResetPasswordToken(req, res) {
        // ensure that JWT_RESET_PASSWORD_KEY exists in .env
        const jwtResetPasswordKey = process.env.JWT_RESET_PASSWORD_KEY;
        if (!jwtResetPasswordKey) {
            res.sendStatus(500);
            return "jwt key is not defined";
        }
        return authService.verifyToken(req, res, jwtResetPasswordKey);
    }
    //=================================================================================================================================
    //? 1.3. function to rest the password
    async resetPassword(req, res) {
        return authService.resetPassword(req, res);
    }
    //==================================================================================================================================
    //? ==================================================================================================================================
    //=================================================================================================================================
    //? 2. Set Password 
    //? 2.1 function to send validate email to set password (for fresh user, like newly added dirver)
    async sendValidateEmail(req, res, email) {
        return authService.sendValidateEmail(res, email);
    }
    //==================================================================================================================================
    //? 2.2.  verify set password token (HEAD)
    async verifySetPasswordToken(req, res) {
        // ensure that JWT_RESET_PASSWORD_KEY exists in .env
        const jwtSetPasswordKey = process.env.JWT_SET_PASSWORD_KEY;
        if (!jwtSetPasswordKey) {
            res.sendStatus(500);
            return "jwt key is not defined";
        }
        return authService.verifyToken(req, res, jwtSetPasswordKey);
    }
    //==================================================================================================================================
    //? 2.3. function to set password (if it's new user, e.x: new driver )
    async setPassword(req, res) {
        return authService.setPassword(req, res);
    }
}
exports.AuthController = AuthController;
//============================================================================================================================================================
//# sourceMappingURL=authController.js.map