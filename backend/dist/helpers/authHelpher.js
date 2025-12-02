"use strict";
//===========================================================================================================
//? Import 
//==========================================================================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//importing libraries
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//import Models
const loginAttempModel_1 = __importDefault(require("../models/loginAttempModel"));
const busModel_1 = __importDefault(require("../models/busModel"));
// to send responses
const messageTemplate_1 = require("../exceptions/messageTemplate");
//import Enums ------------------------------------------------------------------------------
const tokenNameEnum_1 = require("../enums/tokenNameEnum");
//===========================================================================================================================
class AuthHelper {
    //===========================================================================================================================================
    // Function to Create JWT
    //===========================================================================================================================================
    createJWTtoken(res, tokenName, components, maximumAge, storeCookie) {
        //create token ------------------------------------------------------------------------------------
        const JWTkey = process.env.JWT_KEY;
        console.log("JWT key: ", JWTkey);
        if (!JWTkey) {
            throw new Error("Error in fetching JWT secret key");
        }
        const token = jsonwebtoken_1.default.sign(components, JWTkey);
        // generate cookie and store the token inside it------------------------------------------------------------------------------------
        // res.cookie(tokenName ,token, {httpOnly: true, maxAge: maximumAge});
        // Only set cookie if explicitly requested
        if (storeCookie) {
            res.cookie(tokenName, token, {
                httpOnly: true,
                maxAge: maximumAge,
                secure: process.env.NODE_ENV === 'production', // only for HTTPS in production
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'lax' for development
            });
        }
        return token; // Return the JWT token
    }
    //===========================================================================================================================================
    // Function to remove a cookie
    //===========================================================================================================================================
    removeCookieToken(res, tokenName) {
        res.clearCookie(tokenName);
        return null;
    }
    //===========================================================================================================================================
    // Function to Extract a token data
    //============================================================================================================================================
    extractJWTData = (req, tokenName) => {
        try {
            // take the token from the cookie 
            const token = req.cookies[tokenName];
            if (!token) {
                return "Session expired, Please log in again";
            }
            const JWT_key = process.env.JWT_KEY;
            if (!JWT_key) {
                return "Internal Error! missing token key in environment file";
            }
            const user_data = jsonwebtoken_1.default.verify(token, JWT_key);
            if (!user_data || typeof user_data !== "object") {
                return "Invalid JWT token";
            }
            return user_data;
            //---------------------------------------------------------------------------------------------------------------------    
        }
        catch (error) {
            return `Error Found while verification the token: ${error}`;
        }
    };
    //===========================================================================================================================================
    // Function to get the user IP address and use it to get his location info
    //============================================================================================================================================
    getIPaddressAndUserLocation = async (req) => {
        try {
            const ip = req.ip;
            //values for testing locally: 
            // const ip = "212.108.136.143";
            // const ip = "8.8.8.8";
            //--------------------------------------------------------------------
            //get the location from the IP address
            const response = await fetch(`http://ip-api.com/json/${ip}`); // using third party tool ip-api.com website
            if (!response.ok) {
                return "Error occured, Failed to fetch location data";
            }
            const locationJSONdata = await response.json();
            if (!locationJSONdata || Object.keys(locationJSONdata).length === 0) {
                return "Error Occured, No location data found for the give IP address";
            }
            console.log("Location data received:", locationJSONdata);
            const city = locationJSONdata.city || 'Unknown City';
            const country = locationJSONdata.country || 'Unknown Country';
            const region = locationJSONdata.region || 'Unknown Region';
            const location = `${city}, ${region}, ${country}`;
            return { ip, location };
        }
        catch (error) {
            return "Error Occured while getting location data from the IP address";
        }
    };
    // =================================================================================================================================
    // Function that store the login attempts
    // =================================================================================================================================
    async loginAttempt(req, res, attemptSuccessful, userEmail, status, resultMessage) {
        try {
            const IPaddressAndLocation = await this.getIPaddressAndUserLocation(req);
            if (typeof IPaddressAndLocation === "string") { // if succeed we receive IP and loction, for error cases we get error message(string)
                (0, messageTemplate_1.sendResponse)(res, 500, IPaddressAndLocation);
                return;
            }
            //---------------------------------------------------------------------
            // store the ip in the database
            const IPstored = await loginAttempModel_1.default.create({
                userEmail: userEmail,
                IPaddress: IPaddressAndLocation.ip,
                attemptLocation: IPaddressAndLocation.location,
                attemptSuccessful: attemptSuccessful,
                // attemptTime:  new Date().toTimeString().split(' ')[0],
                attemptTime: new Date().toTimeString().slice(0, 8),
                attemptDate: new Date()
            });
            (0, messageTemplate_1.sendResponse)(res, status, resultMessage);
            //=================================================================================================================================
        }
        catch (error) {
            (0, messageTemplate_1.sendResponse)(res, 500, `Error occured while storing login attempt. ${error}`);
            return;
        }
    }
    // =================================================================================================================================
    // Function to validate that user committing operation is authorized to do that (so no driver changes something for another driver)
    // =================================================================================================================================
    async validateUser(req, res, id) {
        try {
            // get the logged in user data ---------------------------------------------------
            const userData = this.extractJWTData(req, tokenNameEnum_1.tokenNames.loginToken);
            if (typeof userData === "string") { // when userData is string (so it's not object that contains users data ). then, we  return the error message and stop the function 
                (0, messageTemplate_1.sendResponse)(res, 500, userData); // userData here is Error message , check authHelper.ts file
                return false;
            }
            //check if the user (logged in ) tryying to change value in bus table, is the same user assinged as driver for that bus
            const user = await busModel_1.default.findOne({
                where: {
                    id: id,
                    assignedDriver: userData.userID
                }
            });
            if (!user) {
                (0, messageTemplate_1.sendResponse)(res, 500, 'You are not authorized to perform this action');
                return false;
            }
            ;
            return true;
            //==========================================================================================================================
        }
        catch (error) {
            (0, messageTemplate_1.sendResponse)(res, 500, 'Error occured whild Validating login attempt');
            return false;
        }
    }
}
//=================================================================================================================================
exports.default = AuthHelper;
//# sourceMappingURL=authHelpher.js.map