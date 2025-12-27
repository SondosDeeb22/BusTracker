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
import { Op, literal } from "sequelize";
import { UserHelper } from "../helpers/userHelper";
const helper = new UserHelper();
import AuthHelper from "../helpers/authHelpher";
const authHelper = new AuthHelper();

//import enums
import { shiftType, weekDays } from "../enums/busScheduleEnum";

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
            // Validate enum inputs to prevent invalid day/shiftType values reaching DB.
            // `shiftType` is required when creating a schedule.
            enumFields: [{ field: "day", enumObj: weekDays }, { field: "shiftType", enumObj: shiftType }],
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
            // On update, allow partial payloads: day/shiftType are optional but must be valid if provided.
            enumFields: [{ field: "day", enumObj: weekDays, optional: true }, { field: "shiftType", enumObj: shiftType, optional: true }],
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
            // supports multi-field sorting via query param : date, driverName
            const sortParam = typeof req.query.sort === 'string' ? req.query.sort.trim() : '';

            // define the sorting schema  (take from user and format it) -------------------------------------------------------------------------------------------------
            
            // this responsible for changing  sortParameters taken from admin -> "date:desc,name:asc"
            // to this ->  [ { key: "date", dir: "DESC" }, { key: "name", dir: "ASC" } ]
            // so we can use it later to built sequlize order
            // strict-safe parsing (works with TS `noUncheckedIndexedAccess`)
            const parsedSort: Array<{ key: string; dir: 'ASC' | 'DESC' }> = [];
            if (sortParam) {
                const parts = sortParam
                    .split(',')
                    .map((p) => p.trim())
                    .filter(Boolean); //to clean the array from falsy values

                for (const part of parts) {
                    const segments = part.split(':').map((v) => v.trim());

                    const key = segments[0] ?? '';
                    if (!key) continue;
                    const rawDir = segments[1] ?? '';

                    const dir: 'ASC' | 'DESC' = rawDir.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
                    parsedSort.push({ key, dir });
                }
            }
            //--------------------------------------------------------------------------------------------------

            const order: any[] = [];

            // functino that apply default sorting order -----------------------------------------
            const pushDefaultOrder = () => {
                order.push(['date', 'DESC']);
                
                order.push([literal("FIELD(shiftType,'Morning','Afternoon','Evening')"), 'ASC']);// literal() creates raw SQL expresesion that sequelize'll embed verbatim into the query  (becuase sequalize doesn't model this specific db sql function)
                // enforces a domain-specific shift ordering (Morning -> Afternoon -> Evening) using raw SQL FIELD() via Sequelize literal() instead of alphabetical order.

                order.push([{ model: UserModel, as: 'driver' }, 'name', 'ASC']);
            };
            //--------------------------------------------------------------------------------------------------



            // apply default order when no sort provided-----------------------------------------
            if (parsedSort.length === 0) {
                pushDefaultOrder();
            } else {
                for (const { key, dir } of parsedSort) {
                    if (key === 'date') {
                        order.push(['date', dir]);
                        continue;
                    }

                    if (key === 'shiftType') {
                        order.push([literal("FIELD(shiftType,'Morning','Afternoon','Evening')"), dir]);
                        continue;
                    }

                    if (key === 'name' || key === 'driverName') {
                        order.push([{ model: UserModel, as: 'driver' }, 'name', dir]);
                        continue;
                    }
                }

                if (order.length === 0) {
                    pushDefaultOrder();
                }
            }

            const busSchedule = await BusScheduleModel.findAll({
                where: {
                    date: {
                        [Op.gte]: new Date().setHours(0, 0, 0, 0)
                    }
                },
                // needed for reliable ORDER BY on included model fields (driver.name) in Sequelize
                subQuery: false,
                order,
                include: [
                    // Driver -----------------------
                    {
                        model: UserModel,
                        attributes: ['id', 'name'],
                        as: 'driver'
                    },
                    // record crater -----------------------
                    {
                        model: UserModel,
                        attributes: ['id', 'name'],
                        as: 'creator'
                    },
                    // record Updater -----------------------
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
