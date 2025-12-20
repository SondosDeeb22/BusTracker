"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverController = void 0;
const driverService_1 = require("../services/driverService");
const driverService = new driverService_1.DriverService();
//============================================================================================================================================================
class DriverController {
    // =================================================================================================================================
    // Add
    async addDriver(req, res) {
        return driverService.addDriver(req, res);
    }
    // =================================================================================================================================
    // Remove
    async removeDriver(req, res) {
        return driverService.removeDriver(req, res);
    }
    // =================================================================================================================================
    //? Update
    // =================================================================================================================================
    async updateDriver(req, res) {
        return driverService.updateDriver(req, res);
    }
    // =================================================================================================================================
    //? Fetch All Drivers
    // =================================================================================================================================
    async fetchAllDrivers(req, res) {
        return driverService.fetchAllDrivers(req, res);
    }
}
exports.DriverController = DriverController;
//# sourceMappingURL=driverController.js.map