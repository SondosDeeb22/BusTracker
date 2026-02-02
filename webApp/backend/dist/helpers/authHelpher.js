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
//import Enums ------------------------------------------------------------------------------
const tokenNameEnum_1 = require("../enums/tokenNameEnum");
const errors_1 = require("../errors");
class AuthHelper {
    //===========================================================================================================================================
    // Function to Create JWT
    //===========================================================================================================================================
    createJWTtoken(res, tokenName, secretKey, components, maximumAge, storeCookie) {
        //create token ------------------------------------------------------------------------------------
        const token = jsonwebtoken_1.default.sign(components, secretKey, { expiresIn: maximumAge / 1000 });
        // Only set cookie if explicitly requested------------------------------------------------------------------------------------
        if (storeCookie) {
            res.cookie(tokenName, token, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                path: "/"
            });
        }
        return token; // Return the JWT token
    }
    //===========================================================================================================================================
    // Function to remove a cookie
    //===========================================================================================================================================
    removeCookieToken(res, tokenName) {
        // remove current cookie variant (matches how we set it)
        res.clearCookie(tokenName, {
            httpOnly: true,
            path: "/api",
            sameSite: "strict",
            secure: true
        });
        // also remove legacy cookies that may have been set with different attributes
        res.clearCookie(tokenName, {
            httpOnly: true,
            path: "/",
            sameSite: "lax",
            secure: false
        });
        res.clearCookie(tokenName, {
            httpOnly: true,
            path: "/",
            sameSite: "strict",
            secure: false
        });
        return null;
    }
    //===========================================================================================================================================
    // Function to Extract a token data
    //============================================================================================================================================
    extractJWTData = (req, tokenName, secretKey) => {
        try {
            // take the token from the cookie 
            const token = req.cookies[tokenName];
            if (!token) {
                throw new errors_1.UnauthorizedError('common.auth.sessionExpired');
            }
            const user_data = jsonwebtoken_1.default.verify(token, secretKey);
            if (!user_data || typeof user_data !== "object") {
                throw new errors_1.UnauthorizedError('common.auth.invalidToken');
            }
            return user_data;
            //---------------------------------------------------------------------------------------------------------------------    
        }
        catch (error) {
            if (error instanceof errors_1.UnauthorizedError) {
                throw error;
            }
            throw new errors_1.UnauthorizedError('common.errors.unauthorized');
        }
    };
    //===========================================================================================================================================
    // Function to get the user IP address and use it to get his location info
    //============================================================================================================================================
    getIPaddressAndUserLocation = async (req) => {
        const unknownResult = { ip: null, location: null };
        try {
            const ip = req.ip;
            if (!ip) {
                console.warn('IP address not available, skipping location lookup');
                return unknownResult;
            }
            const response = await fetch(`http://ip-api.com/json/${ip}`);
            if (!response.ok) {
                console.warn('Failed to fetch location data, skipping location lookup');
                return { ip, location: null };
            }
            const locationJSONdata = await response.json();
            if (!locationJSONdata || Object.keys(locationJSONdata).length === 0) {
                console.warn('No location data found for the given IP address, skipping location lookup');
                return { ip, location: null };
            }
            const city = locationJSONdata.city || 'Unknown City';
            const country = locationJSONdata.country || 'Unknown Country';
            const region = locationJSONdata.region || 'Unknown Region';
            const location = `${city}, ${region}, ${country}`;
            return { ip, location };
            // ----------------------------------------------------------------------------
        }
        catch (error) {
            console.warn('Error occured while getting location data from the IP address');
            return unknownResult;
        }
    };
    // =================================================================================================================================
    // Function that store the login attempts
    // =================================================================================================================================
    async loginAttempt(req, attemptSuccessful, userEmail) {
        try {
            const IPaddressAndLocation = await this.getIPaddressAndUserLocation(req);
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
            //=================================================================================================================================
        }
        catch (error) {
            console.error('Error occured while storing login attempt.', error);
            return;
        }
    }
    // =================================================================================================================================
    // Function to validate that user committing operation is authorized to do that (so no driver changes something for another driver)
    // =================================================================================================================================
    async validateUser(req, id) {
        try {
            const jwtLoginKey = process.env.JWT_LOGIN_KEY;
            if (!jwtLoginKey) {
                console.error('Error in fetching JWT secret key');
                throw new errors_1.InternalError('common.errors.internal');
            }
            // get the logged in user data ---------------------------------------------------
            const userData = this.extractJWTData(req, tokenNameEnum_1.loginToken, jwtLoginKey);
            //check if the user (logged in ) tryying to change value in bus table, is the same user assinged as driver for that bus
            const userauthorized = await busModel_1.default.findOne({
                where: {
                    id: id,
                    assignedDriver: userData.userID
                }
            });
            if (!userauthorized) {
                throw new errors_1.ForbiddenError('common.errors.forbidden');
            }
            ;
            return true;
            //==========================================================================================================================
        }
        catch (error) {
            console.error('Error occured while validating login attempt', error);
            throw error;
        }
    }
}
//=================================================================================================================================
exports.default = AuthHelper;
//# sourceMappingURL=authHelpher.js.map