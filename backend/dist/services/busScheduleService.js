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
        // Extract JWT data to get user ID and name
        const jwtData = authHelper.extractJWTData(req, tokenNameEnum_1.tokenNames.loginToken);
        if (typeof jwtData === "string") {
            return (0, messageTemplate_1.sendResponse)(res, 401, jwtData);
        }
        const userId = jwtData.userID;
        // -------------------------------------------------------------
        await helper.add(req, res, busScheduleModel_1.default, req.body, {
            enumFields: [{ field: "day", enumObj: busScheduleEnum_1.weekDays }],
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
    }
    //===================================================================================================
    //? function to Update Bus Schedule
    //===================================================================================================
    async updateScheduleRecord(req, res) {
        // Extract JWT data to get user ID and name
        const jwtData = authHelper.extractJWTData(req, tokenNameEnum_1.tokenNames.loginToken);
        if (typeof jwtData === "string") {
            return (0, messageTemplate_1.sendResponse)(res, 401, jwtData);
        }
        const userId = jwtData.userID;
        await helper.update(req, res, busScheduleModel_1.default, req.body, {
            enumFields: [{ field: "day", enumObj: busScheduleEnum_1.weekDays, optional: true }],
            transform: async (data) => {
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
    async removeSchedulRecord(req, res) {
        await helper.remove(req, res, busScheduleModel_1.default, 'id', req.body.id);
    }
    // =================================================================================================================================
    //? fetch Bus schedule  (by Admin only)
    //===================================================================================================================    
    async getBusSchedule(req, res) {
        try {
            const busSchedule = await busScheduleModel_1.default.findAll({
                where: {
                    date: {
                        [sequelize_1.Op.gte]: new Date().setHours(0, 0, 0, 0)
                    }
                },
                include: [
                    {
                        model: userModel_1.default,
                        attributes: ['id', 'name'],
                        as: 'driver'
                    },
                    {
                        model: userModel_1.default,
                        attributes: ['id', 'name'],
                        as: 'creator'
                    },
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