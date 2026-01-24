"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleController = void 0;
const scheduleService_1 = require("./scheduleService");
const scheduleService = new scheduleService_1.ScheduleService();
class ScheduleController {
    async getSchedule(req, res) {
        return scheduleService.getSchedule(req, res);
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
}
exports.ScheduleController = ScheduleController;
//# sourceMappingURL=scheduleController.js.map