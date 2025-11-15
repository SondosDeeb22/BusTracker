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

const helper = new UserHelper();



//===================================================================================================



export class DriverService{  

    //===================================================================================================
    //? function to Add Driver
    //===================================================================================================

    async addDriver(req: Request, res: Response){
        await helper.add(req, res, UserModel, req.body, {

            nonDuplicateFields: ['email'],  
            //-----------------------------------------------------------
            enumFields: [
                { field: "status", enumObj: status },
                { field: "role", enumObj: role },
                { field: "gender", enumObj: gender }
            ],             
            //-----------------------------------------------------------

            transform: async (data) => {
            const out = { ...data };

            // normalize email
            if (out.email) out.email = out.email.toLowerCase().trim();

            // hash password if present
            if (out.hashedPassword) {
                const saltRounds = 10;
                out.hashedPassword = await bcrypt.hash(out.hashedPassword, saltRounds);
            }

            return out;
            },
        }
        );
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



}