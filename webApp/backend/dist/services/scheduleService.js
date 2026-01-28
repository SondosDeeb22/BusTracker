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
const userHelper_1 = require("../helpers/userHelper");
const helper = new userHelper_1.UserHelper();
//===================================================================================================
//? Helper
//===================================================================================================
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
const calcDayFromDate = (dateStr) => {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime()))
        return '';
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[d.getDay()] ?? '';
};
//===================================================================================================
//? schedule class
//===================================================================================================
class ScheduleService {
    //===================================================================================================
    //? Fetch schedule (GET)
    // Fetch schedules with their operating hours timeline and scheduled trips
    //===================================================================================================
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
            console.error('Error occured while fetching schedule', error);
            return (0, messageTemplate_1.sendResponse)(res, 500, 'common.errors.internal');
        }
    }
    //===================================================================================================
    //? Fetch schedule for users (GET)
    // Fetch schedules with their operating hours timeline and scheduled trips
    // (Simplified output: no driver/bus objects)
    //===================================================================================================
    async getUserSchedule(req, res) {
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
                        attributes: ['time', 'routeId'],
                        include: [
                            {
                                model: routeModel_1.default,
                                as: 'route',
                                attributes: ['id', 'title', 'color'],
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
                    // Keep the trip object simplified for user UI consumption.
                    // We reuse the already-loaded route relation and do not include driver/bus.
                    const simplifiedTrip = {
                        time: tripTime,
                        route: trip?.route,
                    };
                    if (bucket) {
                        bucket.trips.push(simplifiedTrip);
                    }
                    else {
                        otherTrips.push(simplifiedTrip);
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
            // Backward compatibility: the mobile app currently expects the original "mapped" schedule list
            // (date/day + timeline slots). Only return the grouped response when explicitly requested.
            const groupBy = typeof req.query.groupBy === 'string' ? req.query.groupBy.trim() : '';
            if (groupBy !== 'servicePattern') {
                return (0, messageTemplate_1.sendResponse)(res, 200, null, mapped);
            }
            const parseColorToArgbInt = (raw) => {
                const s = String(raw ?? '').trim();
                const hex = s.startsWith('#') ? s.slice(1) : s;
                if (!/^[0-9a-fA-F]{6}$/.test(hex))
                    return 0xFF9E9E9E;
                return (0xFF000000 | parseInt(hex, 16)) >>> 0;
            };
            const grouped = new Map();
            for (const schedule of mapped) {
                const spId = typeof schedule?.servicePatternId === 'string' ? schedule.servicePatternId.trim() : '';
                if (!spId)
                    continue;
                if (!grouped.has(spId)) {
                    const oh = schedule?.servicePattern?.operatingHours ?? [];
                    grouped.set(spId, {
                        servicePatternId: spId,
                        operatingHours: oh,
                        routesAcc: new Map(),
                    });
                }
                const group = grouped.get(spId);
                const ingestTrip = (trip) => {
                    const route = trip?.route;
                    const routeName = typeof route?.title === 'string' ? route.title.trim() : '';
                    if (!routeName)
                        return;
                    const time = normalizeTime(trip?.time);
                    if (!time)
                        return;
                    if (!group.routesAcc.has(routeName)) {
                        group.routesAcc.set(routeName, {
                            routeName,
                            tabColorValue: parseColorToArgbInt(route?.color),
                            times: new Set(),
                        });
                    }
                    group.routesAcc.get(routeName).times.add(time);
                };
                const timeline = Array.isArray(schedule?.timeline) ? schedule.timeline : [];
                for (const slot of timeline) {
                    const trips = Array.isArray(slot?.trips) ? slot.trips : [];
                    for (const trip of trips) {
                        ingestTrip(trip);
                    }
                }
                const otherTrips = Array.isArray(schedule?.otherTrips) ? schedule.otherTrips : [];
                for (const trip of otherTrips) {
                    ingestTrip(trip);
                }
            }
            const response = Array.from(grouped.values()).map((g) => {
                const routes = Array.from(g.routesAcc.values()).map((r) => ({
                    routeName: r.routeName,
                    tabColorValue: r.tabColorValue,
                    departureTimes: Array.from(r.times).sort((a, b) => a.localeCompare(b)),
                }));
                return {
                    servicePatternId: g.servicePatternId,
                    operatingHours: g.operatingHours,
                    routes,
                };
            });
            return (0, messageTemplate_1.sendResponse)(res, 200, null, response);
        }
        catch (error) {
            console.error('Error occured while fetching schedule', error);
            return (0, messageTemplate_1.sendResponse)(res, 500, 'common.errors.internal');
        }
    }
    //===================================================================================================
    //? Remove schedule (Delete)
    //===================================================================================================
    async removeScheduledTrip(req, res) {
        try {
            const detailedScheduleId = typeof req.body?.detailedScheduleId === 'string' ? req.body.detailedScheduleId.trim() : '';
            if (!detailedScheduleId) {
                return (0, messageTemplate_1.sendResponse)(res, 500, 'common.validation.required');
            }
            const deletedCount = await scheduledTripsModel_1.default.destroy({ where: { detailedScheduleId } });
            if (deletedCount === 0) {
                return (0, messageTemplate_1.sendResponse)(res, 500, 'tripForm.errors.notFound');
            }
            return (0, messageTemplate_1.sendResponse)(res, 200, 'tripForm.success.removed');
        }
        catch (error) {
            console.error('Error occured while removing scheduled trip.', error);
            return (0, messageTemplate_1.sendResponse)(res, 500, 'common.errors.internal');
        }
    }
    //===================================================================================================
    //? add schedule (POST)
    // Create schedule row (date + servicePatternId). day is calculated from date.
    //===================================================================================================
    async addSchedule(req, res) {
        try {
            const body = req.body || {};
            const date = typeof body.date === 'string' ? body.date.trim() : '';
            const servicePatternId = typeof body.servicePatternId === 'string' ? body.servicePatternId.trim() : '';
            if (!date || !servicePatternId) {
                return (0, messageTemplate_1.sendResponse)(res, 500, 'common.validation.fillAllFields');
            }
            const day = calcDayFromDate(date);
            if (!day) {
                return (0, messageTemplate_1.sendResponse)(res, 500, 'schedule.errors.invalidDate');
            }
            await helper.add(req, res, scheduleModel_1.default, { date, day, servicePatternId });
            return;
        }
        catch (error) {
            console.error('Error occured while creating schedule.', error);
            return (0, messageTemplate_1.sendResponse)(res, 500, 'common.errors.internal');
        }
    }
    //===================================================================================================
    //? add scheduled trip (POST)
    // Add a trip row to a specific schedule.
    //===================================================================================================
    async addScheduledTrip(req, res) {
        try {
            const body = (req.body ?? {});
            const scheduleId = typeof body.scheduleId === 'string' ? body.scheduleId.trim() : '';
            const time = normalizeTime(body.time);
            const routeId = typeof body.routeId === 'string' ? body.routeId.trim() : '';
            const driverId = typeof body.driverId === 'string' ? body.driverId.trim() : '';
            const busId = typeof body.busId === 'string' ? body.busId.trim() : '';
            if (!scheduleId || !time || !routeId || !driverId || !busId) {
                return (0, messageTemplate_1.sendResponse)(res, 500, 'common.validation.fillAllFields');
            }
            const scheduleExists = await scheduleModel_1.default.findOne({
                where: { scheduleId },
                attributes: ['scheduleId'],
            });
            if (!scheduleExists) {
                return (0, messageTemplate_1.sendResponse)(res, 500, 'schedule.errors.notFound');
            }
            const existingTrip = await scheduledTripsModel_1.default.findOne({
                where: { scheduleId, time, routeId },
                attributes: ['detailedScheduleId', 'driverId', 'busId'],
            });
            const occupied = await scheduledTripsModel_1.default.findOne({
                where: {
                    scheduleId,
                    time,
                    ...(existingTrip ? { detailedScheduleId: { [sequelize_1.Op.ne]: existingTrip.detailedScheduleId } } : {}),
                    [sequelize_1.Op.or]: [{ driverId }, { busId }],
                },
                attributes: ['detailedScheduleId', 'driverId', 'busId'],
            });
            if (occupied) {
                if (occupied.driverId === driverId) {
                    return (0, messageTemplate_1.sendResponse)(res, 500, 'tripForm.errors.driverNotAvailable');
                }
                if (occupied.busId === busId) {
                    return (0, messageTemplate_1.sendResponse)(res, 500, 'tripForm.errors.busNotAvailable');
                }
                return (0, messageTemplate_1.sendResponse)(res, 500, 'tripForm.errors.driverOrBusNotAvailable');
            }
            if (existingTrip) {
                const [updatedCount] = await scheduledTripsModel_1.default.update({ driverId, busId }, { where: { detailedScheduleId: existingTrip.detailedScheduleId } });
                if (updatedCount === 0) {
                    return (0, messageTemplate_1.sendResponse)(res, 500, 'tripForm.errors.notUpdated');
                }
                return (0, messageTemplate_1.sendResponse)(res, 200, 'tripForm.success.updated');
            }
            await helper.add(req, res, scheduledTripsModel_1.default, { scheduleId, time, routeId, driverId, busId }, { successMessageKey: 'tripForm.success.saved' });
            return;
        }
        catch (error) {
            console.error('Error occured while creating scheduled trip.', error);
            return (0, messageTemplate_1.sendResponse)(res, 500, 'common.errors.internal');
        }
    }
    //===================================================================================================
    //? update schedule (Patch)
    // Update schedule row. (scheduleId required)
    //===================================================================================================
    async updateSchedule(req, res) {
        try {
            const body = req.body || {};
            const scheduleId = typeof body.scheduleId === 'string' ? body.scheduleId.trim() : '';
            if (!scheduleId) {
                return (0, messageTemplate_1.sendResponse)(res, 500, 'common.validation.required');
            }
            const updates = { scheduleId };
            if (body.date) {
                const date = String(body.date).trim();
                const day = calcDayFromDate(date);
                if (!day)
                    return (0, messageTemplate_1.sendResponse)(res, 500, 'schedule.errors.invalidDate');
                updates.date = date;
                updates.day = day;
            }
            if (body.servicePatternId) {
                updates.servicePatternId = String(body.servicePatternId).trim();
            }
            await helper.update(req, res, scheduleModel_1.default, updates);
            return;
        }
        catch (error) {
            console.error('Error occured while updating schedule.', error);
            return (0, messageTemplate_1.sendResponse)(res, 500, 'common.errors.internal');
        }
    }
    //===================================================================================================
    //? Delete schedule (Delete)
    // Delete schedule row (scheduleId). trips are deleted by DB cascade.
    //===================================================================================================
    async removeSchedule(req, res) {
        try {
            const scheduleId = typeof req.body?.scheduleId === 'string' ? req.body.scheduleId.trim() : '';
            if (!scheduleId) {
                return (0, messageTemplate_1.sendResponse)(res, 500, 'common.validation.required');
            }
            await helper.remove(req, res, scheduleModel_1.default, 'scheduleId', scheduleId);
            return;
        }
        catch (error) {
            console.error('Error occured while removing schedule.', error);
            return (0, messageTemplate_1.sendResponse)(res, 500, 'common.errors.internal');
        }
    }
}
exports.ScheduleService = ScheduleService;
//# sourceMappingURL=scheduleService.js.map