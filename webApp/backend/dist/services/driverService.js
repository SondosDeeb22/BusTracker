"use strict";
//===================================================================================================
//? Importing
//===================================================================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverService = void 0;
//import models
const userModel_1 = __importDefault(require("../models/userModel"));
//import Enums
const userEnum_1 = require("../enums/userEnum");
// import exceptions 
const messageTemplate_1 = require("../exceptions/messageTemplate");
const errors_1 = require("../errors");
// services 
const authService_1 = __importDefault(require("./authService"));
const authService = new authService_1.default();
// helpers 
const userHelper_1 = require("../helpers/userHelper");
const helper = new userHelper_1.UserHelper();
//===================================================================================================
class DriverService {
    async addDriver(req, res) {
        try {
            await helper.add(userModel_1.default, req.body, {
                nonDuplicateFields: ['email'],
                enumFields: [
                    { field: "status", enumObj: userEnum_1.status },
                    { field: "role", enumObj: userEnum_1.role },
                    { field: "gender", enumObj: userEnum_1.gender }
                ],
                transform: async (data) => {
                    const out = { ...data };
                    if (out.email)
                        out.email = out.email.toLowerCase().trim();
                    if (!out.status)
                        out.status = userEnum_1.status.active;
                    return out;
                },
            });
            // Send validation email
            await authService.sendValidateEmail(res, req.body.email);
            return (0, messageTemplate_1.sendResponse)(res, 200, 'drivers.success.added');
            //======================================================
        }
        catch (error) {
            console.error('Error occured while adding driver.', error);
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
                return (0, messageTemplate_1.sendResponse)(res, 409, 'common.errors.validation.duplicateEmail');
            }
            if (error instanceof errors_1.NotFoundError) {
                return (0, messageTemplate_1.sendResponse)(res, 404, 'common.crud.notFound');
            }
            return (0, messageTemplate_1.sendResponse)(res, 500, 'common.errors.internal');
        }
    }
    //===================================================================================================
    //? function to Remove Driver
    //===================================================================================================
    async removeDriver(req, res) {
        try {
            await helper.remove(userModel_1.default, 'id', req.body.id);
            return (0, messageTemplate_1.sendResponse)(res, 200, 'common.crud.removed');
            // ======================================================================
        }
        catch (error) {
            console.error('Error occured while removing driver.', error);
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
    //? function to Update Driver
    //===================================================================================================
    async updateDriver(req, res) {
        try {
            const result = await helper.update(userModel_1.default, req.body, {
                enumFields: [
                    { field: "status", enumObj: userEnum_1.status },
                    { field: "role", enumObj: userEnum_1.role },
                ]
            });
            return (0, messageTemplate_1.sendResponse)(res, 200, result.updated ? 'common.crud.updated' : 'common.crud.noChanges');
        }
        catch (error) {
            console.error('Error occured while updating driver.', error);
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
    //? function to Fetch All Drivers
    //===================================================================================================
    async fetchAllDrivers(req, res) {
        try {
            const drivers = await userModel_1.default.findAll({
                where: { role: userEnum_1.role.driver },
                attributes: ['id', 'name', 'phone', 'email', 'licenseNumber', 'licenseExpiryDate', 'status']
            });
            return (0, messageTemplate_1.sendResponse)(res, 200, 'drivers.success.fetched', drivers);
            // ======================================================================
        }
        catch (error) {
            console.error('Error occured while fetching drivers.', error);
            return (0, messageTemplate_1.sendResponse)(res, 500, 'common.errors.internal');
        }
    }
}
exports.DriverService = DriverService;
//# sourceMappingURL=driverService.js.map