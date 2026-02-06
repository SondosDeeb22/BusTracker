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
const errors_1 = require("../errors");
// services 
const authService_1 = __importDefault(require("./authService"));
const authService = new authService_1.default();
// helpers 
const userHelper_1 = require("../helpers/userHelper");
const helper = new userHelper_1.UserHelper();
//===================================================================================================
class DriverService {
    //===================================================================================================
    //? function to Add Driver
    //===================================================================================================
    async addDriver(payload) {
        try {
            await helper.add(userModel_1.default, payload, {
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
            if (payload?.email) {
                await authService.sendValidateEmail(String(payload.email));
            }
            return { messageKey: 'drivers.success.added' };
            // --------------------------------------------------------
        }
        catch (error) {
            if (error instanceof errors_1.ValidationError) {
                throw error;
            }
            if (error instanceof errors_1.ConflictError) {
                throw new errors_1.ConflictError('common.errors.validation.duplicateEmail');
            }
            if (error instanceof errors_1.NotFoundError) {
                throw error;
            }
            throw new errors_1.InternalError('common.errors.internal');
        }
    }
    //===================================================================================================
    //? function to Remove Driver
    //===================================================================================================
    async removeDriver(driverId) {
        await helper.remove(userModel_1.default, 'id', String(driverId));
        return { messageKey: 'common.crud.removed' };
    }
    //===================================================================================================
    //? function to Update Driver
    //===================================================================================================
    async updateDriver(payload) {
        const result = await helper.update(userModel_1.default, payload, {
            nonDuplicateFields: ["email"],
            enumFields: [
                { field: "status", enumObj: userEnum_1.status },
                { field: "role", enumObj: userEnum_1.role },
            ]
        });
        return {
            updated: result.updated,
            messageKey: result.updated ? 'common.crud.updated' : 'common.crud.noChanges'
        };
    }
    //===================================================================================================
    //? function to Fetch All Drivers
    //===================================================================================================
    async fetchAllDrivers() {
        try {
            const drivers = await userModel_1.default.findAll({
                where: { role: userEnum_1.role.driver },
                attributes: ['id', 'name', 'phone', 'email', 'licenseNumber', 'licenseExpiryDate', 'status']
            });
            return { messageKey: 'drivers.success.fetched', data: drivers };
            // --------------------------------------------------------------------------
        }
        catch (error) {
            throw new errors_1.InternalError('common.errors.internal');
        }
    }
}
exports.DriverService = DriverService;
//# sourceMappingURL=driverService.js.map