"use strict";
//==========================================================================================================
//? Import Sections
//==========================================================================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusService = void 0;
//import models
const busModel_1 = __importDefault(require("../models/busModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const routeModel_1 = __importDefault(require("../models/routeModel"));
//import Enums
const busEnum_1 = require("../enums/busEnum");
const userHelper_1 = require("../helpers/userHelper");
const helper = new userHelper_1.UserHelper();
const messageTemplate_1 = require("../exceptions/messageTemplate");
//===================================================================================================================================================
class BusService {
    //===================================================================================================
    //? function to Add Bus
    //===================================================================================================
    async addBus(req, res) {
        try {
            await helper.add(req, res, busModel_1.default, req.body, {
                nonDuplicateFields: ['serialNumber'],
                enumFields: [{ field: "status", enumObj: busEnum_1.status }],
            });
            (0, messageTemplate_1.sendResponse)(res, 200, "Bus was Added successfully");
            //----------------------------------------------------------------
        }
        catch (error) {
            console.error("Error Found while creating bus", error);
            (0, messageTemplate_1.sendResponse)(res, 500, `Error Found while creating bus ${error}`);
        }
    }
    //===================================================================================================
    //? function to Remove Bus
    //===================================================================================================
    async removeBus(req, res) {
        await helper.remove(req, res, busModel_1.default, 'id', req.body.id);
    }
    //===================================================================================================
    //? function to Update Bus
    //===================================================================================================
    async updateBus(req, res) {
        await helper.update(req, res, busModel_1.default, req.body, {
            enumFields: [{ field: "status", enumObj: busEnum_1.status }],
            //---------------------------------------------
            successMessage: 'Bus was updated',
        });
    }
    //===================================================================================================
    //? function to Fetch All Buses
    //===================================================================================================
    async fetchAllBuses(req, res) {
        try {
            const buses = await busModel_1.default.findAll({
                attributes: ['id', 'serialNumber', 'brand', 'status', 'assignedRoute', 'assignedDriver'],
                include: [
                    {
                        model: userModel_1.default,
                        as: 'driver',
                        attributes: ['id', 'name', 'email'],
                        required: false
                    },
                    {
                        model: routeModel_1.default,
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
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching buses',
                error: error
            });
        }
    }
}
exports.BusService = BusService;
//# sourceMappingURL=busService.js.map