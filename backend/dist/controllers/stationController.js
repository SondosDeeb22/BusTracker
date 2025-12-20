"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StationController = void 0;
const stationService_1 = require("../services/stationService");
const stationService = new stationService_1.StationService();
//============================================================================================================================================================
class StationController {
    // =================================================================================================================================
    // Add
    async addStation(req, res) {
        return stationService.addStation(req, res);
    }
    // =================================================================================================================================
    // Remove
    async removeStation(req, res) {
        return stationService.removeStation(req, res);
    }
    // =================================================================================================================================
    //? Update
    // =================================================================================================================================
    async updateStation(req, res) {
        return stationService.updateStation(req, res);
    }
    // =================================================================================================================================
    //? Fetch All Stations
    // =================================================================================================================================
    async fetchAllStations(req, res) {
        return stationService.fetchAllStations(req, res);
    }
}
exports.StationController = StationController;
//# sourceMappingURL=stationController.js.map