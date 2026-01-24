//===================================================================================================
//? Importing
//===================================================================================================

import {Request, Response } from 'express';
//import models
import UserModel from "../models/userModel";

//import Enums
import {role, gender, status} from '../enums/userEnum';
import { UserHelper } from "../helpers/userHelper";
import bcrypt from 'bcrypt';

// import exceptions --------------------------------------------------------------------
import { sendResponse } from "../exceptions/messageTemplate";

import { sendEmail } from "../helpers/sendEmail";
import  AuthHelper  from '../helpers/authHelpher';
const authHelper = new AuthHelper();

import AuthService from './authService';
const authService = new AuthService();

const helper = new UserHelper();



//===================================================================================================



export class DriverService{  

    async addDriver(req: Request, res: Response) {
    try {
        await helper.add(req, res, UserModel, req.body, {
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
    }
    catch (error) {
        console.error('Error occured while adding driver.', error);
        return sendResponse(res, 500, 'common.errors.internal');
    }
}



    //===================================================================================================
    //? function to Remove Driver
    //===================================================================================================

    async removeDriver(req: Request, res: Response){
        await helper.remove(req, res, UserModel, 'id', req.body.id);
    }

    //===================================================================================================
    //? function to Update Driver
    //===================================================================================================
    async updateDriver(req: Request, res: Response){
        await helper.update(req, res, UserModel, req.body, 
            {
                enumFields: [{ field: "status", enumObj: status },
                    { field: "role", enumObj: role }, 
                    { field: "gender", enumObj: gender }
                ]
            }
        );
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
        } catch (error) {
            console.error('Error occured while fetching drivers.', error);
            return sendResponse(res, 500, 'common.errors.internal');
        }
    }



}