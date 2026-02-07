"use strict";
//===========================================================================================================
//? Import 
//==========================================================================================================
Object.defineProperty(exports, "__esModule", { value: true });
const tokenNameEnum_1 = require("../enums/tokenNameEnum");
const errors_1 = require("../errors");
const authHelper_1 = require("./authHelper");
const ipLocation_1 = require("./authHelper/ipLocation");
// ==================================================================================
//? AuthHelper class
// Login/ Logout  ------------------------------------------------------------
// create login session (createLoginSession)
// clear login session (clearLoginSession)
// verify login token (getUserData)
// Create Tokens ------------------------------------------------------------
// function to create token for email url (createEmailUrlToken)
// funciton to create token for RESET password (createResetPasswordUrlToken)
// function to create token for SET password (createSetPasswordUrlToken)
// Verify Tokens ---------------------------------------------------------------------
// function to verify url Token (verifyUrlTokenFromRequest)
// verify email url token from request (verifyUrlTokenFromRequestWithEnvKey)
// verify url token for RESET password operation (verifyResetPasswordUrlTokenFromRequest)
// verify url token for SEST password operation (verifySetPasswordUrlTokenFromRequest)
// Driver ------------------------------------------------------------------------
// validate driver authority to change bus data by id (validateUserById)
// general functions -------------------------------------------------
// verify token (verifyUrlToken)
// function to get env secret key (getEnvSecretKey)
// extract JWT data (extractJWTData)
// function to get cookie setter (getCookieSetter)
// remove the cookie that contains a specific token(removeCookieToken)
// create JWT token using given data  (createJWTtoken)
// functin to get user data (getUserData)
// ==================================================================================
class AuthHelper {
    // ==================================================================================
    //? function to create login session
    // ==================================================================================
    createLoginSession(res, payload) {
        const secretKey = this.getEnvSecretKey("JWT_LOGIN_KEY");
        console.log(payload.userID);
        console.log(payload.userName);
        console.log(payload.userRole);
        return this.createJWTtoken(res, tokenNameEnum_1.loginToken, secretKey, {
            userID: payload.userID,
            userRole: payload.userRole,
            userName: payload.userName,
        }, 3600000, true);
    }
    // ================================================================================
    //? function to clear login session
    // ==================================================================================
    clearLoginSession(res) {
        return this.removeCookieToken(res, tokenNameEnum_1.loginToken);
    }
    // ====================================================================================
    //? function to verify login token
    // ====================================================================================
    getUserData(req) {
        const secretKey = this.getEnvSecretKey("JWT_LOGIN_KEY");
        return this.extractJWTData(req, tokenNameEnum_1.loginToken, secretKey);
    }
    // ==================================================================================
    // function to get cookie setter
    // ==================================================================================
    getCookieSetter(res) {
        const setter = res.cookie ?? res.setCookie;
        if (!setter) {
            throw new errors_1.InternalError("common.errors.internal");
        }
        return setter;
    }
    // ====================================================================================
    // function to get env secret key
    // ====================================================================================
    getEnvSecretKey(envKeyName) {
        return (0, authHelper_1.getEnvSecretKey)(envKeyName);
    }
    // ====================================================================================
    // ====================================================================================
    //? function to create token (email url)
    // 
    createEmailUrlToken(email, envKeyName, expiresInMs = 1200000) {
        return (0, authHelper_1.createEmailUrlToken)(email, envKeyName, expiresInMs);
    }
    // ------------------------------------------------------------------------------------
    // function to create token for  ( RESET password url)
    createResetPasswordUrlToken(email) {
        return (0, authHelper_1.createResetPasswordUrlToken)(email);
    }
    createResetPasswordUrlTokenWithVersion(email, passwordResetVersion) {
        return (0, authHelper_1.createResetPasswordUrlTokenWithVersion)(email, passwordResetVersion);
    }
    // ------------------------------------------------------------------------------------
    // function to create token for ( SET password url )  
    createSetPasswordUrlToken(email) {
        return (0, authHelper_1.createSetPasswordUrlToken)(email);
    }
    // ====================================================================================
    // ====================================================================================
    //? function to verify (url token)
    verifyUrlToken(token, secretKey) {
        return (0, authHelper_1.verifyUrlToken)(token, secretKey);
    }
    // ----------------------------------------------------------------------------------
    // function to verify (url token from request)
    verifyUrlTokenFromRequest(req, secretKey) {
        return (0, authHelper_1.verifyUrlTokenFromRequest)(req, secretKey);
    }
    // ====================================================================================
    // ====================================================================================
    //? function to verify (url token from request )
    // 
    verifyUrlTokenFromRequestWithEnvKey(req, envKeyName) {
        return (0, authHelper_1.verifyUrlTokenFromRequestWithEnvKey)(req, envKeyName);
    }
    // ------------------------------------------------------------------------------------
    // function to verify (RESET password url token from request)
    verifyResetPasswordUrlTokenFromRequest(req) {
        return (0, authHelper_1.verifyResetPasswordUrlTokenFromRequest)(req);
    }
    // -----------------------------------------------------------------------------------
    // function to verify (SET password url token from request)
    verifySetPasswordUrlTokenFromRequest(req) {
        return (0, authHelper_1.verifySetPasswordUrlTokenFromRequest)(req);
    }
    //===========================================================================================================================================
    // Function to Create JWT
    //===========================================================================================================================================
    createJWTtoken(res, tokenName, secretKey, components, maximumAge, storeCookie) {
        // keep local validation (ensures ResponseLike is compatible)
        this.getCookieSetter(res);
        return (0, authHelper_1.createJWTtoken)(res, tokenName, secretKey, components, maximumAge, storeCookie);
    }
    //===========================================================================================================================================
    // Function to remove a cookie
    //===========================================================================================================================================
    removeCookieToken(res, tokenName) {
        return (0, authHelper_1.removeCookieToken)(res, tokenName);
    }
    //===========================================================================================================================================
    // Function to Extract a token data
    //============================================================================================================================================
    extractJWTData = (req, tokenName, secretKey) => {
        return (0, authHelper_1.extractJWTData)(req, tokenName, secretKey);
    };
    //===========================================================================================================================================
    // Function to get the user IP address and use it to get his location info
    //============================================================================================================================================
    getIPaddressAndUserLocation = async (req) => {
        return (0, ipLocation_1.getIPaddressAndUserLocation)(req);
    };
    // =================================================================================================================================
    // Function that store the login attempts
    // =================================================================================================================================
    async loginAttempt(req, attemptSuccessful, userEmail) {
        return (0, authHelper_1.loginAttempt)(req, attemptSuccessful, userEmail);
    }
    // =================================================================================================================================
    // Function to validate that user committing operation is authorized to do that (so no driver changes something for another driver)
    // (by operation her i mean changin bus data)
    // =================================================================================================================================
    async validateUserById(driverId, busId) {
        return (0, authHelper_1.validateUserById)(driverId, busId);
    }
}
//=================================================================================================================================
exports.default = AuthHelper;
//# sourceMappingURL=authHelpher.js.map