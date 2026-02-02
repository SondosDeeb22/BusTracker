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
const errors_1 = require("../errors");
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
            await helper.add(busModel_1.default, req.body, {
                nonDuplicateFields: ['plate'],
                enumFields: [{ field: "status", enumObj: busEnum_1.status }],
            });
            return (0, messageTemplate_1.sendResponse)(res, 200, 'buses.success.added');
            //----------------------------------------------------------------
        }
        catch (error) {
            console.error('Error occured while creating bus.', error);
            if (error instanceof errors_1.ValidationError) {
                if (error.message === 'fillAllFields')
                    return (0, messageTemplate_1.sendResponse)(res, 400, 'common.errors.validation.fillAllFields');
                if (error.message === 'invalidField')
                    return (0, messageTemplate_1.sendResponse)(res, 400, 'common.errors.validation.invalidField');
                if (error.message === 'required')
                    return (0, messageTemplate_1.sendResponse)(res, 400, 'common.errors.validation.required');
                if (error.message === 'noData')
                    return (0, messageTemplate_1.sendResponse)(res, 400, 'common.errors.validation.noData');
                return (0, messageTemplate_1.sendResponse)(res, 400, 'common.errors.validation.invalidField');
            }
            if (error instanceof errors_1.ConflictError) {
                return (0, messageTemplate_1.sendResponse)(res, 409, error.message);
            }
            if (error instanceof errors_1.NotFoundError) {
                return (0, messageTemplate_1.sendResponse)(res, 404, 'common.crud.notFound');
            }
            if (error instanceof Error) {
                if (error.message.startsWith('common.')) {
                    return (0, messageTemplate_1.sendResponse)(res, 500, error.message);
                }
            }
            return (0, messageTemplate_1.sendResponse)(res, 500, 'common.errors.internal');
        }
    }
    //===================================================================================================
    //? function to Remove Bus
    //===================================================================================================
    async removeBus(req, res) {
        try {
            await helper.remove(busModel_1.default, 'id', req.body.id);
            return (0, messageTemplate_1.sendResponse)(res, 200, 'common.crud.removed');
            //======================================================
        }
        catch (error) {
            console.error('Error occured while removing bus.', error);
            if (error instanceof errors_1.ValidationError) {
                if (error.message === 'required')
                    return (0, messageTemplate_1.sendResponse)(res, 400, 'common.errors.validation.required');
                return (0, messageTemplate_1.sendResponse)(res, 400, 'common.errors.validation.invalidField');
            }
            if (error instanceof errors_1.NotFoundError) {
                return (0, messageTemplate_1.sendResponse)(res, 404, 'common.crud.notFound');
            }
            if (error instanceof Error) {
                if (error.message.startsWith('common.')) {
                    return (0, messageTemplate_1.sendResponse)(res, 500, error.message);
                }
            }
            return (0, messageTemplate_1.sendResponse)(res, 500, 'common.errors.internal');
        }
    }
    //===================================================================================================
    //? function to Update Bus
    //===================================================================================================
    async updateBus(req, res) {
        try {
            const result = await helper.update(busModel_1.default, req.body, {
                enumFields: [{ field: "status", enumObj: busEnum_1.status }]
            });
            return (0, messageTemplate_1.sendResponse)(res, 200, result.updated ? 'common.crud.updated' : 'common.crud.noChanges');
            //======================================================
        }
        catch (error) {
            console.error('Error occured while updating bus.', error);
            if (error instanceof errors_1.ValidationError) {
                if (error.message === 'required')
                    return (0, messageTemplate_1.sendResponse)(res, 400, 'common.errors.validation.required');
                if (error.message === 'noData')
                    return (0, messageTemplate_1.sendResponse)(res, 400, 'common.errors.validation.noData');
                if (error.message === 'invalidField')
                    return (0, messageTemplate_1.sendResponse)(res, 400, 'common.errors.validation.invalidField');
                return (0, messageTemplate_1.sendResponse)(res, 400, 'common.errors.validation.invalidField');
            }
            if (error instanceof errors_1.NotFoundError) {
                return (0, messageTemplate_1.sendResponse)(res, 404, 'common.crud.notFound');
            }
            if (error instanceof Error) {
                if (error.message.startsWith('common.')) {
                    return (0, messageTemplate_1.sendResponse)(res, 500, error.message);
                }
            }
            return (0, messageTemplate_1.sendResponse)(res, 500, 'common.errors.internal');
        }
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
            //======================================================
        }
        catch (error) {
            console.error('Error occured while fetching buses.', error);
            return (0, messageTemplate_1.sendResponse)(res, 500, 'common.errors.internal');
        }
    }
}
exports.BusService = BusService;
//# sourceMappingURL=busService.js.map