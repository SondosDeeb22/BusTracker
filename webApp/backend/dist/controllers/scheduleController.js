"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleController = void 0;
const scheduleService_1 = require("../services/scheduleService");
//======================================================================================================================
//? Setup
//======================================================================================================================
const scheduleService = new scheduleService_1.ScheduleService();
//======================================================================================================================
//? Controller
//======================================================================================================================
class ScheduleController {
    async getSchedule(req, res) {
        return scheduleService.getSchedule(req, res);
    }
}
exports.ScheduleController = ScheduleController;
//# sourceMappingURL=scheduleController.js.map