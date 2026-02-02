"use strict";
//=======================================================================================
//? Import
//=======================================================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRole = void 0;
//import enums
const tokenNameEnum_1 = require("../enums/tokenNameEnum");
//import helpers
const authHelpher_1 = __importDefault(require("../helpers/authHelpher"));
const authHelper = new authHelpher_1.default();
// import exceptions --------------------------------------------------------------------
const messageTemplate_1 = require("../exceptions/messageTemplate");
const errors_1 = require("../errors");
//=======================================================================================
//? function that will protect cetain pages from unauthorized access 
// strict the access for some page 
// used Middlwares Factory 
//=======================================================================================
const authorizeRole = (role) => {
    return (req, res, next) => {
        // Get the user data from the token
        //check if JWT exists in .env file
        const jwtLoginKey = process.env.JWT_LOGIN_KEY;
        if (!jwtLoginKey) {
            (0, messageTemplate_1.sendResponse)(res, 500, 'common.errors.internal');
            return;
        }
        let tokenData;
        // =======================================================
        try {
            tokenData = authHelper.extractJWTData(req, tokenNameEnum_1.loginToken, jwtLoginKey);
            // -------------------------------------------------------------------------
        }
        catch (error) {
            if (error instanceof errors_1.UnauthorizedError) {
                (0, messageTemplate_1.sendResponse)(res, 401, error.message);
                return;
            }
            (0, messageTemplate_1.sendResponse)(res, 500, 'common.errors.internal');
            return;
        }
        // =======================================================
        // check the user role
        if (tokenData.userRole !== role) {
            (0, messageTemplate_1.sendResponse)(res, 403, 'common.errors.forbidden');
            return;
        }
        next();
    };
};
exports.authorizeRole = authorizeRole;
//# sourceMappingURL=authorizeRole.js.map