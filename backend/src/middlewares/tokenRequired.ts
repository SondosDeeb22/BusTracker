//=======================================================================================
//? Import
//=======================================================================================

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { JWTdata } from '../interfaces/helper&middlewareInterface';//  import JWT_data interface (which have the attributes stored in token)
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
        console.log("Session expired, Please log in again")
        res.status(401).json({message: "Session expired, Please log in again"});
        return ;
      }
      //check JWT key exists in the database
      const JWTkey = process.env.JWT_KEY;
      if(!JWTkey){
          console.error("Internal Error! missing token key in environment file");
          res.status(500).json({message: "Internal Error! missing token key in environment file"});
          return ;
      }

      // verifty the correctenss of the token
      const userData = jwt.verify(token, JWTkey) as JWTdata;
      if(!userData || typeof userData !== "object"){
        console.log("Invalid JWT token");
        res.status(401).json({message: "Invalid JWT token"});
        return ;
      }
      

      next(); // Pass control to the next middleware/route

      //-------------------------------------------------------------------------------------
    } catch (error) {
      console.error('Middleware error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
}









//=======================================================================================





