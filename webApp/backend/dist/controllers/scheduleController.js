"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleController = void 0;
const scheduleService_1 = require("../services/scheduleService");
const scheduleService = new scheduleService_1.ScheduleService();
//============================================================================================================================================================
//? Class
//============================================================================================================================================================
class ScheduleController {
    async getSchedule(req, res) {
        return scheduleService.getSchedule(req, res);
    }
    async getUserSchedule(req, res) {
        return scheduleService.getUserSchedule(req, res);
    }
    async addSchedule(req, res) {
        return scheduleService.addSchedule(req, res);
    }
    async updateSchedule(req, res) {
        return scheduleService.updateSchedule(req, res);
    }
    async removeSchedule(req, res) {
        return scheduleService.removeSchedule(req, res);
    }
    //===================================================================================================
    //? Scheduled Trips
    //===================================================================================================
    async addScheduledTrip(req, res) {
        return scheduleService.addScheduledTrip(req, res);
    }
    async removeScheduledTrip(req, res) {
        return scheduleService.removeScheduledTrip(req, res);
    }
}
exports.ScheduleController = ScheduleController;
//# sourceMappingURL=scheduleController.js.map