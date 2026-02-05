"use strict";
//==========================================================================================================
//? Import
//==========================================================================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySetPasswordUrlTokenFromRequest = exports.verifyResetPasswordUrlTokenFromRequest = exports.verifyUrlTokenFromRequestWithEnvKey = exports.verifyUrlTokenFromRequest = exports.verifyUrlToken = exports.createSetPasswordUrlToken = exports.createResetPasswordUrlToken = exports.createEmailUrlToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("./env");
//==========================================================================================================
// ======================================================================================
// function to create a url token
// ======================================================================================
const createEmailUrlToken = (email, envKeyName, expiresInMs = 1200000) => {
    const secretKey = (0, env_1.getEnvSecretKey)(envKeyName);
    return jsonwebtoken_1.default.sign({ email }, secretKey, { expiresIn: expiresInMs / 1000 });
};
exports.createEmailUrlToken = createEmailUrlToken;
// ===================================================================================
// function to create a reset password url token
// ===================================================================================
const createResetPasswordUrlToken = (email) => {
    return (0, exports.createEmailUrlToken)(email, "JWT_RESET_PASSWORD_KEY");
};
exports.createResetPasswordUrlToken = createResetPasswordUrlToken;
//  ==================================================================================
// function to create a set password url token
//  ==================================================================================
const createSetPasswordUrlToken = (email) => {
    return (0, exports.createEmailUrlToken)(email, "JWT_SET_PASSWORD_KEY");
};
exports.createSetPasswordUrlToken = createSetPasswordUrlToken;
//  ==================================================================================
// function to verify a url token
//  ==================================================================================
const verifyUrlToken = (token, secretKey) => {
    try {
        const data = jsonwebtoken_1.default.verify(token, secretKey);
        if (!data || typeof data !== "object") {
            return null;
        }
        return data;
    }
    catch (error) {
        return null;
    }
};
exports.verifyUrlToken = verifyUrlToken;
// ==================================================================================
// function to verify a url token from request
// ==================================================================================
const verifyUrlTokenFromRequest = (req, secretKey) => {
    const token = String(req.params?.token || req.query?.token);
    if (!token) {
        return null;
    }
    return (0, exports.verifyUrlToken)(token, secretKey);
};
exports.verifyUrlTokenFromRequest = verifyUrlTokenFromRequest;
// ==================================================================================
// function to verify a url token from request with env key
// ==================================================================================
const verifyUrlTokenFromRequestWithEnvKey = (req, envKeyName) => {
    const secretKey = (0, env_1.getEnvSecretKey)(envKeyName);
    return (0, exports.verifyUrlTokenFromRequest)(req, secretKey);
};
exports.verifyUrlTokenFromRequestWithEnvKey = verifyUrlTokenFromRequestWithEnvKey;
// ==================================================================================
// function to verify a reset password url token from request
// ==================================================================================
const verifyResetPasswordUrlTokenFromRequest = (req) => {
    return (0, exports.verifyUrlTokenFromRequestWithEnvKey)(req, "JWT_RESET_PASSWORD_KEY");
};
exports.verifyResetPasswordUrlTokenFromRequest = verifyResetPasswordUrlTokenFromRequest;
// ==================================================================================
// function to verify a set password url token from request
// ==================================================================================
const verifySetPasswordUrlTokenFromRequest = (req) => {
    return (0, exports.verifyUrlTokenFromRequestWithEnvKey)(req, "JWT_SET_PASSWORD_KEY");
};
exports.verifySetPasswordUrlTokenFromRequest = verifySetPasswordUrlTokenFromRequest;
//# sourceMappingURL=urlTokens.js.map