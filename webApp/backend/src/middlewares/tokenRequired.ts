//=======================================================================================
//? Import
//=======================================================================================

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { JWTdata } from '../interfaces/helper&middlewareInterface';//  import JWT_data interface (which have the attributes stored in token)

// import exceptions --------------------------------------------------------------------
import { sendResponse } from "../exceptions/messageTemplate";


//=======================================================================================
//? Authentication functions:
// it ensures that only logged in users are able to access the routes
//=======================================================================================
export const accessRequireToken = ( tokenName: string) => {
  return (req: Request, res: Response, next: NextFunction): void  => {
    try {
      // take the token from the cookie 
      const token: string = req.cookies[tokenName];

      if(!token){
        sendResponse(res, 401, 'common.auth.sessionExpired');
        return ;
      }
      
      //check if JWT exists in .env file
      const jwtLoginKey = process.env.JWT_LOGIN_KEY;
      if (!jwtLoginKey) {
          console.error('JWT_LOGIN_KEY is not defined');
          sendResponse(res, 500, 'common.errors.internal');
          return;
      }

     // verifty the correctenss of the token
      const userData = jwt.verify(token, jwtLoginKey) as JWTdata;
      if(!userData || typeof userData !== "object"){
        sendResponse(res, 401, 'common.auth.invalidToken');
        return ;
      }

      // store user data in req.user
      req.user = {
        id: userData.userID,
        name: userData.userName,
        role: userData.userRole
      };
      

      next(); // Pass control to the next middleware/route

      //-------------------------------------------------------------------------------------
    } catch (error) {
      const errorName = (error as any)?.name;

      if (errorName === 'TokenExpiredError') {
        sendResponse(res, 401, 'common.auth.sessionExpired');
        return;
      }

      if (errorName === 'JsonWebTokenError' || errorName === 'NotBeforeError') {
        sendResponse(res, 401, 'common.auth.invalidToken');
        return;
      }

      console.error('Middleware error:', error);
      sendResponse(res, 500, 'common.errors.internal');
    }
  };
}









//=======================================================================================





