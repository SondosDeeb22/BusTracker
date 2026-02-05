"use strict";
//===================================================================================================
//? Import
//===================================================================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSchedule = void 0;
const sequelize_1 = require("sequelize");
const scheduleModel_1 = __importDefault(require("../../models/scheduleModel"));
const servicePatternModel_1 = __importDefault(require("../../models/servicePatternModel"));
const operatingHoursModel_1 = __importDefault(require("../../models/operatingHoursModel"));
const scheduledTripsModel_1 = __importDefault(require("../../models/scheduledTripsModel"));
const routeModel_1 = __importDefault(require("../../models/routeModel"));
const userModel_1 = __importDefault(require("../../models/userModel"));
const busModel_1 = __importDefault(require("../../models/busModel"));
const scheduleHelper_1 = require("../../helpers/scheduleHelper");
const schedulehelper = new scheduleHelper_1.ScheduleHelper();
//===================================================================================================
const getSchedule = async (params) => {
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
                attributes: ["detailedScheduleId", "scheduleId", "time", "routeId", "driverId", "busId"],
                include: [
                    {
                        model: routeModel_1.default,
                        as: "route",
                        attributes: ["id", "title", "color"],
                    },
                    {
                        model: userModel_1.default,
                        as: "driver",
                        attributes: ["id", "name"],
                    },
                    {
                        model: busModel_1.default,
                        as: "bus",
                        attributes: ["id", "plate", "brand", "status"],
                    },
                ],
            },
        ],
        order: [
            ["date", "ASC"],
            [{ model: scheduledTripsModel_1.default, as: "trips" }, "time", "ASC"],
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
};
exports.getSchedule = getSchedule;
//# sourceMappingURL=getSchedule.js.map