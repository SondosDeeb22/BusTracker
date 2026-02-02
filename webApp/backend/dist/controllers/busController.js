"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusController = void 0;
const busService_1 = require("../services/busService");
const busService = new busService_1.BusService();
const messageTemplate_1 = require("../exceptions/messageTemplate");
const controllerErrorMapper_1 = require("./controllerErrorMapper");
//============================================================================================================================================================
class BusController {
    // =================================================================================================================================
    //? Add Bus
    // =================================================================================================================================
    async addBus(req, res) {
        try {
            const result = await busService.addBus(req.body);
            (0, messageTemplate_1.sendResponse)(res, 200, result.messageKey);
            return;
            // --------------------------------------
        }
        catch (error) {
            (0, controllerErrorMapper_1.handleControllerError)(res, error);
            return;
        }
    }
    // =================================================================================================================================
    //? Remove
    // =================================================================================================================================
    async removeBus(req, res) {
        try {
            const result = await busService.removeBus(req.body?.id);
            (0, messageTemplate_1.sendResponse)(res, 200, result.messageKey);
            return;
            // --------------------------------------------------
        }
        catch (error) {
            (0, controllerErrorMapper_1.handleControllerError)(res, error);
            return;
        }
    }
    // =================================================================================================================================
    //? Update
    // =================================================================================================================================
    async updateBus(req, res) {
        try {
            const result = await busService.updateBus(req.body);
            (0, messageTemplate_1.sendResponse)(res, 200, result.messageKey);
            return;
            // ------------------------------------------
        }
        catch (error) {
            (0, controllerErrorMapper_1.handleControllerError)(res, error);
            return;
        }
    }
    // =================================================================================================================================
    //? Fetch All Buses
    // =================================================================================================================================
    async fetchAllBuses(req, res) {
        try {
            const result = await busService.fetchAllBuses();
            (0, messageTemplate_1.sendResponse)(res, 200, result.messageKey, result.data);
            return;
            // ------------------------------------------------------
        }
        catch (error) {
            (0, controllerErrorMapper_1.handleControllerError)(res, error);
            return;
        }
    }
}
exports.BusController = BusController;
//# sourceMappingURL=busController.js.map