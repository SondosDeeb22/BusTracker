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

import { tokenNames } from '../enums/tokenNameEnum';
import AuthService from './authService';
const authService = new AuthService();

const helper = new UserHelper();



//===================================================================================================



export class DriverService{  

    //===================================================================================================
    //? function to Add Driver
    //===================================================================================================

    // async addDriver(req: Request, res: Response){
    //     try{
    //         await helper.add(req, res, UserModel, req.body, {

    //             nonDuplicateFields: ['email'],  
    //             //-----------------------------------------------------------
    //             enumFields: [
    //                 { field: "status", enumObj: status },
    //                 { field: "role", enumObj: role },
    //                 { field: "gender", enumObj: gender }
    //             ],             
    //             //-----------------------------------------------------------

    //             transform: async (data) => {
    //             const out = { ...data };

    //             // normalize email
    //             if (out.email) out.email = out.email.toLowerCase().trim();


    //             return out;
    //             },
    //             skipResponse: true // Don't send response here, we'll send it after email
    //         }
    //         );

    //         // Send validation email after user is successfully added -------------------------------------------------------
    //         try{
    //             await authService.sendValidateEmail(req, res, req.body.email);
                
    //         }catch(error){
    //             console.log("Error occured while sending validation email ", error);
    //         }

    //         console.log("Driver added successfully. Validation email sent.");
    //         sendResponse(res, 200, "Driver added successfully. Validation email sent.");

    //     }catch(error){
    //         sendResponse(res, 500, `Error occured while adding driver from driverService.ts . ${error}`);
    //     }
    // }

    async addDriver(req: Request, res: Response) {
    try {
        const driver = await helper.add(req, res, UserModel, req.body, {
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
            skipResponse: true
        });

        // Send validation email
        await authService.sendValidateEmail(req, res, req.body.email);

        return sendResponse(res, 200, "Driver added successfully. Validation email sent.");
    }
    catch (error) {
        return sendResponse(res, 500, `Error occured while adding driver: ${error}`);
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
                ],
                //---------------------------------------------
                successMessage: 'Driver was updated',
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

            res.status(200).json({
                success: true,
                message: 'Drivers fetched successfully',
                data: drivers
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching drivers',
                error: error
            });
        }
    }



}