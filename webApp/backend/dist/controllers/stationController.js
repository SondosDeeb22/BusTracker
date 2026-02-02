"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StationController = void 0;
const stationService_1 = require("../services/stationService");
const stationService = new stationService_1.StationService();
const messageTemplate_1 = require("../exceptions/messageTemplate");
const controllerErrorMapper_1 = require("./controllerErrorMapper");
//============================================================================================================================================================
class StationController {
    // =================================================================================================================================
    //? Add
    // =================================================================================================================================
    async addStation(req, res) {
        try {
            const result = await stationService.addStation(req.body);
            (0, messageTemplate_1.sendResponse)(res, 200, result.messageKey);
            return;
        }
        catch (error) {
            (0, controllerErrorMapper_1.handleControllerError)(res, error);
            return;
        }
    }
    // =================================================================================================================================
    //? Remove
    // =================================================================================================================================
    async removeStation(req, res) {
        try {
            const result = await stationService.removeStation(req.body?.id);
            (0, messageTemplate_1.sendResponse)(res, 200, result.messageKey);
            return;
        }
        catch (error) {
            (0, controllerErrorMapper_1.handleControllerError)(res, error);
            return;
        }
    }
    // =================================================================================================================================
    //? Update
    // =================================================================================================================================
    async updateStation(req, res) {
        try {
            const result = await stationService.updateStation(req.body);
            (0, messageTemplate_1.sendResponse)(res, 200, result.messageKey);
            return;
        }
        catch (error) {
            (0, controllerErrorMapper_1.handleControllerError)(res, error);
            return;
        }
    }
    // =================================================================================================================================
    //? Fetch All Stations
    // =================================================================================================================================
    async fetchAllStations(req, res) {
        try {
            const result = await stationService.fetchAllStations();
            (0, messageTemplate_1.sendResponse)(res, 200, result.messageKey, result.data);
            return;
        }
        catch (error) {
            (0, controllerErrorMapper_1.handleControllerError)(res, error);
            return;
        }
    }
}
exports.StationController = StationController;
//# sourceMappingURL=stationController.js.map