//===========================================================================================================
//? Import 
//==========================================================================================================

import { LocationData , userIPaddressAndLocation} from "../interfaces/helper&middlewareInterface";


//importing libraries
import jwt from 'jsonwebtoken';

//import Models
import LoginAttemptModel from '../models/loginAttempModel';
import BusModel from '../models/busModel';

//import Enums ------------------------------------------------------------------------------
import { loginToken } from "../enums/tokenNameEnum";

// import interfaces ------------------------------------------------------------------------
import { JWTdata } from "../interfaces/helper&middlewareInterface";

import { ForbiddenError, InternalError, UnauthorizedError } from '../errors';

import path from "path";
//===========================================================================================================================

type RequestLike = {
    cookies?: Record<string, string | undefined>;
    ip?: string | undefined;
    params?: any;
    query?: any;
};

type ResponseLike = {
    cookie?: (name: string, value: string, options?: Record<string, unknown>) => unknown;
    setCookie?: (name: string, value: string, options?: Record<string, unknown>) => unknown;
    clearCookie: (name: string, options?: Record<string, unknown>) => unknown;
};

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
class AuthHelper{

    // ==================================================================================
    //? function to create login session
    // ==================================================================================
    createLoginSession(res: ResponseLike, payload: JWTdata): string {
        const secretKey = this.getEnvSecretKey('JWT_LOGIN_KEY');

        return this.createJWTtoken(res, loginToken, secretKey, {
            userID: payload.userID,
            userRole: payload.userRole,
            userName: payload.userName,
        }, 3600000, true);
    }

    // ================================================================================
    //? function to clear login session
    // ==================================================================================
    clearLoginSession(res: ResponseLike): null {
        return this.removeCookieToken(res, loginToken);
    }

    // ====================================================================================
    //? function to verify login token
    // ====================================================================================
    getUserData(req: RequestLike): JWTdata {
        const secretKey = this.getEnvSecretKey('JWT_LOGIN_KEY');
        return this.extractJWTData<JWTdata>(req, loginToken, secretKey);
    }






    // ==================================================================================
    // function to get cookie setter
    // ==================================================================================
    private getCookieSetter(res: ResponseLike): (name: string, value: string, options?: Record<string, unknown>) => unknown {
        const setter = res.cookie ?? res.setCookie;
        if (!setter) {
            throw new InternalError('common.errors.internal');
        }
        return setter;
    }


    // ====================================================================================
    // function to get env secret key
    // ====================================================================================
    private getEnvSecretKey(envKeyName: string): string {
        const value = process.env[envKeyName];
        const secretKey = typeof value === 'string' ? value.trim() : '';
        if (!secretKey) {
            throw new InternalError('common.errors.internal');
        }
        return secretKey;
    }


    // ====================================================================================
    // ====================================================================================
    //? function to create token (email url)
    // 
    createEmailUrlToken(email: string, envKeyName: string, expiresInMs: number = 1200000): string {

        const secretKey = this.getEnvSecretKey(envKeyName);

        return jwt.sign({ email }, secretKey, { expiresIn: expiresInMs / 1000 });
    }

    // ------------------------------------------------------------------------------------
    // function to create token for  ( RESET password url)
    
    createResetPasswordUrlToken(email: string): string {

        return this.createEmailUrlToken(email, 'JWT_RESET_PASSWORD_KEY');
    }

    // ------------------------------------------------------------------------------------
    // function to create token for ( SET password url )  

    createSetPasswordUrlToken(email: string): string {
        return this.createEmailUrlToken(email, 'JWT_SET_PASSWORD_KEY');
    }


    // ====================================================================================
    // ====================================================================================
    //? function to verify (url token)

    verifyUrlToken<T extends object>(token: string, secretKey: string): T | null {
        try {
            const data = jwt.verify(token, secretKey) as T;
            if (!data || typeof data !== 'object') {
                return null;
            }
            return data;

        } catch (error) {
            return null;
        }
    }

    // ----------------------------------------------------------------------------------
    // function to verify (url token from request)
    verifyUrlTokenFromRequest<T extends object>(req: RequestLike, secretKey: string): T | null {
        const token = String(req.params?.token || req.query?.token);
        if (!token) {
            return null;
        }
        return this.verifyUrlToken<T>(token, secretKey);
    }

    

