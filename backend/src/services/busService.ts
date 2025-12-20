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

    //===================================================================================================
    //? function to Fetch All Buses
    //===================================================================================================

    async fetchAllBuses(req: Request, res: Response){
        try {
            const buses = await BusModel.findAll({
                attributes: ['id', 'serialNumber', 'brand', 'status', 'assignedRoute', 'assignedDriver'],
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

            res.status(200).json({
                success: true,
                message: 'Buses fetched successfully',
                data: buses
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching buses',
                error: error
            });
        }
    }
    
}