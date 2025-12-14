//===================================================================================================
//? Importing
//===================================================================================================

import {Request, Response } from 'express';

//import models
import userModel from "../models/userModel";

//import Enums
import {status } from '../enums/stationEnum';

import {loginToken} from '../enums/tokenNameEnum';

//import interfaces
import { JWTdata } from "../interfaces/helper&middlewareInterface";

// import helpers
import { UserHelper } from "../helpers/userHelper";
const userhelper = new UserHelper();

import { BusService } from './busService';
const busService = new BusService();

import authHleper from '../helpers/authHelpher';
const authHelper = new authHleper();

import { Op } from 'sequelize';

import { sendResponse } from "../exceptions/messageTemplate";
import BusScheduleModel from '../models/busScheduleModel';
import RouteModel from '../models/routeModel';

//===================================================================================================



export class UserService{
    //===================================================================================================
    //? function to change app language
    //===================================================================================================

    async changeLanguage(req: Request, res: Response){
        
        try{
            const body = req.body;

            //check if JWT exists in .env file
            const jwtLoginKey = process.env.JWT_LOGIN_KEY;
            if (!jwtLoginKey) {
                sendResponse(res, 500, `JWT_LOGIN_KEY is not defined : ${jwtLoginKey}`);
            return;
            }
            
            const userData = authHelper.extractJWTData<JWTdata>(req, loginToken, jwtLoginKey);
        
            if(typeof userData === "string"){ // when userData is string (so it's not object that contains users data ). then, we  return the error message and stop the function 
                    sendResponse(res, 500, userData);// userData here is Error message , check authHelper.ts file
                    return;
                }

            if(typeof userData === "string"){ 
                sendResponse(res, 500, userData);
                return;
            }

            // await userhelper.update(req, res, userModel, 'id', userData.userID, {language: body.language} )
            await userhelper.update(req, res, userModel, {language: body.language} )

        }catch(error){
        sendResponse(res, 500, `Error occured while changing language. ${error}`);
        return;
    }

    }


    //===================================================================================================
    //? function to change app apperacne 
    //===================================================================================================

    async changeAppearance(req: Request, res: Response){
        try{
            const body = req.body;

            //check if JWT exists in .env file
            const jwtLoginKey = process.env.JWT_LOGIN_KEY;
            if (!jwtLoginKey) {
                sendResponse(res, 500, `JWT_LOGIN_KEY is not defined : ${jwtLoginKey}`);
            return;
            }
            
            const userData = authHelper.extractJWTData<JWTdata>(req, loginToken, jwtLoginKey);

            if(typeof userData === "string"){ 
                sendResponse(res, 500, userData);
                return;
            }

            // await userhelper.update(req, res, userModel, 'id', userData.userID, {appearance: body.appearance} )

            await userhelper.update(req, res, userModel,  {appearance: body.appearance} )

        }catch(error){
            sendResponse(res, 500, `Error occured while changing appearance. ${error}`);
            return;
        }
    }

    // =================================================================================================================================
    //? change route (by driver)
    //===================================================================================================================    

    async changeRoute(req: Request, res: Response){
        try{
            const legitDriver = await authHelper.validateUser(req, res, req.body.id);
        
            if(!legitDriver){
                return;
            }

            await busService.updateBus(req, res);
        //====================================================================
        }catch(error){
            sendResponse(res, 500, `Error occured while changing route. ${error}`);
            return;
        }
    }


    // =================================================================================================================================
    //? start/ stop bus (by driver)
    //===================================================================================================================    

    async updateBusStatus(req: Request, res: Response){
        try{
            const legitDriver = await authHelper.validateUser(req, res, req.body.id);
        
            if(!legitDriver){
                return;
            }

            await busService.updateBus(req, res)
        //====================================================================
        }catch(error){
            sendResponse(res, 500, `Error occured while changing route. ${error}`);
            return;
        }
    }

}