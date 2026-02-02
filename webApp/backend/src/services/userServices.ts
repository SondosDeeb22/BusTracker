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

import { ForbiddenError, NotFoundError, UnauthorizedError, ValidationError } from '../errors';

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
                console.error('JWT_LOGIN_KEY is not defined');
                sendResponse(res, 500, 'common.errors.internal');
                return;
            }
            
            const userData = authHelper.extractJWTData<JWTdata>(req, loginToken, jwtLoginKey);

            const result = await userhelper.update(userModel, { id: userData.userID, language: body.language });
            return sendResponse(res, 200, result.updated ? 'common.crud.updated' : 'common.crud.noChanges');

        //=========================================================================================     
        }catch(error){
            console.error('Error occured while changing language.', error);
            if (error instanceof UnauthorizedError) {
                return sendResponse(res, 401, error.message);
            }
            if (error instanceof ValidationError) {
                if (error.message === 'required') return sendResponse(res, 400, 'common.errors.validation.required');
                if (error.message === 'noData') return sendResponse(res, 400, 'common.errors.validation.noData');
                if (error.message === 'invalidField') return sendResponse(res, 400, 'common.errors.validation.invalidField');
                return sendResponse(res, 400, 'common.errors.validation.invalidField');
            }
            if (error instanceof NotFoundError) {
                return sendResponse(res, 404, 'common.crud.notFound');
            }
            if (error instanceof Error) {
                if (error.message.startsWith('common.')) {
                    return sendResponse(res, 500, error.message);
                }
            }
            return sendResponse(res, 500, 'common.errors.internal');
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
                console.error('JWT_LOGIN_KEY is not defined');
                sendResponse(res, 500, 'common.errors.internal');
                return;
            }
            
            const userData = authHelper.extractJWTData<JWTdata>(req, loginToken, jwtLoginKey);

            const result = await userhelper.update(userModel, { id: userData.userID, appearance: body.appearance });
            return sendResponse(res, 200, result.updated ? 'common.crud.updated' : 'common.crud.noChanges');

        //===============================================     
        }catch(error){
            console.error('Error occured while changing appearance.', error);
            if (error instanceof UnauthorizedError) {
                return sendResponse(res, 401, error.message);
            }
            if (error instanceof ValidationError) {
                if (error.message === 'required') return sendResponse(res, 400, 'common.errors.validation.required');
                if (error.message === 'noData') return sendResponse(res, 400, 'common.errors.validation.noData');
                if (error.message === 'invalidField') return sendResponse(res, 400, 'common.errors.validation.invalidField');
                return sendResponse(res, 400, 'common.errors.validation.invalidField');
            }
            if (error instanceof NotFoundError) {
                return sendResponse(res, 404, 'common.crud.notFound');
            }
            if (error instanceof Error) {
                if (error.message.startsWith('common.')) {
                    return sendResponse(res, 500, error.message);
                }
            }
            return sendResponse(res, 500, 'common.errors.internal');
        }
    }


    // =================================================================================================================================
    //? change route (by driver)
    //===================================================================================================================    

    async changeRoute(req: Request, res: Response){
        try{
            await authHelper.validateUser(req, req.body.id);

            await busService.updateBus(req, res);
        //====================================================================
        }catch(error){
            console.error('Error occured while changing route.', error);
            if (error instanceof UnauthorizedError) {
                return sendResponse(res, 401, error.message);
            }
            if (error instanceof ForbiddenError) {
                return sendResponse(res, 403, error.message);
            }
            if (error instanceof Error) {
                if (error.message.startsWith('common.')) {
                    return sendResponse(res, 500, error.message);
                }
            }
            return sendResponse(res, 500, 'common.errors.internal');
        }
    }


    // =================================================================================================================================
    //? start/ stop bus (by driver)
    //===================================================================================================================    

    async updateBusStatus(req: Request, res: Response){
        try{
            await authHelper.validateUser(req, req.body.id);

            await busService.updateBus(req, res)
        //====================================================================
        }catch(error){
            console.error('Error occured while updating bus status.', error);
            if (error instanceof UnauthorizedError) {
                return sendResponse(res, 401, error.message);
            }
            if (error instanceof ForbiddenError) {
                return sendResponse(res, 403, error.message);
            }
            if (error instanceof Error) {
                if (error.message.startsWith('common.')) {
                    return sendResponse(res, 500, error.message);
                }
            }
            return sendResponse(res, 500, 'common.errors.internal');
        }
    }

}