//=======================================================================================
//? Import
//=======================================================================================

import { Request, Response, NextFunction } from 'express';

//import interfaces
import { JWTdata } from "../interfaces/helper&middlewareInterface"; // it defiens the structure for the token 

//import enums
import { loginToken } from '../enums/tokenNameEnum';

//import helpers
import AuthHelper from '../helpers/authHelpher';
const authHelper = new AuthHelper();

// import exceptions --------------------------------------------------------------------
import { sendResponse } from "../exceptions/messageTemplate";


//=======================================================================================
//? function that will protect cetain pages from unauthorized access 
// strict the access for some page 
// used Middlwares Factory 
//=======================================================================================

export const authorizeRole = (role: string) => {
    return (req: Request, res: Response, next: NextFunction): void=>{

    // Get the user data from the token

    //check if JWT exists in .env file
    const jwtLoginKey = process.env.JWT_LOGIN_KEY;
    if (!jwtLoginKey) {
        sendResponse(res, 500, 'common.errors.internal');
        return;
    }
                
    const tokenData = authHelper.extractJWTData<JWTdata>(req, loginToken,jwtLoginKey);
    if(typeof tokenData === "string"){ // when userData is string (so it's not object that contains users data ). then, we  return the error message and stop the function 
        sendResponse(res, 401, tokenData);
        return;
    }

    // check the user role
    if(tokenData.userRole !== role){
        sendResponse(res, 403, 'common.errors.forbidden');
        return ;
    }
    
    next();

    }
}