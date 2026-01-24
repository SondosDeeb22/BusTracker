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
                nonDuplicateFields: ['plate'],
                enumFields: [{ field: "status", enumObj: busEnum_1.status }],
            });
            (0, messageTemplate_1.sendResponse)(res, 200, 'buses.success.added');
            //----------------------------------------------------------------
        }
        catch (error) {
            console.error('Error occured while creating bus.', error);
            (0, messageTemplate_1.sendResponse)(res, 500, 'common.errors.internal');
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
            enumFields: [{ field: "status", enumObj: busEnum_1.status }]
        });
    }
    //===================================================================================================
    //? function to Fetch All Buses
    //===================================================================================================
    async fetchAllBuses(req, res) {
        try {
            const buses = await busModel_1.default.findAll({
                attributes: ['id', 'plate', 'brand', 'status', 'assignedRoute', 'assignedDriver'],
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
            return (0, messageTemplate_1.sendResponse)(res, 200, 'buses.success.fetched', buses);
        }
        catch (error) {
            console.error('Error occured while fetching buses.', error);
            return (0, messageTemplate_1.sendResponse)(res, 500, 'common.errors.internal');
        }
    }
}
exports.BusService = BusService;
//# sourceMappingURL=busService.js.map