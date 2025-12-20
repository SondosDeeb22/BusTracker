"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusScheduleController = void 0;
const busScheduleService_1 = require("../services/busScheduleService");
const busScheduleService = new busScheduleService_1.BusScheduleService();
//============================================================================================================================================================
class BusScheduleController {
    // =================================================================================================================================
    // Add Schedule
    async addSchedule(req, res) {
        return busScheduleService.addScheduleRecord(req, res);
    }
    // =================================================================================================================================
    // Remove Schedule
    async removeSchedule(req, res) {
        return busScheduleService.removeSchedulRecord(req, res);
    }
    // =================================================================================================================================
    // Update Schedule
    // =================================================================================================================================
    async updateSchedule(req, res) {
        return busScheduleService.updateScheduleRecord(req, res);
    }
    // =================================================================================================================================
    // Fetch All Schedules
    // =================================================================================================================================
    async getSchedules(req, res) {
        return busScheduleService.getBusSchedule(req, res);
    }
}
exports.BusScheduleController = BusScheduleController;
//# sourceMappingURL=busScheduleController.js.map