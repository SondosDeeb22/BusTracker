"use strict";
//==========================================================================================================
//? Import Sections
//==========================================================================================================
Object.defineProperty(exports, "__esModule", { value: true });
const getCurrentUser_1 = require("./authService/getCurrentUser");
const login_1 = require("./authService/login");
const logout_1 = require("./authService/logout");
const passwordReset_1 = require("./authService/passwordReset");
const setPassword_1 = require("./authService/setPassword");
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
        return (0, getCurrentUser_1.getCurrentUser)(req, res);
    }
    //==========================================================================================================
    //? Login 
    //==========================================================================================================
    async login(req, res) {
        return (0, login_1.login)(req, res);
    }
    //? =================================================================================================================================
    //? Logout function
    // =================================================================================================================================
    async logout(req, res) {
        return (0, logout_1.logout)(req, res);
    }
    //? =================================================================================================================================
    //? Function that Send emails to Reset password
    // =================================================================================================================================
    async sendEmailToResetPassword(req, res, targetRole) {
        return (0, passwordReset_1.sendEmailToResetPassword)(req, res, targetRole);
    }
    // =================================================================================================================================
    //? Function to verify reset password token (for frontend HEAD checks)
    // =================================================================================================================================
    async verifyResetPasswordToken(req) {
        return (0, passwordReset_1.verifyResetPasswordToken)(req);
    }
    // =================================================================================================================================
    //? Function to verify set password token (for frontend HEAD checks)
    // =================================================================================================================================
    async verifySetPasswordToken(req) {
        return (0, setPassword_1.verifySetPasswordToken)(req);
    }
    //? =================================================================================================================================
    //? Function to reset the password
    // =================================================================================================================================
    async resetPassword(req, res) {
        return (0, passwordReset_1.resetPassword)(req, res);
    }
    //====================================================================================================
    //? send Validation Email for new user (in order to set his password)
    //=========================================================================================
    async sendValidateEmail(email) {
        return (0, setPassword_1.sendValidateEmail)(email);
    }
    //===================================================================================================================================
    //? set password 
    //===================================================================================================================================
    async setPassword(req, res) {
        return (0, setPassword_1.setPassword)(req, res);
    }
}
//=================================================================================================================================================
exports.default = AuthService;
//# sourceMappingURL=authService.js.map