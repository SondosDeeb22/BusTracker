"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const scheduleController_1 = require("./scheduleController");
const tokenNameEnum_1 = require("../enums/tokenNameEnum");
const userEnum_1 = require("../enums/userEnum");
const tokenRequired_1 = require("../middlewares/tokenRequired");
const authorizeRole_1 = require("../middlewares/authorizeRole");
const router = express_1.default.Router();
const controller = new scheduleController_1.ScheduleController();
// Schedule timeline fetch
router.get('/fetch', (0, tokenRequired_1.accessRequireToken)(tokenNameEnum_1.loginToken), (0, authorizeRole_1.authorizeRole)(userEnum_1.role.admin), controller.getSchedule);
// Schedule CRUD
router.post('/add', (0, tokenRequired_1.accessRequireToken)(tokenNameEnum_1.loginToken), (0, authorizeRole_1.authorizeRole)(userEnum_1.role.admin), controller.addSchedule);
router.patch('/update', (0, tokenRequired_1.accessRequireToken)(tokenNameEnum_1.loginToken), (0, authorizeRole_1.authorizeRole)(userEnum_1.role.admin), controller.updateSchedule);
router.delete('/remove', (0, tokenRequired_1.accessRequireToken)(tokenNameEnum_1.loginToken), (0, authorizeRole_1.authorizeRole)(userEnum_1.role.admin), controller.removeSchedule);
exports.default = router;
//# sourceMappingURL=scheduleRoutes.js.map