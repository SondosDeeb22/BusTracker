"use strict";
//===================================================================================================
//? Import
//===================================================================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserSchedule = void 0;
const sequelize_1 = require("sequelize");
const scheduleModel_1 = __importDefault(require("../../models/scheduleModel"));
const servicePatternModel_1 = __importDefault(require("../../models/servicePatternModel"));
const operatingHoursModel_1 = __importDefault(require("../../models/operatingHoursModel"));
const scheduledTripsModel_1 = __importDefault(require("../../models/scheduledTripsModel"));
const routeModel_1 = __importDefault(require("../../models/routeModel"));
const scheduleHelper_1 = require("../../helpers/scheduleHelper");
const schedulehelper = new scheduleHelper_1.ScheduleHelper();
const scheduleHelper_2 = require("../../helpers/scheduleHelper");
const schedulehelper2 = new scheduleHelper_2.ScheduleHelper();
const colorHelper_1 = require("../../helpers/colorHelper");
//===================================================================================================
const getUserSchedule = async (params) => {
    const where = {};
    const dateParam = typeof params.date === "string" ? params.date.trim() : "";
    if (dateParam) {
        where.date = dateParam;
    }
    const servicePatternId = typeof params.servicePatternId === "string" ? params.servicePatternId.trim() : "";
    if (servicePatternId) {
        where.servicePatternId = servicePatternId;
    }
    const fromDate = typeof params.fromDate === "string" ? params.fromDate.trim() : "";
    const toDate = typeof params.toDate === "string" ? params.toDate.trim() : "";
    if (fromDate || toDate) {
        where.date = {
            ...(fromDate ? { [sequelize_1.Op.gte]: fromDate } : {}),
            ...(toDate ? { [sequelize_1.Op.lte]: toDate } : {}),
        };
    }
    const schedules = await scheduleModel_1.default.findAll({
        where: where,
        include: [
            {
                model: servicePatternModel_1.default,
                as: "servicePattern",
                attributes: ["servicePatternId", "title"],
                include: [
                    {
                        model: operatingHoursModel_1.default,
                        as: "operatingHours",
                        attributes: ["operatingHourId", "hour"],
                    },
                ],
            },
            {
                model: scheduledTripsModel_1.default,
                as: "trips",
                attributes: ["time", "routeId"],
                include: [
                    {
                        model: routeModel_1.default,
                        as: "route",
                        attributes: ["id", "title", "color"],
                    },
                ],
            },
        ],
        order: [
            ["date", "ASC"],
            [{ model: scheduledTripsModel_1.default, as: "trips" }, "time", "ASC"],
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
    // ==============================================================================================
    for (const schedule of mapped) {
        const dayKey = schedulehelper2.normalizeDayKey(schedule?.day);
        const dateStr = schedulehelper2.formatDateForMobileUi(schedule?.date);
        const dayId = `${dayKey}|${dateStr}`;
        if (!dayAcc.has(dayId)) {
            dayAcc.set(dayId, {
                dayKey,
                date: dateStr,
                servicePatterns: new Map(),
            });
        }
        const day = dayAcc.get(dayId);
        const spId = typeof schedule?.servicePatternId === "string" ? String(schedule.servicePatternId).trim() : "";
        const spTitle = typeof schedule?.servicePattern?.title === "string" ? String(schedule.servicePattern.title).trim() : "";
        const spKey = spId || spTitle;
        if (!spKey)
            continue;
        if (!day.servicePatterns.has(spKey)) {
            const operatingHoursRaw = Array.isArray(schedule?.servicePattern?.operatingHours)
                ? schedule.servicePattern.operatingHours
                : [];
            const operatingTimes = operatingHoursRaw
                .map((oh) => schedulehelper2.normalizeTimeToHourMinute(oh?.hour))
                .filter((t) => Boolean(t))
                .sort((a, b) => String(a).localeCompare(String(b)));
            day.servicePatterns.set(spKey, {
                servicePatternId: spId,
                title: spTitle,
                operatingTimes,
                routesAcc: new Map(),
            });
        }
        const sp = day.servicePatterns.get(spKey);
        const ingestTrip = (trip) => {
            const route = trip?.route;
            const routeName = typeof route?.title === "string" ? route.title.trim() : "";
            if (!routeName)
                return;
            const time = schedulehelper2.normalizeTimeToHourMinute(trip?.time);
            if (!time)
                return;
            if (!sp.routesAcc.has(routeName)) {
                sp.routesAcc.set(routeName, {
                    routeName,
                    tabColorValue: (0, colorHelper_1.normalizeColorToArgbInt)(route?.color),
                    times: new Set(),
                });
            }
            sp.routesAcc.get(routeName).times.add(time);
        };
        const timeline = Array.isArray(schedule?.timeline) ? schedule.timeline : [];
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
        const result = {
            dayKey: day.dayKey,
            date: day.date,
            servicePatterns,
        };
        return result;
    });
};
exports.getUserSchedule = getUserSchedule;
//# sourceMappingURL=getUserSchedule.js.map