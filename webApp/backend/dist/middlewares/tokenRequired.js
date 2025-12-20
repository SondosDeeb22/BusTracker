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
                console.log("Session expired, Please log in again");
                res.status(401).json({ message: "Session expired, Please log in again" });
                return;
            }
            //check if JWT exists in .env file
            const jwtLoginKey = process.env.JWT_LOGIN_KEY;
            if (!jwtLoginKey) {
                (0, messageTemplate_1.sendResponse)(res, 500, `JWT_LOGIN_KEY is not defined : ${jwtLoginKey}`);
                return;
            }
            // verifty the correctenss of the token
            const userData = jsonwebtoken_1.default.verify(token, jwtLoginKey);
            if (!userData || typeof userData !== "object") {
                console.log("Invalid JWT token");
                res.status(401).json({ message: "Invalid JWT token" });
                return;
            }
            next(); // Pass control to the next middleware/route
            //-------------------------------------------------------------------------------------
        }
        catch (error) {
            console.error('Middleware error:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    };
};
exports.accessRequireToken = accessRequireToken;
//=======================================================================================
//# sourceMappingURL=tokenRequired.js.map