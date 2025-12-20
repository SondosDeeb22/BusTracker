"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusStationController = void 0;
const stationService_1 = require("../services/stationService");
const busStationService = new stationService_1.StationService();
//============================================================================================================================================================
class BusStationController {
    // =================================================================================================================================
    // Add
    async addBusStation(req, res) {
        return busStationService.addStation(req, res);
    }
}
exports.BusStationController = BusStationController;
//# sourceMappingURL=busStationController.js.map