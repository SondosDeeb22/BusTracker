//===========================================================================================================
//? Import 
//==========================================================================================================

import { loginToken } from "../enums/tokenNameEnum";

// import interfaces ------------------------------------------------------------------------
import { JWTdata, userIPaddressAndLocation } from "../interfaces/helper&middlewareInterface";

import { InternalError } from "../errors";

import {
    createEmailUrlToken,
    createJWTtoken,
    createResetPasswordUrlToken,
    createResetPasswordUrlTokenWithVersion,
    createSetPasswordUrlToken,
    extractJWTData,
    getEnvSecretKey,
    loginAttempt,
    removeCookieToken,
    validateUserById,
    verifyResetPasswordUrlTokenFromRequest,
    verifySetPasswordUrlTokenFromRequest,
    verifyUrlToken,
    verifyUrlTokenFromRequest,
    verifyUrlTokenFromRequestWithEnvKey,
} from "./authHelper";

import { getIPaddressAndUserLocation } from "./authHelper/ipLocation";

//===========================================================================================================================

type RequestLike = {
    cookies?: Record<string, string | undefined>;
    ip?: string | undefined;
    params?: Record<string, unknown>;
    query?: Record<string, unknown>;
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
        const secretKey = this.getEnvSecretKey("JWT_LOGIN_KEY");

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
        const secretKey = this.getEnvSecretKey("JWT_LOGIN_KEY");
        return this.extractJWTData<JWTdata>(req, loginToken, secretKey);
    }




    // ==================================================================================
    // function to get cookie setter
    // ==================================================================================
    private getCookieSetter(res: ResponseLike): (name: string, value: string, options?: Record<string, unknown>) => unknown {
        const setter = res.cookie ?? res.setCookie;
        if (!setter) {
            throw new InternalError("common.errors.internal");
        }
        return setter;
    }




    // ====================================================================================
    // function to get env secret key
    // ====================================================================================
    private getEnvSecretKey(envKeyName: string): string {
        return getEnvSecretKey(envKeyName);
    }




    // ====================================================================================
    // ====================================================================================
    //? function to create token (email url)
    // 
    createEmailUrlToken(email: string, envKeyName: string, expiresInMs: number = 1200000): string {
        return createEmailUrlToken(email, envKeyName, expiresInMs);
    }

    // ------------------------------------------------------------------------------------
    // function to create token for  ( RESET password url)
    
    createResetPasswordUrlToken(email: string): string {
        return createResetPasswordUrlToken(email);
    }

    createResetPasswordUrlTokenWithVersion(email: string, passwordResetVersion: number): string {
        return createResetPasswordUrlTokenWithVersion(email, passwordResetVersion);
    }

    // ------------------------------------------------------------------------------------
    // function to create token for ( SET password url )  

    createSetPasswordUrlToken(email: string): string {
        return createSetPasswordUrlToken(email);
    }

    // ====================================================================================
    // ====================================================================================
    //? function to verify (url token)

    verifyUrlToken<T extends object>(token: string, secretKey: string): T | null {
        return verifyUrlToken<T>(token, secretKey);
    }

    // ----------------------------------------------------------------------------------
    // function to verify (url token from request)
    verifyUrlTokenFromRequest<T extends object>(req: RequestLike, secretKey: string): T | null {
        return verifyUrlTokenFromRequest<T>(req, secretKey);
    }


    // ====================================================================================
    // ====================================================================================
    //? function to verify (url token from request )
    // 

    verifyUrlTokenFromRequestWithEnvKey<T extends object>(req: RequestLike, envKeyName: string): T | null {
        return verifyUrlTokenFromRequestWithEnvKey<T>(req, envKeyName);
    }

    // ------------------------------------------------------------------------------------
    // function to verify (RESET password url token from request)

    verifyResetPasswordUrlTokenFromRequest<T extends object>(req: RequestLike): T | null {
        return verifyResetPasswordUrlTokenFromRequest<T>(req);
    }

    // -----------------------------------------------------------------------------------
    // function to verify (SET password url token from request)

    verifySetPasswordUrlTokenFromRequest<T extends object>(req: RequestLike): T | null {
        return verifySetPasswordUrlTokenFromRequest<T>(req);
    }

    //===========================================================================================================================================
    // Function to Create JWT
    //===========================================================================================================================================

    createJWTtoken(
        res: ResponseLike,
        tokenName: string,
        secretKey: string,
        components: { [key: string]: number | string | boolean },
        maximumAge: number,
        storeCookie: boolean
    ): string {

        // keep local validation (ensures ResponseLike is compatible)
        this.getCookieSetter(res);

        return createJWTtoken(res, tokenName, secretKey, components, maximumAge, storeCookie);
    }

    //===========================================================================================================================================
    // Function to remove a cookie
    //===========================================================================================================================================

    removeCookieToken(res: ResponseLike, tokenName: string): null {
        return removeCookieToken(res, tokenName);
    }

    //===========================================================================================================================================
    // Function to Extract a token data
    //============================================================================================================================================

    extractJWTData =  <tokentInterface>(req: RequestLike,  tokenName: string, secretKey: string): tokentInterface => {
        return extractJWTData<tokentInterface>(req, tokenName, secretKey);
    } 

    //===========================================================================================================================================
    // Function to get the user IP address and use it to get his location info
    //============================================================================================================================================

    getIPaddressAndUserLocation = async (req: RequestLike): Promise< userIPaddressAndLocation > =>{
        return getIPaddressAndUserLocation(req);
    }

    // =================================================================================================================================
    // Function that store the login attempts
    // =================================================================================================================================

    async loginAttempt(req: RequestLike, attemptSuccessful: boolean, userEmail: string):Promise<void>{
        return loginAttempt(req, attemptSuccessful, userEmail);
    }

    // =================================================================================================================================
    // Function to validate that user committing operation is authorized to do that (so no driver changes something for another driver)
    // (by operation her i mean changin bus data)
    // =================================================================================================================================

    async validateUserById(driverId: number, busId: string): Promise<true> {
        return validateUserById(driverId, busId);
    }

}

//=================================================================================================================================
export default AuthHelper;