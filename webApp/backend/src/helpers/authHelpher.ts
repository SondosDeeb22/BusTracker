//===========================================================================================================
//? Import 
//==========================================================================================================

import { Request, Response } from "express";

import { LocationData , userIPaddressAndLocation} from "../interfaces/helper&middlewareInterface";


//importing libraries
import jwt from 'jsonwebtoken';

//import Models
import LoginAttemptModel from '../models/loginAttempModel';
import BusModel from '../models/busModel';

// to send responses
import { sendResponse } from '../exceptions/messageTemplate';

//import Enums ------------------------------------------------------------------------------
import { loginToken } from "../enums/tokenNameEnum";

// import interfaces ------------------------------------------------------------------------
import { JWTdata } from "../interfaces/helper&middlewareInterface";


import path from "path";
//===========================================================================================================================
class AuthHelper{

    //===========================================================================================================================================
    // Function to Create JWT
    //===========================================================================================================================================

    createJWTtoken(res: Response, 
        tokenName: string, 
        secretKey: string,  
        components: { [key: string]: number | string | boolean}, 
        maximumAge: number, 
        storeCookie: boolean ): string{

        //create token ------------------------------------------------------------------------------------
        const token: string = jwt.sign( components, secretKey,  { expiresIn: maximumAge / 1000 });
    
        // Only set cookie if explicitly requested------------------------------------------------------------------------------------
        if(storeCookie){
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
    removeCookieToken(res: Response, tokenName: string): null {
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
    extractJWTData =  <tokentInterface>(req: Request,  tokenName: string, secretKey: string): tokentInterface | string => {
        try{


            // take the token from the cookie 
            const token: string = req.cookies[tokenName];
    
            if(!token){
                return 'common.auth.sessionExpired';
            }
            
            const user_data = jwt.verify(token, secretKey) as tokentInterface;
            if(!user_data || typeof user_data !== "object"){
                return 'common.auth.invalidToken';
            }
            return user_data;
    
        //---------------------------------------------------------------------------------------------------------------------    
        }catch(error){
            return 'common.errors.unauthorized';
        }
    } 
    //===========================================================================================================================================
    // Function to get the user IP address and use it to get his location info
    //============================================================================================================================================
    
    getIPaddressAndUserLocation = async (req: Request): Promise< userIPaddressAndLocation > =>{
        const unknownResult: userIPaddressAndLocation = { ip: null, location: null };

        try{
            const ip = req.ip as string | undefined;
            if(!ip){
                console.warn('IP address not available, skipping location lookup');
                return unknownResult;
            }

            const response = await fetch(`http://ip-api.com/json/${ip}`);
        
            if(!response.ok){
                console.warn('Failed to fetch location data, skipping location lookup');
                return { ip, location: null };
            }
            const locationJSONdata= await response.json() as LocationData;
            if (!locationJSONdata || Object.keys(locationJSONdata).length === 0) {
                console.warn('No location data found for the given IP address, skipping location lookup');
                return { ip, location: null };
            }
        
            const city = locationJSONdata.city || 'Unknown City';
            const country = locationJSONdata.country  || 'Unknown Country';
            const region = locationJSONdata.region || 'Unknown Region';
        
            const location: string = `${city}, ${region}, ${country}`
            return {ip, location};
        
        }catch(error){
            console.warn('Error occured while getting location data from the IP address');
            return unknownResult;
        }
    }
    // =================================================================================================================================
    // Function that store the login attempts
    // =================================================================================================================================

    async loginAttempt(req: Request, res: Response, attemptSuccessful: boolean, userEmail: string, status: number, resultMessage: string):Promise<void>{
        try{
            const IPaddressAndLocation= await this.getIPaddressAndUserLocation(req);

            //---------------------------------------------------------------------
            // store the ip in the database
            const IPstored = await LoginAttemptModel.create({
                userEmail: userEmail,
                IPaddress: IPaddressAndLocation.ip,
                attemptLocation: IPaddressAndLocation.location,
                attemptSuccessful: attemptSuccessful, 
                // attemptTime:  new Date().toTimeString().split(' ')[0],
                attemptTime:  new Date().toTimeString().slice(0, 8),
                attemptDate: new Date()
            })

            // resultMessage is user-facing; do not return raw text
            sendResponse(res, status, attemptSuccessful ? 'auth.login.success' : 'auth.login.invalidCredentials');
            //=================================================================================================================================
        }catch(error){
            console.error('Error occured while storing login attempt.', error);
            sendResponse(res, 500, 'common.errors.internal');
            return;
        }
        
    }
    // =================================================================================================================================
    // Function to validate that user committing operation is authorized to do that (so no driver changes something for another driver)
    // =================================================================================================================================
    async validateUser(req: Request, res: Response, id: string): Promise<boolean>{
        try{
            const jwtLoginKey = process.env.JWT_LOGIN_KEY;
            if(!jwtLoginKey){
                console.error('Error in fetching JWT secret key');
                sendResponse(res, 500, 'common.errors.internal');
                return false;
            }

            // get the logged in user data ---------------------------------------------------
            const userData = this.extractJWTData<JWTdata>(req, loginToken, jwtLoginKey);

            if(typeof userData === "string"){ // when userData is string (so it's not object that contains users data ). then, we  return the error message and stop the function 
                sendResponse(res, 401, userData);
                return false;
            }

            //check if the user (logged in ) tryying to change value in bus table, is the same user assinged as driver for that bus
            const user = await BusModel.findOne({
                where: {
                    id: id,
                    assignedDriver: userData.userID
                }
            })

            if(!user){
                sendResponse(res, 403, 'common.errors.forbidden');
                return false;
                
            };

            return true;
        //==========================================================================================================================
        }catch(error){
            console.error('Error occured while validating login attempt', error);
            sendResponse(res, 500, 'common.errors.internal');
            return false;
        }
    }

}

//=================================================================================================================================
export default AuthHelper;