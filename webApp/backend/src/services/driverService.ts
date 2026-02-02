//===================================================================================================
//? Importing
//===================================================================================================

import {Request, Response } from 'express';
//import models
import UserModel from "../models/userModel";

//import Enums
import {role, gender, status} from '../enums/userEnum';


// import exceptions 
import { sendResponse } from "../exceptions/messageTemplate";

import { ConflictError, NotFoundError, ValidationError } from '../errors';

// services 
import AuthService from './authService';
const authService = new AuthService();

// helpers 
import { UserHelper } from "../helpers/userHelper";
const helper = new UserHelper();



//===================================================================================================

export class DriverService{  

    async addDriver(req: Request, res: Response) {
        try {
            await helper.add(UserModel, req.body, {
                nonDuplicateFields: ['email'],
                enumFields: [
                    { field: "status", enumObj: status },
                    { field: "role", enumObj: role },
                    { field: "gender", enumObj: gender }
                ],
                transform: async (data) => {
                    const out = { ...data };
                    if (out.email) out.email = out.email.toLowerCase().trim();
                    if (!out.status) out.status = status.active;
                    return out;
                },
            });

            // Send validation email
            await authService.sendValidateEmail(res, req.body.email);

            return sendResponse(res, 200, 'drivers.success.added');

        //======================================================
        } catch (error) {
            console.error('Error occured while adding driver.', error);

            if (error instanceof ValidationError) {
                if (error.message === 'fillAllFields') return sendResponse(res, 400, 'common.errors.validation.fillAllFields');
                if (error.message === 'invalidField') return sendResponse(res, 400, 'common.errors.validation.invalidField');
                if (error.message === 'required') return sendResponse(res, 400, 'common.errors.validation.required');
                if (error.message === 'noData') return sendResponse(res, 400, 'common.errors.validation.noData');
                return sendResponse(res, 400, 'common.errors.validation.invalidField');
            }

            if (error instanceof ConflictError) {
                return sendResponse(res, 409, 'common.errors.validation.duplicateEmail');
            }

            if (error instanceof NotFoundError) {
                return sendResponse(res, 404, 'common.crud.notFound');
            }

            return sendResponse(res, 500, 'common.errors.internal');
        }
    }



    //===================================================================================================
    //? function to Remove Driver
    //===================================================================================================

    async removeDriver(req: Request, res: Response){
        try {
            await helper.remove(UserModel, 'id', req.body.id);
            return sendResponse(res, 200, 'common.crud.removed');
        
        // ======================================================================
        } catch (error) {
            console.error('Error occured while removing driver.', error);

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
    //? function to Update Driver
    //===================================================================================================
    async updateDriver(req: Request, res: Response){
        try {
            const result = await helper.update(UserModel, req.body, {
                enumFields: [
                    { field: "status", enumObj: status },
                    { field: "role", enumObj: role },
                ]
            });

            return sendResponse(res, 200, result.updated ? 'common.crud.updated' : 'common.crud.noChanges');
        } catch (error) {
            console.error('Error occured while updating driver.', error);

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
    //? function to Fetch All Drivers
    //===================================================================================================

    async fetchAllDrivers(req: Request, res: Response){
        try {
            const drivers = await UserModel.findAll({
                where: { role: role.driver },
                attributes: ['id', 'name', 'phone', 'email', 'licenseNumber', 'licenseExpiryDate', 'status']
            });

            return sendResponse(res, 200, 'drivers.success.fetched', drivers);
            
        // ======================================================================
        } catch (error) {
            console.error('Error occured while fetching drivers.', error);
            return sendResponse(res, 500, 'common.errors.internal');
        }
    }



}