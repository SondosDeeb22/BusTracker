"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleService = void 0;
const sequelize_1 = require("sequelize");
const messageTemplate_1 = require("../exceptions/messageTemplate");
const scheduleModel_1 = __importDefault(require("../models/scheduleModel"));
const servicePatternModel_1 = __importDefault(require("../models/servicePatternModel"));
const operatingHoursModel_1 = __importDefault(require("../models/operatingHoursModel"));
const scheduledTripsModel_1 = __importDefault(require("../models/scheduledTripsModel"));
const routeModel_1 = __importDefault(require("../models/routeModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const busModel_1 = __importDefault(require("../models/busModel"));
//======================================================================================================================
//? Helpers
//======================================================================================================================
const normalizeTime = (value) => {
    if (!value)
        return '';
    const s = String(value).trim();
    if (!s)
        return '';
    const parts = s.split(':');
    const hh = (parts[0] ?? '00').padStart(2, '0');
    const mm = (parts[1] ?? '00').padStart(2, '0');
    const ss = (parts[2] ?? '00').padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
};
//======================================================================================================================
//? Service
//======================================================================================================================
class ScheduleService {
    async getSchedule(req, res) {
        try {
            const where = {};
            const dateParam = typeof req.query.date === 'string' ? req.query.date.trim() : '';
            if (dateParam) {
                where.date = dateParam;
            }
            const servicePatternId = typeof req.query.servicePatternId === 'string' ? req.query.servicePatternId.trim() : '';
            if (servicePatternId) {
                where.servicePatternId = servicePatternId;
            }
            const fromDate = typeof req.query.fromDate === 'string' ? req.query.fromDate.trim() : '';
            const toDate = typeof req.query.toDate === 'string' ? req.query.toDate.trim() : '';
            if (fromDate || toDate) {
                where.date = {
                    ...(fromDate ? { [sequelize_1.Op.gte]: fromDate } : {}),
                    ...(toDate ? { [sequelize_1.Op.lte]: toDate } : {}),
                };
            }
            const schedules = await scheduleModel_1.default.findAll({
                where,
                include: [
                    {
                        model: servicePatternModel_1.default,
                        as: 'servicePattern',
                        attributes: ['servicePatternId', 'title'],
                        include: [
                            {
                                model: operatingHoursModel_1.default,
                                as: 'operatingHours',
                                attributes: ['operatingHourId', 'hour'],
                            },
                        ],
                    },
                    {
                        model: scheduledTripsModel_1.default,
                        as: 'trips',
                        attributes: ['detailedScheduleId', 'scheduleId', 'time', 'routeId', 'driverId', 'busId'],
                        include: [
                            {
                                model: routeModel_1.default,
                                as: 'route',
                                attributes: ['id', 'title', 'color'],
                            },
                            {
                                model: userModel_1.default,
                                as: 'driver',
                                attributes: ['id', 'name'],
                            },
                            {
                                model: busModel_1.default,
                                as: 'bus',
                                attributes: ['id', 'plate', 'brand', 'status'],
                            },
                        ],
                    },
                ],
                order: [
                    ['date', 'ASC'],
                    [{ model: scheduledTripsModel_1.default, as: 'trips' }, 'time', 'ASC'],
                ],
            });
            const mapped = schedules.map((row) => {
                const operatingHours = row?.servicePattern?.operatingHours ?? [];
                const buckets = new Map();
                for (const oh of operatingHours) {
                    const t = normalizeTime(oh.hour);
                    if (!t)
                        continue;
                    if (!buckets.has(t))
                        buckets.set(t, { time: t, trips: [] });
                }
                const otherTrips = [];
                const trips = row?.trips ?? [];
                for (const trip of trips) {
                    const tripTime = normalizeTime(trip?.time);
                    const bucket = buckets.get(tripTime);
                    if (bucket) {
                        bucket.trips.push(trip);
                    }
                    else {
                        otherTrips.push(trip);
                    }
                }
                const timeline = Array.from(buckets.values()).sort((a, b) => a.time.localeCompare(b.time));
                return {
                    scheduleId: row.scheduleId,
                    date: row.date,
                    day: row.day,
                    servicePatternId: row.servicePatternId,
                    servicePattern: row.servicePattern,
                    timeline,
                    otherTrips,
                };
            });
            return (0, messageTemplate_1.sendResponse)(res, 200, null, mapped);
        }
        catch (error) {
            return (0, messageTemplate_1.sendResponse)(res, 500, `Error occured while fetching schedule ${error}`);
        }
    }
}
exports.ScheduleService = ScheduleService;
//# sourceMappingURL=scheduleService.js.map