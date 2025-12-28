"use strict";
//===================================================================================================
//? Importing
//===================================================================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusScheduleService = void 0;
//import models
const busScheduleModel_1 = __importDefault(require("../models/busScheduleModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const routeModel_1 = __importDefault(require("../models/routeModel"));
//import helpers
const messageTemplate_1 = require("../exceptions/messageTemplate");
const sequelize_1 = require("sequelize");
const userHelper_1 = require("../helpers/userHelper");
const helper = new userHelper_1.UserHelper();
const authHelpher_1 = __importDefault(require("../helpers/authHelpher"));
const authHelper = new authHelpher_1.default();
//import enums
const busScheduleEnum_1 = require("../enums/busScheduleEnum");
//import enums
const tokenNameEnum_1 = require("../enums/tokenNameEnum");
//===================================================================================================
class BusScheduleService {
    //===================================================================================================
    //? function to Add Bus Schedule
    //===================================================================================================
    async addScheduleRecord(req, res) {
        try {
            // Extract JWT data to get user ID and name
            //check if JWT exists in .env file
            const jwtLoginKey = process.env.JWT_LOGIN_KEY;
            if (!jwtLoginKey) {
                (0, messageTemplate_1.sendResponse)(res, 500, `JWT_LOGIN_KEY is not defined : ${jwtLoginKey}`);
                return;
            }
            const jwtData = authHelper.extractJWTData(req, tokenNameEnum_1.loginToken, jwtLoginKey);
            if (typeof jwtData === "string") {
                return (0, messageTemplate_1.sendResponse)(res, 401, jwtData);
            }
            const userId = jwtData.userID;
            // ensure no clashes case will occure -----------------------------------------------------------------------
            //- no driver assigned to two buses at the same shift in the same date
            //- the bus is not assingned to more than one driver and route during the same shift of the day 
            const scheduleDate = new Date(req.body.date);
            const driverConflict = await busScheduleModel_1.default.findOne({
                where: {
                    date: scheduleDate,
                    shiftType: req.body.shiftType,
                    driverId: req.body.driverId,
                },
                attributes: ['id'],
            });
            if (driverConflict) {
                return (0, messageTemplate_1.sendResponse)(res, 500, 'This driver already has a schedule for the selected date and shift.');
            }
            //-------------------
            const busConflict = await busScheduleModel_1.default.findOne({
                where: {
                    date: scheduleDate,
                    shiftType: req.body.shiftType,
                    busId: req.body.busId,
                },
                attributes: ['id'],
            });
            if (busConflict) {
                return (0, messageTemplate_1.sendResponse)(res, 500, 'This bus is already assigned for the selected date and shift.');
            }
            // add the record-------------------------------------------------------------     
            await helper.add(req, res, busScheduleModel_1.default, req.body, {
                // Validate enum inputs to prevent invalid day/shiftType values reaching DB.
                // `shiftType` is required when creating a schedule.
                enumFields: [{ field: "day", enumObj: busScheduleEnum_1.weekDays }, { field: "shiftType", enumObj: busScheduleEnum_1.shiftType }],
                transform: async (data) => {
                    // Add createdBy and createdAt
                    return {
                        ...data,
                        date: new Date(data.date),
                        createdAt: new Date(),
                        createdBy: userId
                    };
                }
            });
            // -------------------------------------------------------------
        }
        catch (error) {
            console.error("Error Found while adding schedule's record", error);
            return (0, messageTemplate_1.sendResponse)(res, 500, "Error Found while adding schedule's record");
        }
    }
    //===================================================================================================
    //? function to Remove Bus Schedule
    //===================================================================================================
    async removeSchedulRecord(req, res) {
        await helper.remove(req, res, busScheduleModel_1.default, 'id', req.body.id);
    }
    //===================================================================================================
    //? function to Update Bus Schedule
    //===================================================================================================
    async updateScheduleRecord(req, res) {
        // Extract JWT data to get user ID and name
        //check if JWT exists in .env file ---------------------------------------------
        const jwtLoginKey = process.env.JWT_LOGIN_KEY;
        if (!jwtLoginKey) {
            (0, messageTemplate_1.sendResponse)(res, 500, `JWT_LOGIN_KEY is not defined : ${jwtLoginKey}`);
            return;
        }
        // Extract user info from JWT --------------------------------------------------------------------------------
        const jwtData = authHelper.extractJWTData(req, tokenNameEnum_1.loginToken, jwtLoginKey);
        if (typeof jwtData === "string") {
            return (0, messageTemplate_1.sendResponse)(res, 401, jwtData);
        }
        const userId = jwtData.userID;
        // get the schedule Id and verify it exists -------------------------------------------------------------------------------
        const scheduleId = req.body?.id;
        if (!scheduleId) {
            return (0, messageTemplate_1.sendResponse)(res, 500, 'No schedule id were found');
        }
        const current = await busScheduleModel_1.default.findOne({
            where: { id: scheduleId },
            attributes: ['id', 'date', 'shiftType', 'driverId', 'busId'],
        });
        if (!current) {
            return (0, messageTemplate_1.sendResponse)(res, 500, 'No schedule found with this id!');
        }
        const nextDate = req.body?.date ? new Date(req.body.date) : current.date;
        const nextShiftType = req.body?.shiftType ?? current.shiftType;
        const nextDriverId = req.body?.driverId ?? current.driverId;
        const nextBusId = req.body?.busId ?? current.busId;
        // check for driver conflict ----------------------------------------------------------------------------------------------------------------
        const driverConflict = await busScheduleModel_1.default.findOne({
            where: {
                date: nextDate,
                shiftType: nextShiftType,
                driverId: nextDriverId,
                id: { [sequelize_1.Op.ne]: scheduleId },
            },
            attributes: ['id'],
        });
        if (driverConflict) {
            return (0, messageTemplate_1.sendResponse)(res, 500, 'This driver already has a schedule for the selected date and shift');
        }
        //-------------------------------
        const busConflict = await busScheduleModel_1.default.findOne({
            where: {
                date: nextDate,
                shiftType: nextShiftType,
                busId: nextBusId,
                id: { [sequelize_1.Op.ne]: scheduleId },
            },
            attributes: ['id'],
        });
        if (busConflict) {
            return (0, messageTemplate_1.sendResponse)(res, 500, 'This bus is already assigned for the selected date and shift');
        }
        //--------------------------------------------------------------------------------------------
        await helper.update(req, res, busScheduleModel_1.default, req.body, {
            // On update, allow partial payloads: day/shiftType are optional but must be valid if provided.
            enumFields: [{ field: "day", enumObj: busScheduleEnum_1.weekDays, optional: true }, { field: "shiftType", enumObj: busScheduleEnum_1.shiftType, optional: true }],
            transform: async (data) => {
                // Add updatedBy and updatedAt
                return {
                    ...data,
                    ...(data.date && { date: new Date(data.date) }),
                    updatedAt: new Date(),
                    updatedBy: userId
                };
            }
        });
    }
    // =================================================================================================================================
    //? fetch Bus schedule  (by Admin only)
    //===================================================================================================================    
    async getBusSchedule(req, res) {
        try {
            // supports multi-field sorting via query param : date, driverName
            const sortParam = typeof req.query.sort === 'string' ? req.query.sort.trim() : '';
            // define the sorting schema  (take from user and format it) -------------------------------------------------------------------------------------------------
            // this responsible for changing  sortParameters taken from admin -> "date:desc,name:asc"
            // to this ->  [ { key: "date", dir: "DESC" }, { key: "name", dir: "ASC" } ]
            // so we can use it later to built sequlize order
            // strict-safe parsing (works with TS `noUncheckedIndexedAccess`)
            const parsedSort = [];
            if (sortParam) {
                const parts = sortParam
                    .split(',')
                    .map((p) => p.trim())
                    .filter(Boolean); //to clean the array from falsy values
                for (const part of parts) {
                    const segments = part.split(':').map((v) => v.trim());
                    const key = segments[0] ?? '';
                    if (!key)
                        continue;
                    const rawDir = segments[1] ?? '';
                    const dir = rawDir.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
                    parsedSort.push({ key, dir });
                }
            }
            //--------------------------------------------------------------------------------------------------
            const order = [];
            // functino that apply default sorting order -----------------------------------------
            const pushDefaultOrder = () => {
                order.push(['date', 'DESC']);
                order.push([(0, sequelize_1.literal)("FIELD(shiftType,'Morning','Afternoon','Evening')"), 'ASC']); // literal() creates raw SQL expresesion that sequelize'll embed verbatim into the query  (becuase sequalize doesn't model this specific db sql function)
                // enforces a domain-specific shift ordering (Morning -> Afternoon -> Evening) using raw SQL FIELD() via Sequelize literal() instead of alphabetical order.
                order.push([{ model: userModel_1.default, as: 'driver' }, 'name', 'ASC']);
            };
            //--------------------------------------------------------------------------------------------------
            // apply default order when no sort provided-----------------------------------------
            if (parsedSort.length === 0) {
                pushDefaultOrder();
            }
            else {
                for (const { key, dir } of parsedSort) {
                    if (key === 'date') {
                        order.push(['date', dir]);
                        continue;
                    }
                    if (key === 'shiftType') {
                        order.push([(0, sequelize_1.literal)("FIELD(shiftType,'Morning','Afternoon','Evening')"), dir]);
                        continue;
                    }
                    if (key === 'name' || key === 'driverName') {
                        order.push([{ model: userModel_1.default, as: 'driver' }, 'name', dir]);
                        continue;
                    }
                }
                if (order.length === 0) {
                    pushDefaultOrder();
                }
            }
            const busSchedule = await busScheduleModel_1.default.findAll({
                where: {
                    date: {
                        [sequelize_1.Op.gte]: new Date().setHours(0, 0, 0, 0)
                    }
                },
                // needed for reliable ORDER BY on included model fields (driver.name) in Sequelize
                subQuery: false,
                order,
                include: [
                    // Driver -----------------------
                    {
                        model: userModel_1.default,
                        attributes: ['id', 'name'],
                        as: 'driver'
                    },
                    // record crater -----------------------
                    {
                        model: userModel_1.default,
                        attributes: ['id', 'name'],
                        as: 'creator'
                    },
                    // record Updater -----------------------
                    {
                        model: userModel_1.default,
                        attributes: ['id', 'name'],
                        as: 'updater'
                    },
                    {
                        model: routeModel_1.default,
                        attributes: ['id', 'title'],
                        as: 'route'
                    }
                ]
            });
            // Return response with bus schedule data or appropriate message if no schedules found
            if (busSchedule && busSchedule.length > 0) {
                res.status(200).json({ data: busSchedule });
            }
            else {
                res.status(200).json({ message: 'No bus schedules found' });
            }
            //====================================================================
        }
        catch (error) {
            (0, messageTemplate_1.sendResponse)(res, 500, `Error occured while fetching bus schedule ${error}`);
            return;
        }
    }
}
exports.BusScheduleService = BusScheduleService;
//# sourceMappingURL=busScheduleService.js.map