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


import { sendResponse } from '../exceptions/messageTemplate';


//===================================================================================================================================================


export class BusService{  

    //===================================================================================================
    //? function to Add Bus
    //===================================================================================================

    async addBus(req: Request, res: Response){

        
        try{
            await helper.add(req, res, BusModel, req.body,{
                nonDuplicateFields: ['plate'],
                enumFields: [{ field: "status", enumObj: status }],
            }
           );

           sendResponse(res, 200, 'buses.success.added');
        //----------------------------------------------------------------
       }catch(error){
            console.error('Error occured while creating bus.', error);
            sendResponse(res, 500, 'common.errors.internal');
       }
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
                enumFields: [{ field: "status", enumObj: status }]
            }
        );
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
        } catch (error) {
            console.error('Error occured while fetching buses.', error);
            return sendResponse(res, 500, 'common.errors.internal');
        }
    }
    
}