"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverController = void 0;
const driverService_1 = require("../services/driverService");
const driverService = new driverService_1.DriverService();
const messageTemplate_1 = require("../exceptions/messageTemplate");
const controllerErrorMapper_1 = require("./controllerErrorMapper");
//============================================================================================================================================================
class DriverController {
    // =================================================================================================================================
    // Add
    async addDriver(req, res) {
        try {
            const result = await driverService.addDriver(req.body);
            (0, messageTemplate_1.sendResponse)(res, 200, result.messageKey);
            return;
            // -------------------------
        }
        catch (error) {
            (0, controllerErrorMapper_1.handleControllerError)(res, error);
            return;
        }
    }
    // =================================================================================================================================
    // Remove
    async removeDriver(req, res) {
        try {
            const result = await driverService.removeDriver(req.body?.id);
            (0, messageTemplate_1.sendResponse)(res, 200, result.messageKey);
            return;
            // -------------------------
        }
        catch (error) {
            (0, controllerErrorMapper_1.handleControllerError)(res, error);
            return;
        }
    }
    // =================================================================================================================================
    //? Update
    // =================================================================================================================================
    async updateDriver(req, res) {
        try {
            const result = await driverService.updateDriver(req.body);
            (0, messageTemplate_1.sendResponse)(res, 200, result.messageKey);
            return;
            // -----------------
        }
        catch (error) {
            (0, controllerErrorMapper_1.handleControllerError)(res, error);
            return;
        }
    }
    // =================================================================================================================================
    //? Fetch All Drivers
    // =================================================================================================================================
    async fetchAllDrivers(req, res) {
        try {
            const result = await driverService.fetchAllDrivers();
            (0, messageTemplate_1.sendResponse)(res, 200, result.messageKey, result.data);
            return;
            // -----------------
        }
        catch (error) {
            (0, controllerErrorMapper_1.handleControllerError)(res, error);
            return;
        }
    }
}
exports.DriverController = DriverController;
//# sourceMappingURL=driverController.js.map