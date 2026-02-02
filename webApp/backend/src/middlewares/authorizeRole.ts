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
import { UnauthorizedError } from '../errors';


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
                
    let tokenData: JWTdata;
    
    // =======================================================
    try {
        tokenData = authHelper.extractJWTData<JWTdata>(req, loginToken, jwtLoginKey);

    // -------------------------------------------------------------------------
    } catch (error) {
        if (error instanceof UnauthorizedError) {
            sendResponse(res, 401, error.message);
            return;
        }
        sendResponse(res, 500, 'common.errors.internal');
        return;
    }
    // =======================================================

    // check the user role
    if(tokenData.userRole !== role){
        sendResponse(res, 403, 'common.errors.forbidden');
        return ;
    }
    
    next();

    }
}