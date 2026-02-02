"use strict";
//=======================================================================================
//? Import
//=======================================================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.accessRequireToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import exceptions --------------------------------------------------------------------
const messageTemplate_1 = require("../exceptions/messageTemplate");
//=======================================================================================
//? Authentication functions:
// it ensures that only logged in users are able to access the routes
//=======================================================================================
const accessRequireToken = (tokenName) => {
    return (req, res, next) => {
        try {
            // take the token from the cookie 
            const token = req.cookies[tokenName];
            if (!token) {
                (0, messageTemplate_1.sendResponse)(res, 401, 'common.auth.sessionExpired');
                return;
            }
            //check if JWT exists in .env file
            const jwtLoginKey = process.env.JWT_LOGIN_KEY;
            if (!jwtLoginKey) {
                console.error('JWT_LOGIN_KEY is not defined');
                (0, messageTemplate_1.sendResponse)(res, 500, 'common.errors.internal');
                return;
            }
            // verifty the correctenss of the token
            const userData = jsonwebtoken_1.default.verify(token, jwtLoginKey);
            if (!userData || typeof userData !== "object") {
                (0, messageTemplate_1.sendResponse)(res, 401, 'common.auth.invalidToken');
                return;
            }
            // store user data in req.user
            req.user = {
                id: userData.userID,
                name: userData.userName,
                role: userData.userRole
            };
            next(); // Pass control to the next middleware/route
            //-------------------------------------------------------------------------------------
        }
        catch (error) {
            console.error('Middleware error:', error);
            (0, messageTemplate_1.sendResponse)(res, 500, 'common.errors.internal');
        }
    };
};
exports.accessRequireToken = accessRequireToken;
//=======================================================================================
//# sourceMappingURL=tokenRequired.js.map