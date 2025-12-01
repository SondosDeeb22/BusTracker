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
    // function send email for user for password resetting
    async sendEmailToResetPassword(req, res) {
        return authService.sendPasswordResetEmail(req, res);
    }
    //=================================================================================================================================
    // function to rest the password
    async resetPassword(req, res) {
        return authService.resetPassword(req, res);
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=authController.js.map