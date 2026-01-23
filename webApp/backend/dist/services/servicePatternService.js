"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicePatternService = void 0;
const messageTemplate_1 = require("../exceptions/messageTemplate");
const servicePatternModel_1 = __importDefault(require("../models/servicePatternModel"));
const operatingHoursModel_1 = __importDefault(require("../models/operatingHoursModel"));
const scheduleModel_1 = __importDefault(require("../models/scheduleModel"));
const scheduledTripsModel_1 = __importDefault(require("../models/scheduledTripsModel"));
const database_1 = require("../config/database");
//define when the bus system starts and stops operating
const startOperatingHour = 6;
const endOperatingHour = 23;
//define the minute label for operating hours
const startOperatingMinuteLabel = '45';
const operatingMinuteLabel = '15';
//======================================================================================================================
//? Service
//======================================================================================================================
class ServicePatternService {
    //==================================================================================================================
    //? Fetch all service patterns with their operating hours
    //==================================================================================================================
    async getServicePatterns(req, res) {
        try {
            const rows = await servicePatternModel_1.default.findAll({
                attributes: ['servicePatternId', 'title'],
                include: [
                    {
                        model: operatingHoursModel_1.default,
                        as: 'operatingHours',
                        attributes: ['operatingHourId', 'hour'],
                    },
                ],
                order: [
                    ['servicePatternId', 'ASC'],
                    [{ model: operatingHoursModel_1.default, as: 'operatingHours' }, 'hour', 'ASC'],
                ],
            });
            const data = rows.map((row) => {
                const operatingHoursRaw = row.operatingHours ?? [];
                return {
                    servicePatternId: row.servicePatternId,
                    title: row.title,
                    operatingHours: operatingHoursRaw.map((oh) => ({
                        operatingHourId: oh.operatingHourId,
                        hour: String(oh.hour),
                    })),
                };
            });
            return (0, messageTemplate_1.sendResponse)(res, 200, null, data);
        }
        catch (error) {
            return (0, messageTemplate_1.sendResponse)(res, 500, `Error occured while fetching service patterns ${error}`);
        }
    }
    //==================================================================================================================
    //? Add service pattern with operating hours
    //==================================================================================================================
    async addServicePattern(req, res) {
        const titleRaw = req.body?.title;
        const selectedHoursRaw = req.body?.hours;
        const title = typeof titleRaw === 'string' ? titleRaw.trim() : '';
        const hoursArray = Array.isArray(selectedHoursRaw) ? selectedHoursRaw : [];
        if (!title) {
            return (0, messageTemplate_1.sendResponse)(res, 500, 'Fill all Fields please: missing title');
        }
        if (hoursArray.length === 0) {
            return (0, messageTemplate_1.sendResponse)(res, 500, 'Please select at least one hour');
        }
        // normalize to unique sorted ints within 0..23
        const hours = Array.from(new Set(hoursArray
            .map((h) => (typeof h === 'number' ? h : Number(h)))
            .filter((h) => Number.isFinite(h) && h >= 0 && h <= endOperatingHour))).sort((a, b) => a - b);
        if (hours.length === 0) {
            return (0, messageTemplate_1.sendResponse)(res, 500, 'Please select valid hours');
        }
        try {
            const created = await database_1.sequelize.transaction(async (t) => {
                // Let UserHelper-style PK generation be mimicked here (4 chars: prefix + 3 digits)
                // ServicePatternModel PK field is `servicePatternId` not `id`, so generate it manually.
                let servicePatternId;
                do {
                    const id = Math.floor(100 + Math.random() * 900);
                    servicePatternId = `S${id}`;
                } while ((await servicePatternModel_1.default.count({ where: { servicePatternId }, transaction: t })) !== 0);
                await servicePatternModel_1.default.create({
                    servicePatternId,
                    title,
                }, { transaction: t });
                // Create operating hours rows
                const createdOperatingHours = [];
                for (const h of hours) {
                    let operatingHourId;
                    do {
                        const id = Math.floor(100 + Math.random() * 900);
                        operatingHourId = `O${id}`;
                    } while ((await operatingHoursModel_1.default.count({ where: { operatingHourId }, transaction: t })) !== 0);
                    // store as 06:45:00 for hour 6, otherwise HH:15:00
                    const minute = h === 6 ? startOperatingMinuteLabel : operatingMinuteLabel;
                    const hour = `${String(h).padStart(2, '0')}:${minute}:00`;
                    await operatingHoursModel_1.default.create({
                        operatingHourId,
                        servicePatternId,
                        hour,
                    }, { transaction: t });
                    createdOperatingHours.push({ operatingHourId, hour });
                }
                const createdPattern = {
                    servicePatternId,
                    title,
                    operatingHours: createdOperatingHours,
                };
                return createdPattern;
            });
            return (0, messageTemplate_1.sendResponse)(res, 200, 'servicepattern was Added successfully', created);
        }
        catch (error) {
            return (0, messageTemplate_1.sendResponse)(res, 500, `Error occured while creating service pattern. ${error}`);
        }
    }
    //==================================================================================================================
    //? Update service pattern (title + operating hours)
    //==================================================================================================================
    async updateServicePattern(req, res) {
        const servicePatternIdRaw = req.body?.servicePatternId;
        const titleRaw = req.body?.title;
        const selectedHoursRaw = req.body?.hours;
        const servicePatternId = typeof servicePatternIdRaw === 'string' ? servicePatternIdRaw.trim() : '';
        const title = typeof titleRaw === 'string' ? titleRaw.trim() : '';
        const hoursArray = Array.isArray(selectedHoursRaw) ? selectedHoursRaw : [];
        if (!servicePatternId) {
            return (0, messageTemplate_1.sendResponse)(res, 500, 'Fill all Fields please: missing servicePatternId');
        }
        if (!title) {
            return (0, messageTemplate_1.sendResponse)(res, 500, 'Fill all Fields please: missing title');
        }
        if (hoursArray.length === 0) {
            return (0, messageTemplate_1.sendResponse)(res, 500, 'Please select at least one hour');
        }
        const hours = Array.from(new Set(hoursArray
            .map((h) => (typeof h === 'number' ? h : Number(h)))
            .filter((h) => Number.isFinite(h) && h >= startOperatingHour && h <= 23))).sort((a, b) => a - b);
        if (hours.length === 0) {
            return (0, messageTemplate_1.sendResponse)(res, 500, 'Please select valid hours');
        }
        try {
            const updated = await database_1.sequelize.transaction(async (t) => {
                const pattern = await servicePatternModel_1.default.findOne({ where: { servicePatternId }, transaction: t });
                if (!pattern) {
                    return null;
                }
                await servicePatternModel_1.default.update({ title }, {
                    where: { servicePatternId },
                    transaction: t,
                });
                await operatingHoursModel_1.default.destroy({
                    where: { servicePatternId },
                    transaction: t,
                });
                const createdOperatingHours = [];
                for (const h of hours) {
                    let operatingHourId;
                    do {
                        const id = Math.floor(100 + Math.random() * 900);
                        operatingHourId = `O${id}`;
                    } while ((await operatingHoursModel_1.default.count({ where: { operatingHourId }, transaction: t })) !== 0);
                    const minute = h === 6 ? startOperatingMinuteLabel : operatingMinuteLabel;
                    const hour = `${String(h).padStart(2, '0')}:${minute}:00`;
                    await operatingHoursModel_1.default.create({
                        operatingHourId,
                        servicePatternId,
                        hour,
                    }, { transaction: t });
                    createdOperatingHours.push({ operatingHourId, hour });
                }
                const out = {
                    servicePatternId,
                    title,
                    operatingHours: createdOperatingHours,
                };
                return out;
            });
            if (!updated) {
                return (0, messageTemplate_1.sendResponse)(res, 500, 'ServicePattern not found');
            }
            return (0, messageTemplate_1.sendResponse)(res, 200, 'servicepattern was updated successfully', updated);
        }
        catch (error) {
            return (0, messageTemplate_1.sendResponse)(res, 500, `Error occured while updating service pattern. ${error}`);
        }
    }
    //==================================================================================================================
    //? Delete service pattern with operating hours
    //==================================================================================================================
    async deleteServicePattern(req, res) {
        const servicePatternIdRaw = req.body?.servicePatternId ?? req.body?.id ?? req.query?.servicePatternId;
        const servicePatternId = typeof servicePatternIdRaw === 'string' ? servicePatternIdRaw.trim() : '';
        if (!servicePatternId) {
            return (0, messageTemplate_1.sendResponse)(res, 500, 'ServicePattern id is required');
        }
        try {
            const deleted = await database_1.sequelize.transaction(async (t) => {
                const pattern = await servicePatternModel_1.default.findOne({
                    where: { servicePatternId },
                    transaction: t,
                });
                if (!pattern) {
                    return false;
                }
                // delete all scheduled trips with this schedule
                const schedules = await scheduleModel_1.default.findAll({
                    where: { servicePatternId },
                    attributes: ['scheduleId'],
                    transaction: t,
                });
                const scheduleIds = schedules.map((s) => s.scheduleId).filter(Boolean);
                if (scheduleIds.length > 0) {
                    await scheduledTripsModel_1.default.destroy({
                        where: { scheduleId: scheduleIds },
                        transaction: t,
                    });
                }
                await scheduleModel_1.default.destroy({
                    where: { servicePatternId },
                    transaction: t,
                });
                // delete all operating hours with this service pattern
                await operatingHoursModel_1.default.destroy({
                    where: { servicePatternId },
                    transaction: t,
                });
                await servicePatternModel_1.default.destroy({
                    where: { servicePatternId },
                    transaction: t,
                });
                return true;
            });
            //--------------------------------------------------------------------
            if (!deleted) {
                return (0, messageTemplate_1.sendResponse)(res, 500, 'Service Pattern not found');
            }
            //====================================================================
            return (0, messageTemplate_1.sendResponse)(res, 200, 'service Pattern was deleted successfully');
        }
        catch (error) {
            return (0, messageTemplate_1.sendResponse)(res, 500, `Error occured while deleting service pattern. ${error}`);
        }
    }
}
exports.ServicePatternService = ServicePatternService;
//# sourceMappingURL=servicePatternService.js.map