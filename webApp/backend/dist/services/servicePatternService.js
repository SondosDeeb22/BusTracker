"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicePatternService = void 0;
//======================================================================================================================
//? Importing
//======================================================================================================================
const servicePatternModel_1 = __importDefault(require("../models/servicePatternModel"));
const operatingHoursModel_1 = __importDefault(require("../models/operatingHoursModel"));
const scheduleModel_1 = __importDefault(require("../models/scheduleModel"));
const scheduledTripsModel_1 = __importDefault(require("../models/scheduledTripsModel"));
const database_1 = require("../config/database");
const errors_1 = require("../errors");
const InternalError_1 = require("../errors/InternalError");
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
    async getServicePatterns() {
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
            return { messageKey: 'common.crud.fetched', data };
        }
        catch (error) {
            console.error('Error occured while fetching service patterns.', error);
            throw new InternalError_1.InternalError('common.errors.internal');
        }
    }
    //==================================================================================================================
    //? Add service pattern with operating hours
    //==================================================================================================================
    async addServicePattern(payload) {
        const titleRaw = payload?.title;
        const selectedHoursRaw = payload?.hours;
        const title = typeof titleRaw === 'string' ? titleRaw.trim() : '';
        const hoursArray = Array.isArray(selectedHoursRaw) ? selectedHoursRaw : [];
        if (!title) {
            throw new errors_1.ValidationError('servicePatterns.validation.titleRequired');
        }
        if (hoursArray.length === 0) {
            throw new errors_1.ValidationError('servicePatterns.validation.selectAtLeastOneHour');
        }
        // normalize to unique sorted ints within 0..23
        const hours = Array.from(new Set(hoursArray
            .map((h) => (typeof h === 'number' ? h : Number(h)))
            .filter((h) => Number.isFinite(h) && h >= 0 && h <= endOperatingHour))).sort((a, b) => a - b);
        if (hours.length === 0) {
            throw new errors_1.ValidationError('servicePatterns.validation.invalidHours');
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
            return { messageKey: 'servicePatterns.success.added', data: created };
        }
        catch (error) {
            console.error('Error occured while creating service pattern.', error);
            throw new InternalError_1.InternalError('common.errors.internal');
        }
    }
    //==================================================================================================================
    //? Update service pattern (title + operating hours)
    //==================================================================================================================
    async updateServicePattern(payload) {
        const servicePatternIdRaw = payload?.servicePatternId;
        const titleRaw = payload?.title;
        const selectedHoursRaw = payload?.hours;
        const servicePatternId = typeof servicePatternIdRaw === 'string' ? servicePatternIdRaw.trim() : '';
        const title = typeof titleRaw === 'string' ? titleRaw.trim() : '';
        const hoursArray = Array.isArray(selectedHoursRaw) ? selectedHoursRaw : [];
        if (!servicePatternId) {
            throw new errors_1.ValidationError('servicePatterns.validation.idRequired');
        }
        if (!title) {
            throw new errors_1.ValidationError('servicePatterns.validation.titleRequired');
        }
        if (hoursArray.length === 0) {
            throw new errors_1.ValidationError('servicePatterns.validation.selectAtLeastOneHour');
        }
        const hours = Array.from(new Set(hoursArray
            .map((h) => (typeof h === 'number' ? h : Number(h)))
            .filter((h) => Number.isFinite(h) && h >= startOperatingHour && h <= 23))).sort((a, b) => a - b);
        if (hours.length === 0) {
            throw new errors_1.ValidationError('servicePatterns.validation.invalidHours');
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
                throw new errors_1.NotFoundError('servicePatterns.errors.notFound');
            }
            return { messageKey: 'servicePatterns.success.updated', data: updated };
        }
        catch (error) {
            console.error('Error occured while updating service pattern.', error);
            throw error;
        }
    }
    //==================================================================================================================
    //? Delete service pattern with operating hours
    //==================================================================================================================
    async deleteServicePattern(servicePatternIdRaw) {
        const servicePatternId = typeof servicePatternIdRaw === 'string' ? servicePatternIdRaw.trim() : '';
        if (!servicePatternId) {
            throw new errors_1.ValidationError('servicePatterns.validation.idRequired');
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
            if (!deleted) {
                throw new errors_1.NotFoundError('servicePatterns.errors.notFound');
            }
            return { messageKey: 'servicePatterns.success.deleted' };
        }
        catch (error) {
            console.error('Error occured while deleting service pattern.', error);
            throw new InternalError_1.InternalError('common.errors.internal');
        }
    }
}
exports.ServicePatternService = ServicePatternService;
//# sourceMappingURL=servicePatternService.js.map