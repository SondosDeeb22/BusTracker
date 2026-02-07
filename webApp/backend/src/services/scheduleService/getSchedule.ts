//===================================================================================================
//? Import
//===================================================================================================

import { Op } from "sequelize";

import ScheduleModel from "../../models/scheduleModel";
import ServicePatternModel from "../../models/servicePatternModel";
import OperatingHoursModel from "../../models/operatingHoursModel";
import ScheduledTripsModel from "../../models/scheduledTripsModel";
import RouteModel from "../../models/routeModel";
import UserModel from "../../models/userModel";
import BusModel from "../../models/busModel";

import { ScheduleHelper } from "../../helpers/scheduleHelper";
const schedulehelper = new ScheduleHelper();

import { normalizeColorToArgbInt } from "../../helpers/colorHelper";

import { ScheduleQueryParams } from "./types";

//===================================================================================================

export const getSchedule = async (params: ScheduleQueryParams) => {
    const where: Record<string, unknown> = {};

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
            ...(fromDate ? { [Op.gte]: fromDate } : {}),
            ...(toDate ? { [Op.lte]: toDate } : {}),
        };
    }

    const schedules = await ScheduleModel.findAll({
        where: where as any,
        include: [
            {
                model: ServicePatternModel,
                as: "servicePattern",
                attributes: ["servicePatternId", "title"],
                include: [
                    {
                        model: OperatingHoursModel,
                        as: "operatingHours",
                        attributes: ["operatingHourId", "hour"],
                    },
                ],
            },
            {
                model: ScheduledTripsModel,
                as: "trips",
                attributes: ["detailedScheduleId", "scheduleId", "time", "routeId", "driverId", "busId"],
                include: [
                    {
                        model: RouteModel,
                        as: "route",
                        attributes: ["id", "title", "color"],
                    },
                    {
                        model: UserModel,
                        as: "driver",
                        attributes: ["id", "name"],
                    },
                    {
                        model: BusModel,
                        as: "bus",
                        attributes: ["id", "plate", "brand", "status"],
                    },
                ],
            },
        ],
        order: [
            ["date", "ASC"],
            [{ model: ScheduledTripsModel, as: "trips" }, "time", "ASC"],
        ],
    });

    return schedules.map((row: any) => {
        const operatingHours: Array<{ operatingHourId: string; hour: string }> = row?.servicePattern?.operatingHours ?? [];

        const buckets = new Map<string, { time: string; trips: unknown[] }>();
        for (const oh of operatingHours) {
            const t = schedulehelper.normalizeTime(oh.hour);
            if (!t) continue;
            if (!buckets.has(t)) buckets.set(t, { time: t, trips: [] });
        }
        const trips: unknown[] = row?.trips ?? [];
        for (const trip of trips as any[]) {
            const tripTime = schedulehelper.normalizeTime(trip?.time);
            const bucket = buckets.get(tripTime);
            if (trip?.route) {
                trip.route.colorInt = normalizeColorToArgbInt(trip.route.color);
            }
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
