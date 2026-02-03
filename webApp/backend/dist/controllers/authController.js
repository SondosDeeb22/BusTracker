"use strict";
//============================================================================================================================================================
//?importing 
//============================================================================================================================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const messageTemplate_1 = require("../exceptions/messageTemplate");
const userEnum_1 = require("../enums/userEnum");
// import service 
const authService_1 = __importDefault(require("../services/authService"));
const authService = new authService_1.default();
//============================================================================================================================================================
class AuthController {
    // =========================================================================================
    // used to convert Express Request to AuthRequest (so we can pass it to service functions)
    toAuthReq = (req) => {
        return {
            body: req.body,
            cookies: req.cookies,
            ip: req.ip,
            params: req.params,
            query: req.query,
        };
    };
    // used to convert Express Response to AuthResponse (so we can pass it to service functions)
    toAuthRes = (res) => {
        return {
            setCookie: res.cookie.bind(res),
            clearCookie: res.clearCookie.bind(res),
        };
    };
    //=================================================================================================================================
    // Login function
    login = async (req, res) => {
        const result = await authService.login(this.toAuthReq(req), this.toAuthRes(res));
        (0, messageTemplate_1.sendResponse)(res, result.status, result.messageKey, result.data);
        return;
    };
    //=================================================================================================================================
    // Get current user data
    getCurrentUser = async (req, res) => {
        const result = await authService.getCurrentUser(this.toAuthReq(req), this.toAuthRes(res));
        (0, messageTemplate_1.sendResponse)(res, result.status, result.messageKey, result.data);
        return;
    };
    //=================================================================================================================================
    // Logout function
    logout = async (req, res) => {
        const result = await authService.logout(this.toAuthReq(req), this.toAuthRes(res));
        (0, messageTemplate_1.sendResponse)(res, result.status, result.messageKey, result.data);
        return;
    };
    // =================================================================================================================================
    //? 1. Reset Password (Forgot password page)
    // 1.1. function send email for user for password resetting
    sendEmailToResetAdminPassword = async (req, res) => {
        const result = await authService.sendEmailToResetPassword(this.toAuthReq(req), this.toAuthRes(res), userEnum_1.role.admin);
        (0, messageTemplate_1.sendResponse)(res, result.status, result.messageKey, result.data);
        return;
    };
    //==================================================================================================================================
    // 1.2. function send email for user for password resetting
    sendEmailToResetDriverPassword = async (req, res) => {
        const result = await authService.sendEmailToResetPassword(this.toAuthReq(req), this.toAuthRes(res), userEnum_1.role.driver);
        (0, messageTemplate_1.sendResponse)(res, result.status, result.messageKey, result.data);
        return;
    };
    //==================================================================================================================================
    // 1.3. verify reset password token (HEAD)
    verifyResetPasswordToken = async (req, res) => {
        const userData = await authService.verifyResetPasswordToken(this.toAuthReq(req));
        if (!userData) {
            return null;
        }
        res.sendStatus(200);
        return userData;
    };
    //=================================================================================================================================
    // 1.4. function to rest the password
    resetPassword = async (req, res) => {
        const result = await authService.resetPassword(this.toAuthReq(req), this.toAuthRes(res));
        (0, messageTemplate_1.sendResponse)(res, result.status, result.messageKey, result.data);
        return;
    };
    //==================================================================================================================================
    //? ==================================================================================================================================
    //=================================================================================================================================
    //? 2. Set Password 
    //? 2.1 function to send validate email to set password (for fresh user, like newly added dirver)
    sendValidateEmail = async (req, res, email) => {
        const result = await authService.sendValidateEmail(email);
        (0, messageTemplate_1.sendResponse)(res, result.status, result.messageKey, result.data);
        return;
    };
    //==================================================================================================================================
    //? 2.2.  verify set password token (HEAD)
    verifySetPasswordToken = async (req, res) => {
        const userData = await authService.verifySetPasswordToken(this.toAuthReq(req));
        if (!userData) {
            return null;
        }
        res.sendStatus(200);
        return userData;
    };
    //==================================================================================================================================
    //? 2.3. function to set password (if it's new user, e.x: new driver )
    setPassword = async (req, res) => {
        const result = await authService.setPassword(this.toAuthReq(req), this.toAuthRes(res));
        (0, messageTemplate_1.sendResponse)(res, result.status, result.messageKey, result.data);
        return;
    };
}
exports.AuthController = AuthController;
//============================================================================================================================================================
//# sourceMappingURL=authController.js.map