    // ====================================================================================
    // ====================================================================================
    //? function to verify (url token from request )
    // 

    verifyUrlTokenFromRequestWithEnvKey<T extends object>(req: RequestLike, envKeyName: string): T | null {
        const secretKey = this.getEnvSecretKey(envKeyName);
        return this.verifyUrlTokenFromRequest<T>(req, secretKey);
    }

    // ------------------------------------------------------------------------------------
    // function to verify (RESET password url token from request)

    verifyResetPasswordUrlTokenFromRequest<T extends object>(req: RequestLike): T | null {
        return this.verifyUrlTokenFromRequestWithEnvKey<T>(req, 'JWT_RESET_PASSWORD_KEY');
    }

    // -----------------------------------------------------------------------------------
    // function to verify (SET password url token from request)

    verifySetPasswordUrlTokenFromRequest<T extends object>(req: RequestLike): T | null {
        return this.verifyUrlTokenFromRequestWithEnvKey<T>(req, 'JWT_SET_PASSWORD_KEY');
    }
    // ====================================================================================



    //===========================================================================================================================================
    // Function to Create JWT
    //===========================================================================================================================================

    createJWTtoken(res: ResponseLike, 
        tokenName: string, 
        secretKey: string,  
        components: { [key: string]: number | string | boolean}, 
        maximumAge: number, 
        storeCookie: boolean ): string{

        //create token ------------------------------------------------------------------------------------
        const token: string = jwt.sign( components, secretKey,  { expiresIn: maximumAge / 1000 });
    
        // Only set cookie if explicitly requested------------------------------------------------------------------------------------
        if(storeCookie){
            const cookieSetter = this.getCookieSetter(res);
            cookieSetter(tokenName, token, {
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
    removeCookieToken(res: ResponseLike, tokenName: string): null {
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
    extractJWTData =  <tokentInterface>(req: RequestLike,  tokenName: string, secretKey: string): tokentInterface => {
        try{
            // take the token from the cookie 
            const token: string | undefined = req.cookies?.[tokenName];
    
            if(!token){
                throw new UnauthorizedError('common.auth.sessionExpired');
            }
            
            const user_data = jwt.verify(token, secretKey) as tokentInterface;
            if(!user_data || typeof user_data !== "object"){
                throw new UnauthorizedError('common.auth.invalidToken');
            }
            return user_data;
    
        //---------------------------------------------------------------------------------------------------------------------    
        }catch(error){
            if (error instanceof UnauthorizedError) {
                throw error;
            }
            throw new UnauthorizedError('common.errors.unauthorized');
        }
    } 
    //===========================================================================================================================================
    // Function to get the user IP address and use it to get his location info
    //============================================================================================================================================
    
    getIPaddressAndUserLocation = async (req: RequestLike): Promise< userIPaddressAndLocation > =>{
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
        
        // ----------------------------------------------------------------------------
        }catch(error){
            console.warn('Error occured while getting location data from the IP address');
            return unknownResult;
        }
    }
    // =================================================================================================================================
    // Function that store the login attempts
    // =================================================================================================================================

    async loginAttempt(req: RequestLike, attemptSuccessful: boolean, userEmail: string):Promise<void>{
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
            //=================================================================================================================================
        }catch(error){
            console.error('Error occured while storing login attempt.', error);
            return;
        }
        
    }

    // =================================================================================================================================
    // Function to validate that user committing operation is authorized to do that (so no driver changes something for another driver)
    // (by operation her i mean changin bus data)
    // =================================================================================================================================
    async validateUserById(driverId: number, busId: string): Promise<true> {
        try {
            if (!busId) {
                throw new ForbiddenError('common.errors.forbidden');
            }

            const userauthorized = await BusModel.findOne({
                where: {
                    id: busId,
                    assignedDriver: driverId
                },
                attributes: ['id']
            });

            if (!userauthorized) {
                throw new ForbiddenError('common.errors.forbidden');
            }

            return true;

        // -----------------------------------------------------------------
        } catch (error) {
            console.error('Error occured while validating user/bus relation', error);
            throw error;
        }
    }

}

//=================================================================================================================================
export default AuthHelper;