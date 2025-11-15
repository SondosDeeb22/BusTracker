//==========================================================================================================
//? Import Sections
//==========================================================================================================

import {Request, Response } from 'express';


//import models
import BusModel from "../models/busModel";

//import Enums
import { status } from '../enums/busEnum';

import { UserHelper } from "../helpers/userHelper";
const helper = new UserHelper();


//===================================================================================================================================================


export class BusService{  

    //===================================================================================================
    //? function to Add Bus
    //===================================================================================================

    async addBus(req: Request, res: Response){

        
        await helper.add(req, res, BusModel, req.body, 
        {
            nonDuplicateFields: ['serialNumber'],
            enumFields: [{ field: "status", enumObj: status }],
        }
        );
    }

    //===================================================================================================
    //? function to Remove Bus
    //===================================================================================================

    async removeBus(req: Request, res: Response){
        await helper.remove(req, res, BusModel, 'id', req.body.id);
    }

    //===================================================================================================
    //? function to Update Bus
    //===================================================================================================
    
    async updateBus(req: Request, res: Response){
        await helper.update(req, res, BusModel, req.body, 
            {
                enumFields: [{ field: "status", enumObj: status }],
                //---------------------------------------------
                successMessage: 'Bus was updated',
            }
        );
    }
    
}