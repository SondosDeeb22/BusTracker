//===================================================================================================
//? Importing
//===================================================================================================

import { Request, Response } from 'express';

//import models
import BusScheduleModel from "../models/busScheduleModel";
import UserModel from "../models/userModel";
import RouteModel from "../models/routeModel";
import BusModel from "../models/busModel";

//import helpers
import { sendResponse } from "../exceptions/messageTemplate";
import { Op } from "sequelize";
import { UserHelper } from "../helpers/userHelper";
const helper = new UserHelper();
import AuthHelper from "../helpers/authHelpher";
const authHelper = new AuthHelper();

//import enums
import { weekDays } from "../enums/busScheduleEnum";

//import interfaces
import { JWTdata } from "../interfaces/helper&middlewareInterface";

//import enums
import {loginToken} from "../enums/tokenNameEnum";

//===================================================================================================

export class BusScheduleService {

    //===================================================================================================
    //? function to Add Bus Schedule
    //===================================================================================================

    async addScheduleRecord(req: Request, res: Response) {
        // Extract JWT data to get user ID and name
        //check if JWT exists in .env file
        const jwtLoginKey = process.env.JWT_LOGIN_KEY;
        if (!jwtLoginKey) {
            sendResponse(res, 500, `JWT_LOGIN_KEY is not defined : ${jwtLoginKey}`);
        return;
        }
        const jwtData = authHelper.extractJWTData<JWTdata>(req, loginToken, jwtLoginKey);
        
        if (typeof jwtData === "string") {
            return sendResponse(res, 401, jwtData);
        }

        const userId = jwtData.userID;
        
        // -------------------------------------------------------------
        
        await helper.add(req, res, BusScheduleModel, req.body, {
            enumFields: [{ field: "day", enumObj: weekDays }],
            transform: async (data: any) => {
                // Add createdBy and createdAt
                return {
                    ...data,
                    date: new Date(data.date),
                    createdAt: new Date(),
                    createdBy: userId
                };
            }
        });
    }

    //===================================================================================================
    //? function to Update Bus Schedule
    //===================================================================================================

    async updateScheduleRecord(req: Request, res: Response) {
        // Extract JWT data to get user ID and name

        //check if JWT exists in .env file
        const jwtLoginKey = process.env.JWT_LOGIN_KEY;
        if (!jwtLoginKey) {
            sendResponse(res, 500, `JWT_LOGIN_KEY is not defined : ${jwtLoginKey}`);
        return;
        }

        const jwtData = authHelper.extractJWTData<JWTdata>(req, loginToken, jwtLoginKey );
        
        if (typeof jwtData === "string") {
            return sendResponse(res, 401, jwtData);
        }
        
        const userId = jwtData.userID;
        
        await helper.update(req, res, BusScheduleModel, req.body, {
            enumFields: [{ field: "day", enumObj: weekDays, optional: true }],
            transform: async (data: any) => {
                // Add updatedBy and updatedAt
                return {
                    ...data,
                    ...(data.date && { date: new Date(data.date) }),
                    updatedAt: new Date(),
                    updatedBy: userId
                };
            },
            successMessage: 'Schedule was updated successfully'
        });
    }

    //===================================================================================================
    //? function to Remove Bus Schedule
    //===================================================================================================

    async removeSchedulRecord(req: Request, res: Response) {
        await helper.remove(req, res, BusScheduleModel, 'id', req.body.id);
    }


        // =================================================================================================================================
    //? fetch Bus schedule  (by Admin only)
    //===================================================================================================================    

    async getBusSchedule(req: Request, res: Response){
        try{
            const busSchedule = await BusScheduleModel.findAll({
                where: {
                    date: {
                        [Op.gte]: new Date().setHours(0, 0, 0, 0)
                    }
                },
                include: [
                    {
                        model: UserModel,
                        attributes: ['id', 'name'],
                        as: 'driver'
                    },
                    {
                        model: UserModel,
                        attributes: ['id', 'name'],
                        as: 'creator'
                    },
                    {
                        model: UserModel,
                        attributes: ['id', 'name'],
                        as: 'updater'
                    },
                    {
                        model: RouteModel,
                        attributes: ['id', 'title'],
                        as: 'route'
                    }
                ]
            })

            // Return response with bus schedule data or appropriate message if no schedules found
            if( busSchedule && busSchedule.length > 0){
                res.status(200).json({data: busSchedule});
            }else{
                res.status(200).json({message: 'No bus schedules found'})
            }
            

        //====================================================================
        }catch(error){
            sendResponse(res, 500, `Error occured while fetching bus schedule ${error}`);
            return;
            
        }
    }

}
