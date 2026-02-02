"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleService = void 0;
//===================================================================================================
//? Importing
//===================================================================================================
const sequelize_1 = require("sequelize");
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
const errors_1 = require("../errors");
const schedulehelper = new scheduleHelper_1.ScheduleHelper();
//===================================================================================================
//? schedule class
//===================================================================================================
class ScheduleService {
    //===================================================================================================
    //? Fetch schedule (GET)
    // Fetch schedules with their operating hours timeline and scheduled trips
    //===================================================================================================
    async getSchedule(params) {
        const where = {};
        const dateParam = typeof params.date === 'string' ? params.date.trim() : '';
        if (dateParam) {
            where.date = dateParam;
        }
        const servicePatternId = typeof params.servicePatternId === 'string' ? params.servicePatternId.trim() : '';
        if (servicePatternId) {
            where.servicePatternId = servicePatternId;
        }
        const fromDate = typeof params.fromDate === 'string' ? params.fromDate.trim() : '';
        const toDate = typeof params.toDate === 'string' ? params.toDate.trim() : '';
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
        return schedules.map((row) => {
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
    }
    //===================================================================================================
    //? Fetch schedule for users (GET)
    // Fetch schedules with their operating hours timeline and scheduled trips
    // (Simplified output: no driver/bus objects)
    //===================================================================================================
    async getUserSchedule(params) {
        const where = {};
        const dateParam = typeof params.date === 'string' ? params.date.trim() : '';
        if (dateParam) {
            where.date = dateParam;
        }
        const servicePatternId = typeof params.servicePatternId === 'string' ? params.servicePatternId.trim() : '';
        if (servicePatternId) {
            where.servicePatternId = servicePatternId;
        }
        const fromDate = typeof params.fromDate === 'string' ? params.fromDate.trim() : '';
        const toDate = typeof params.toDate === 'string' ? params.toDate.trim() : '';
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
                // Keep the trip object simplified for user UI consumption
                // We reuse the already-loaded route relation and do not include driver/bus
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
        return Array.from(dayAcc.values()).map((day) => {
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
    }
    //===================================================================================================
    //? Remove schedule (Delete)
    //===================================================================================================
    async removeScheduledTrip(detailedScheduleId) {
        const deletedCount = await scheduledTripsModel_1.default.destroy({ where: { detailedScheduleId } });
        if (deletedCount === 0) {
            throw new errors_1.NotFoundError('tripForm.errors.notFound');
        }
    }
    //===================================================================================================
    //? add schedule (POST)
    // Create schedule row (date + servicePatternId). day is calculated from date.
    //===================================================================================================
    async addSchedule(input) {
        await userHelper.add(scheduleModel_1.default, { date: input.date, day: input.day, servicePatternId: input.servicePatternId });
    }
    //===================================================================================================
    //? add scheduled trip (POST)
    // Add a trip row to a specific schedule.
    //===================================================================================================
    async addScheduledTrip(input) {
        const scheduleExists = await scheduleModel_1.default.findOne({
            where: { scheduleId: input.scheduleId },
            attributes: ['scheduleId'],
        });
        if (!scheduleExists) {
            throw new errors_1.NotFoundError('schedule.errors.notFound');
        }
        const existingTrip = await scheduledTripsModel_1.default.findOne({
            where: { scheduleId: input.scheduleId, time: input.time, routeId: input.routeId },
            attributes: ['detailedScheduleId', 'driverId', 'busId'],
        });
        const occupied = await scheduledTripsModel_1.default.findOne({
            where: {
                scheduleId: input.scheduleId,
                time: input.time,
                ...(existingTrip ? { detailedScheduleId: { [sequelize_1.Op.ne]: existingTrip.detailedScheduleId } } : {}),
                [sequelize_1.Op.or]: [{ driverId: input.driverId }, { busId: input.busId }],
            },
            attributes: ['detailedScheduleId', 'driverId', 'busId'],
        });
        if (occupied) {
            if (occupied.driverId === input.driverId) {
                throw new errors_1.ConflictError('tripForm.errors.driverNotAvailable');
            }
            if (occupied.busId === input.busId) {
                throw new errors_1.ConflictError('tripForm.errors.busNotAvailable');
            }
            throw new errors_1.ConflictError('tripForm.errors.driverOrBusNotAvailable');
        }
        if (existingTrip) {
            const [updatedCount] = await scheduledTripsModel_1.default.update({ driverId: input.driverId, busId: input.busId }, { where: { detailedScheduleId: existingTrip.detailedScheduleId } });
            if (updatedCount === 0) {
                throw new errors_1.ConflictError('tripForm.errors.notUpdated');
            }
            return 'tripForm.success.updated';
        }
        await userHelper.add(scheduledTripsModel_1.default, {
            scheduleId: input.scheduleId,
            time: input.time,
            routeId: input.routeId,
            driverId: input.driverId,
            busId: input.busId,
        });
        return 'tripForm.success.saved';
    }
    //===================================================================================================
    //? update schedule (Patch)
    // Update schedule row. (scheduleId required)
    //===================================================================================================
    async updateSchedule(updates) {
        const result = await userHelper.update(scheduleModel_1.default, updates);
        return result.updated;
    }
    //===================================================================================================
    //? Delete schedule (Delete)
    // Delete schedule row (scheduleId). trips are deleted by DB cascade.
    //===================================================================================================
    async removeSchedule(scheduleId) {
        await userHelper.remove(scheduleModel_1.default, 'scheduleId', scheduleId);
    }
}
exports.ScheduleService = ScheduleService;
//# sourceMappingURL=scheduleService.js.map