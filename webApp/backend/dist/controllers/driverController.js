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
    //? function to allow driver to updates his profile data (currently only phone number  is changeable)
    // =================================================================================================================================
    async updateDriverData(req, res) {
        try {
            const user = req?.user;
            const userId = typeof user?.id === 'string' ? user.id.trim() : '';
            const phone = typeof req.body?.phone === 'string' ? req.body.phone.trim() : '';
            const result = await driverService.updateDriver({
                id: userId,
                phone,
            });
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
    //? Fetch Driver Profile
    // =================================================================================================================================
    async fetchDriverProfile(req, res) {
        try {
            const user = req?.user;
            const userId = typeof user?.id === 'string' ? user.id.trim() : '';
            const result = await driverService.fetchDriverProfile(userId);
            (0, messageTemplate_1.sendResponse)(res, 200, result.messageKey, result.data);
            return;
            // -----------------
        }
        catch (error) {
            (0, controllerErrorMapper_1.handleControllerError)(res, error);
            return;
        }
    }
    // =================================================================================================================================
    //? Fetch All Drivers or specific driver
    // =================================================================================================================================
    async fetchAllDrivers(req, res) {
        try {
            const driverIdFromQuery = typeof req.query?.driverId === 'string' ? req.query.driverId.trim() : '';
            const result = await driverService.fetchAllDrivers(driverIdFromQuery);
            (0, messageTemplate_1.sendResponse)(res, 200, result.messageKey, result.data);
            return;
            // -----------------
        }
        catch (error) {
            (0, controllerErrorMapper_1.handleControllerError)(res, error);
            return;
        }
    }
    // =================================================================================================================================
    //? Fetch Driver's Schedule
    // =================================================================================================================================
    async fetchDriverSchedule(req, res) {
        try {
            const user = req?.user;
            console.log(user);
            console.log(user.id);
            console.log(user.role);
            const driverIdFromQuery = typeof req.query?.driverId === 'string' ? req.query.driverId.trim() : '';
            const requesterRole = typeof user?.role === 'string' ? String(user.role).trim() : '';
            const driverId = requesterRole === 'admin' && driverIdFromQuery ? driverIdFromQuery : user?.id;
            const result = await driverService.fetchDriverSchedule(driverId);
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