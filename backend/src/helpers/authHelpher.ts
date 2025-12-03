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
import { tokenNames } from "../enums/tokenNameEnum";

// import interfaces ------------------------------------------------------------------------
import { JWTdata } from "../interfaces/helper&middlewareInterface";


import path from "path";
//===========================================================================================================================
class AuthHelper{

    //===========================================================================================================================================
    // Function to Create JWT
    //===========================================================================================================================================

    createJWTtoken(res: Response, tokenName: string,  components: { [key: string]: number | string | boolean}, maximumAge: number, storeCookie: boolean): string{
        //create token ------------------------------------------------------------------------------------
        const JWTkey = process.env.JWT_KEY;
        if(!JWTkey){
            throw new Error("Error in fetching JWT secret key");
        }
        const token: string = jwt.sign( components, JWTkey);
    
        // generate cookie and store the token inside it------------------------------------------------------------------------------------
        // res.cookie(tokenName ,token, {httpOnly: true, maxAge: maximumAge});

        // Only set cookie if explicitly requested
        if(storeCookie){
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
    removeCookieToken( res: Response, tokenName: string ): null{
        res.clearCookie( tokenName );
        return null ;

    }

    //===========================================================================================================================================
    // Function to Extract a token data
    //============================================================================================================================================
    extractJWTData =  <tokentInterface>(req: Request,  tokenName: string): tokentInterface | string => {
        try{
            // take the token from the cookie 
            const token: string = req.cookies[tokenName];
    
            if(!token){
                return "Session expired, Please log in again";
            }
            
            const JWT_key = process.env.JWT_KEY;
            if(!JWT_key){
                return "Internal Error! missing token key in environment file";
            }
    
            const user_data = jwt.verify(token, JWT_key) as tokentInterface;
            if(!user_data || typeof user_data !== "object"){
                return "Invalid JWT token";
            }
            return user_data;
    
        //---------------------------------------------------------------------------------------------------------------------    
        }catch(error){
            return `Error Found while verification the token: ${error}`;
        }
    } 
    //===========================================================================================================================================
    // Function to get the user IP address and use it to get his location info
    //============================================================================================================================================
    
    getIPaddressAndUserLocation = async (req: Request): Promise< userIPaddressAndLocation | string > =>{
        try{
            const ip = req.ip as string;
            //values for testing locally: 
            // const ip = "212.108.136.143";
            // const ip = "8.8.8.8";
        
            //--------------------------------------------------------------------
            //get the location from the IP address
            const response = await fetch(`http://ip-api.com/json/${ip}`); // using third party tool ip-api.com website
        
            if(!response.ok){
                return "Error occured, Failed to fetch location data"
            }
            const locationJSONdata= await response.json() as LocationData;
            if (!locationJSONdata || Object.keys(locationJSONdata).length === 0) {
                return "Error Occured, No location data found for the give IP address";
            }
            console.log("Location data received:", locationJSONdata);
        
            const city = locationJSONdata.city || 'Unknown City';
            const country = locationJSONdata.country  || 'Unknown Country';
            const region = locationJSONdata.region || 'Unknown Region';
        
            const location: string = `${city}, ${region}, ${country}`
            return {ip, location};
        
        }catch(error){
            return "Error Occured while getting location data from the IP address"
        }
    }
    // =================================================================================================================================
    // Function that store the login attempts
    // =================================================================================================================================

    async loginAttempt(req: Request, res: Response, attemptSuccessful: boolean, userEmail: string, status: number, resultMessage: string):Promise<void>{
        try{
            const IPaddressAndLocation= await this.getIPaddressAndUserLocation(req);
            if(typeof IPaddressAndLocation === "string"){ // if succeed we receive IP and loction, for error cases we get error message(string)
                sendResponse(res, 500, IPaddressAndLocation);
                return;
            }

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

            sendResponse(res, status, resultMessage);
            //=================================================================================================================================
        }catch(error){
            sendResponse(res, 500, `Error occured while storing login attempt. ${error}`);
            return;
        }
        
    }
    // =================================================================================================================================
    // Function to validate that user committing operation is authorized to do that (so no driver changes something for another driver)
    // =================================================================================================================================
    async validateUser(req: Request, res: Response, id: string): Promise<boolean>{
        try{
            // get the logged in user data ---------------------------------------------------
            const userData = this.extractJWTData<JWTdata>(req, tokenNames.loginToken);

            if(typeof userData === "string"){ // when userData is string (so it's not object that contains users data ). then, we  return the error message and stop the function 
                sendResponse(res, 500, userData);// userData here is Error message , check authHelper.ts file
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
                sendResponse(res, 500, 'You are not authorized to perform this action');
                return false;
                
            };

            return true;
        //==========================================================================================================================
        }catch(error){
            sendResponse(res, 500, 'Error occured whild Validating login attempt');
            return false;
        }
    }

}

//=================================================================================================================================
export default AuthHelper;