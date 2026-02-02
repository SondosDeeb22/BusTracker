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
//helper
const userHelper_1 = require("../helpers/userHelper");
const userHelper = new userHelper_1.UserHelper();
const scheduleHelper_1 = require("../helpers/scheduleHelper");
const schedulehelper = new scheduleHelper_1.ScheduleHelper();
const errors_1 = require("../errors");
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
                    const t = schedulehelper.normalizeTime(oh.hour);
                    if (!t)
                        continue;
                    if (!buckets.has(t))
                        buckets.set(t, { time: t, trips: [] });
                }
                const trips = row?.trips ?? [];
                for (const trip of trips) {
                    const tripTime = schedulehelper.normalizeTime(trip?.time);
                    const bucket = buckets.get(tripTime);
                    if (bucket) {
                        bucket.trips.push(trip);
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
                };
            });
            return (0, messageTemplate_1.sendResponse)(res, 200, null, mapped);
            //==============================================
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
                    const t = schedulehelper.normalizeTime(oh.hour);
                    if (!t)
                        continue;
                    if (!buckets.has(t))
                        buckets.set(t, { time: t, trips: [] });
                }
                const trips = row?.trips ?? [];
                for (const trip of trips) {
                    const tripTime = schedulehelper.normalizeTime(trip?.time);
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
                }
                const timeline = Array.from(buckets.values()).sort((a, b) => a.time.localeCompare(b.time));
                return {
                    scheduleId: row.scheduleId,
                    date: row.date,
                    day: row.day,
                    servicePatternId: row.servicePatternId,
                    servicePattern: row.servicePattern,
                    timeline,
                };
            });
            // ------------------------------
            const dayAcc = new Map();
            // ==============================================================================================
            // here we are organizing the teh routes under the correct day and service pattern
            // the loop processes each schedule, gropuing it into the matching day and service pattern within the day accumulator map "dayAcc" we defined before
            for (const schedule of mapped) {
                // extract day and date information and normailzing them to united format 
                const dayKey = schedulehelper.normalizeDayKey(schedule?.day);
                const dateStr = schedulehelper.formatDateForMobileUi(schedule?.date);
                const dayId = `${dayKey}|${dateStr}`;
                //________________________________________________
                // check if the dayId is already exists in the accumulator, if not we create new entry
                if (!dayAcc.has(dayId)) {
                    dayAcc.set(dayId, {
                        dayKey,
                        date: dateStr,
                        servicePatterns: new Map(),
                    });
                }
                // --------------------------------------------------------------------------------------
                const day = dayAcc.get(dayId);
                // extract service pattern id and title from the schedule instance 
                const spId = typeof schedule?.servicePatternId === 'string' ? schedule.servicePatternId.trim() : '';
                const spTitle = typeof schedule?.servicePattern?.title === 'string' ? schedule.servicePattern.title.trim() : '';
                const spKey = spId || spTitle;
                //________________________________________________
                // check if the servicePatternId exists already, if not create new entry to that service pattern wihtin this day
                if (!spKey)
                    continue;
                // creating service pattern entry 
                if (!day.servicePatterns.has(spKey)) {
                    // get operating hours
                    const operatingHoursRaw = Array.isArray(schedule?.servicePattern?.operatingHours)
                        ? schedule.servicePattern.operatingHours
                        : [];
                    const operatingTimes = operatingHoursRaw
                        .map((oh) => schedulehelper.normalizeTimeToHourMinute(oh?.hour))
                        .filter((t) => Boolean(t))
                        .sort((a, b) => String(a).localeCompare(String(b)));
                    day.servicePatterns.set(spKey, {
                        servicePatternId: spId,
                        title: spTitle,
                        operatingTimes,
                        routesAcc: new Map(),
                    });
                }
                //-----------------------------------------------------
                // get service pattern id
                const sp = day.servicePatterns.get(spKey);
                // handle trip data
                const ingestTrip = (trip) => {
                    const route = trip?.route;
                    const routeName = typeof route?.title === 'string' ? route.title.trim() : '';
                    if (!routeName)
                        return;
                    // get trip time
                    const time = schedulehelper.normalizeTimeToHourMinute(trip?.time);
                    if (!time)
                        return;
                    // check if the route exists already, if not create new entry to that route within this service pattern within this day
                    if (!sp.routesAcc.has(routeName)) {
                        sp.routesAcc.set(routeName, {
                            routeName,
                            tabColorValue: route?.color,
                            times: new Set(),
                        });
                    }
                    // after confirming the route exists , we add the current trips times to the route's list of times
                    sp.routesAcc.get(routeName).times.add(time);
                };
                //-----------------------------------------------
                // get timeline trips
                const timeline = Array.isArray(schedule?.timeline) ? schedule.timeline : [];
                // Loop through all teh timeline slots for this scheudle (to add their routes and departure times)
                for (const slot of timeline) {
                    const trips = Array.isArray(slot?.trips) ? slot.trips : [];
                    for (const trip of trips) {
                        ingestTrip(trip);
                    }
                }
            }
            // =====================================================================================
            // convert the accumulated data into the final response format
            const response = Array.from(dayAcc.values()).map((day) => {
                const servicePatterns = Array.from(day.servicePatterns.values()).map((sp) => {
                    const routes = Array.from(sp.routesAcc.values()).map((r) => ({
                        routeName: r.routeName,
                        tabColorValue: r.tabColorValue,
                        departureTimes: Array.from(r.times).sort((a, b) => a.localeCompare(b)),
                    }));
                    return {
                        servicePatternId: sp.servicePatternId,
                        title: sp.title,
                        operatingTimes: sp.operatingTimes,
                        routes,
                    };
                });
                return {
                    dayKey: day.dayKey,
                    date: day.date,
                    servicePatterns,
                };
            });
            return (0, messageTemplate_1.sendResponse)(res, 200, null, response);
            // =============================================================================================
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
                return (0, messageTemplate_1.sendResponse)(res, 500, 'common.errors.validation.required');
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
                return (0, messageTemplate_1.sendResponse)(res, 500, 'common.errors.validation.fillAllFields');
            }
            const day = schedulehelper.calcDayFromDate(date);
            if (!day) {
                return (0, messageTemplate_1.sendResponse)(res, 500, 'schedule.errors.invalidDate');
            }
            await userHelper.add(scheduleModel_1.default, { date, day, servicePatternId });
            return (0, messageTemplate_1.sendResponse)(res, 200, 'common.crud.added');
            //==============================================
        }
        catch (error) {
            console.error('Error occured while creating schedule.', error);
            if (error instanceof errors_1.ValidationError) {
                if (error.message === 'fillAllFields')
                    return (0, messageTemplate_1.sendResponse)(res, 400, 'common.errors.validation.fillAllFields');
                if (error.message === 'invalidField')
                    return (0, messageTemplate_1.sendResponse)(res, 400, 'common.errors.validation.invalidField');
                if (error.message === 'required')
                    return (0, messageTemplate_1.sendResponse)(res, 400, 'common.errors.validation.required');
                if (error.message === 'noData')
                    return (0, messageTemplate_1.sendResponse)(res, 400, 'common.errors.validation.noData');
                return (0, messageTemplate_1.sendResponse)(res, 400, 'common.errors.validation.invalidField');
            }
            if (error instanceof errors_1.ConflictError) {
                return (0, messageTemplate_1.sendResponse)(res, 409, error.message);
            }
            if (error instanceof errors_1.NotFoundError) {
                return (0, messageTemplate_1.sendResponse)(res, 404, 'common.crud.notFound');
            }
            if (error instanceof Error) {
                if (error.message.startsWith('common.')) {
                    return (0, messageTemplate_1.sendResponse)(res, 500, error.message);
                }
            }
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
            const time = schedulehelper.normalizeTime(body.time);
            const routeId = typeof body.routeId === 'string' ? body.routeId.trim() : '';
            const driverId = typeof body.driverId === 'string' ? body.driverId.trim() : '';
            const busId = typeof body.busId === 'string' ? body.busId.trim() : '';
            if (!scheduleId || !time || !routeId || !driverId || !busId) {
                return (0, messageTemplate_1.sendResponse)(res, 500, 'common.errors.validation.fillAllFields');
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
            await userHelper.add(scheduledTripsModel_1.default, { scheduleId, time, routeId, driverId, busId });
            return (0, messageTemplate_1.sendResponse)(res, 200, 'tripForm.success.saved');
            //==============================================
        }
        catch (error) {
            console.error('Error occured while creating scheduled trip.', error);
            if (error instanceof errors_1.ValidationError) {
                if (error.message === 'fillAllFields')
                    return (0, messageTemplate_1.sendResponse)(res, 400, 'common.errors.validation.fillAllFields');
                if (error.message === 'invalidField')
                    return (0, messageTemplate_1.sendResponse)(res, 400, 'common.errors.validation.invalidField');
                if (error.message === 'required')
                    return (0, messageTemplate_1.sendResponse)(res, 400, 'common.errors.validation.required');
                if (error.message === 'noData')
                    return (0, messageTemplate_1.sendResponse)(res, 400, 'common.errors.validation.noData');
                return (0, messageTemplate_1.sendResponse)(res, 400, 'common.errors.validation.invalidField');
            }
            if (error instanceof errors_1.ConflictError) {
                return (0, messageTemplate_1.sendResponse)(res, 409, error.message);
            }
            if (error instanceof errors_1.NotFoundError) {
                return (0, messageTemplate_1.sendResponse)(res, 404, 'common.crud.notFound');
            }
            if (error instanceof Error) {
                if (error.message.startsWith('common.')) {
                    return (0, messageTemplate_1.sendResponse)(res, 500, error.message);
                }
            }
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
                return (0, messageTemplate_1.sendResponse)(res, 500, 'common.errors.validation.required');
            }
            const updates = { scheduleId };
            if (body.date) {
                const date = String(body.date).trim();
                const day = schedulehelper.calcDayFromDate(date);
                if (!day)
                    return (0, messageTemplate_1.sendResponse)(res, 500, 'schedule.errors.invalidDate');
                updates.date = date;
                updates.day = day;
            }
            if (body.servicePatternId) {
                updates.servicePatternId = String(body.servicePatternId).trim();
            }
            const result = await userHelper.update(scheduleModel_1.default, updates);
            return (0, messageTemplate_1.sendResponse)(res, 200, result.updated ? 'common.crud.updated' : 'common.crud.noChanges');
            //==============================================
        }
        catch (error) {
            console.error('Error occured while updating schedule.', error);
            if (error instanceof errors_1.ValidationError) {
                if (error.message === 'required')
                    return (0, messageTemplate_1.sendResponse)(res, 400, 'common.errors.validation.required');
                if (error.message === 'noData')
                    return (0, messageTemplate_1.sendResponse)(res, 400, 'common.errors.validation.noData');
                if (error.message === 'invalidField')
                    return (0, messageTemplate_1.sendResponse)(res, 400, 'common.errors.validation.invalidField');
                return (0, messageTemplate_1.sendResponse)(res, 400, 'common.errors.validation.invalidField');
            }
            if (error instanceof errors_1.ConflictError) {
                return (0, messageTemplate_1.sendResponse)(res, 409, error.message);
            }
            if (error instanceof errors_1.NotFoundError) {
                return (0, messageTemplate_1.sendResponse)(res, 404, 'common.crud.notFound');
            }
            if (error instanceof Error) {
                if (error.message.startsWith('common.')) {
                    return (0, messageTemplate_1.sendResponse)(res, 500, error.message);
                }
            }
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
                return (0, messageTemplate_1.sendResponse)(res, 500, 'common.errors.validation.required');
            }
            await userHelper.remove(scheduleModel_1.default, 'scheduleId', scheduleId);
            return (0, messageTemplate_1.sendResponse)(res, 200, 'common.crud.removed');
            //==============================================
        }
        catch (error) {
            console.error('Error occured while removing schedule.', error);
            if (error instanceof errors_1.ValidationError) {
                if (error.message === 'required')
                    return (0, messageTemplate_1.sendResponse)(res, 400, 'common.errors.validation.required');
                return (0, messageTemplate_1.sendResponse)(res, 400, 'common.errors.validation.invalidField');
            }
            if (error instanceof errors_1.NotFoundError) {
                return (0, messageTemplate_1.sendResponse)(res, 404, 'common.crud.notFound');
            }
            if (error instanceof Error) {
                if (error.message.startsWith('common.')) {
                    return (0, messageTemplate_1.sendResponse)(res, 500, error.message);
                }
            }
            return (0, messageTemplate_1.sendResponse)(res, 500, 'common.errors.internal');
        }
    }
}
exports.ScheduleService = ScheduleService;
//# sourceMappingURL=scheduleService.js.map