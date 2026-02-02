//==========================================================================================================
//? Import Sections
//==========================================================================================================

import {Request, Response } from 'express';


//import models
import BusModel from "../models/busModel";
import UserModel from "../models/userModel";
import RouteModel from "../models/routeModel";

//import Enums
import { status } from '../enums/busEnum';

import { ConflictError, NotFoundError, ValidationError } from '../errors';

import { UserHelper } from "../helpers/userHelper";
const helper = new UserHelper();

import { sendResponse } from '../exceptions/messageTemplate';


//===================================================================================================================================================


export class BusService{  

    //===================================================================================================
    //? function to Add Bus
    //===================================================================================================

    async addBus(req: Request, res: Response){

        
        try{
            await helper.add(BusModel, req.body,{
                nonDuplicateFields: ['plate'],
                enumFields: [{ field: "status", enumObj: status }],
            }
           );

           return sendResponse(res, 200, 'buses.success.added');
        //----------------------------------------------------------------
       }catch(error){
            console.error('Error occured while creating bus.', error);

            if (error instanceof ValidationError) {
                if (error.message === 'fillAllFields') return sendResponse(res, 400, 'common.errors.validation.fillAllFields');
                if (error.message === 'invalidField') return sendResponse(res, 400, 'common.errors.validation.invalidField');
                if (error.message === 'required') return sendResponse(res, 400, 'common.errors.validation.required');
                if (error.message === 'noData') return sendResponse(res, 400, 'common.errors.validation.noData');
                return sendResponse(res, 400, 'common.errors.validation.invalidField');
            }

            if (error instanceof ConflictError) {
                return sendResponse(res, 409, error.message);
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
    //? function to Remove Bus
    //===================================================================================================

    async removeBus(req: Request, res: Response){
        try {
            await helper.remove(BusModel, 'id', req.body.id);
            return sendResponse(res, 200, 'common.crud.removed');
        
     //======================================================
        } catch (error) {
            console.error('Error occured while removing bus.', error);

            if (error instanceof ValidationError) {
                if (error.message === 'required') return sendResponse(res, 400, 'common.errors.validation.required');
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
    //? function to Update Bus
    //===================================================================================================
    
    async updateBus(req: Request, res: Response){
        try {
            const result = await helper.update(BusModel, req.body, {
                enumFields: [{ field: "status", enumObj: status }]
            });
            return sendResponse(res, 200, result.updated ? 'common.crud.updated' : 'common.crud.noChanges');
        
        //======================================================
        } catch (error) {
            console.error('Error occured while updating bus.', error);

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
    //? function to Fetch All Buses
    //===================================================================================================

    async fetchAllBuses(req: Request, res: Response){
        try {
            const buses = await BusModel.findAll({
                attributes: ['id', 'plate', 'brand', 'status', 'assignedRoute', 'assignedDriver'],
                include: [
                    {
                        model: UserModel,
                        as: 'driver',
                        attributes: ['id', 'name', 'email'],
                        required: false
                    },
                    {
                        model: RouteModel,
                        as: 'route',
                        attributes: ['id', 'title'],
                        required: false
                    }
                ]
            });

            return sendResponse(res, 200, 'buses.success.fetched', buses);
        
        //======================================================
        } catch (error) {
            console.error('Error occured while fetching buses.', error);
            return sendResponse(res, 500, 'common.errors.internal');
        }
    }
    
}