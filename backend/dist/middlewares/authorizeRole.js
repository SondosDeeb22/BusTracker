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
            (0, messageTemplate_1.sendResponse)(res, 500, `JWT_LOGIN_KEY is not defined : ${jwtLoginKey}`);
            return;
        }
        const tokenData = authHelper.extractJWTData(req, tokenNameEnum_1.loginToken, jwtLoginKey);
        if (typeof tokenData === "string") { // when userData is string (so it's not object that contains users data ). then, we  return the error message and stop the function 
            console.log(tokenData); // userData here is Error message , check authHelper.ts file
            res.status(500).json({ message: tokenData });
            return;
        }
        // check the user role
        if (tokenData.userRole !== role) {
            console.log("Access Denied!");
            res.status(500).json({ message: "Access Denied!" });
            return;
        }
        next();
    };
};
exports.authorizeRole = authorizeRole;
//# sourceMappingURL=authorizeRole.js.map