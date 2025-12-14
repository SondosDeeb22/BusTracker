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
const userHelper_1 = require("../helpers/userHelper");
// import exceptions --------------------------------------------------------------------
const messageTemplate_1 = require("../exceptions/messageTemplate");
const authHelpher_1 = __importDefault(require("../helpers/authHelpher"));
const authHelper = new authHelpher_1.default();
const authService_1 = __importDefault(require("./authService"));
const authService = new authService_1.default();
const helper = new userHelper_1.UserHelper();
//===================================================================================================
class DriverService {
    async addDriver(req, res) {
        try {
            const driver = await helper.add(req, res, userModel_1.default, req.body, {
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
                skipResponse: true
            });
            // Send validation email
            await authService.sendValidateEmail(res, req.body.email);
            return (0, messageTemplate_1.sendResponse)(res, 200, "Driver added successfully. Validation email sent.");
        }
        catch (error) {
            return (0, messageTemplate_1.sendResponse)(res, 500, `${error}`);
        }
    }
    //===================================================================================================
    //? function to Remove Driver
    //===================================================================================================
    async removeDriver(req, res) {
        await helper.remove(req, res, userModel_1.default, 'id', req.body.id);
    }
    //===================================================================================================
    //? function to Update Driver
    //===================================================================================================
    async updateDriver(req, res) {
        await helper.update(req, res, userModel_1.default, req.body, {
            enumFields: [{ field: "status", enumObj: userEnum_1.status },
                { field: "role", enumObj: userEnum_1.role },
                { field: "gender", enumObj: userEnum_1.gender }
            ],
            //---------------------------------------------
            successMessage: 'Driver was updated',
        });
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
            res.status(200).json({
                success: true,
                message: 'Drivers fetched successfully',
                data: drivers
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching drivers',
                error: error
            });
        }
    }
}
exports.DriverService = DriverService;
//# sourceMappingURL=driverService.js.map