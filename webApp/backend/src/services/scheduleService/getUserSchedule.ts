//===================================================================================================
//? Import
//===================================================================================================

import { Op } from "sequelize";

import ScheduleModel from "../../models/scheduleModel";
import ServicePatternModel from "../../models/servicePatternModel";
import OperatingHoursModel from "../../models/operatingHoursModel";
import ScheduledTripsModel from "../../models/scheduledTripsModel";
import RouteModel from "../../models/routeModel";

import { ScheduleHelper } from "../../helpers/scheduleHelper";
const schedulehelper = new ScheduleHelper();

import { ScheduleHelper as TimelineHelper } from "../../helpers/scheduleHelper";
const schedulehelper2 = new TimelineHelper();

import { normalizeColorToArgbInt } from "../../helpers/colorHelper";

import { ScheduleQueryParams } from "./types";

//===================================================================================================

export const getUserSchedule = async (params: ScheduleQueryParams) => {
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
                attributes: ["time", "routeId"],
                include: [
                    {
                        model: RouteModel,
                        as: "route",
                        attributes: ["id", "title", "color"],
                    },
                ],
            },
        ],
        order: [
            ["date", "ASC"],
            [{ model: ScheduledTripsModel, as: "trips" }, "time", "ASC"],
        ],
    });

    const mapped = schedules.map((row: any) => {
        const operatingHours: Array<{ operatingHourId: string; hour: string }> = row?.servicePattern?.operatingHours ?? [];

        const buckets = new Map<string, { time: string; trips: unknown[] }>();
        for (const oh of operatingHours) {
            const t = schedulehelper.normalizeTime(oh.hour);
            if (!t) continue;
            if (!buckets.has(t)) buckets.set(t, { time: t, trips: [] });
        }
        const trips: any[] = row?.trips ?? [];
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

    // ==============================================================================================
    // Group schedules into the mobile UI shape:
    // Day -> Service Patterns -> Routes -> Departure Times
    // ==============================================================================================

    type GroupedRoute = { routeName: string; tabColorValue: number; departureTimes: string[] };
    type GroupedServicePattern = {
        servicePatternId: string;
        title: string;
        operatingTimes: string[];
        routes: GroupedRoute[];
    };
    type GroupedDay = {
        dayKey: string;
        date: string;
        servicePatterns: GroupedServicePattern[];
    };

    const dayAcc = new Map<
        string,
        {
            dayKey: string;
            date: string;
            servicePatterns: Map<
                string,
                {
                    servicePatternId: string;
                    title: string;
                    operatingTimes: string[];
                    routesAcc: Map<string, { routeName: string; tabColorValue: number; times: Set<string> }>;
                }
            >;
        }
    >();

    // ==============================================================================================
    // here we are organizing the teh routes under the correct day and service pattern
    // ==============================================================================================

    for (const schedule of mapped) {
        const dayKey = schedulehelper2.normalizeDayKey((schedule as any)?.day);
        const dateStr = schedulehelper2.formatDateForMobileUi((schedule as any)?.date);
        const dayId = `${dayKey}|${dateStr}`;

        if (!dayAcc.has(dayId)) {
            dayAcc.set(dayId, {
                dayKey,
                date: dateStr,
                servicePatterns: new Map(),
            });
        }

        const day = dayAcc.get(dayId)!;

        const spId = typeof (schedule as any)?.servicePatternId === "string" ? String((schedule as any).servicePatternId).trim() : "";
        const spTitle = typeof (schedule as any)?.servicePattern?.title === "string" ? String((schedule as any).servicePattern.title).trim() : "";
        const spKey = spId || spTitle;
        if (!spKey) continue;

        if (!day.servicePatterns.has(spKey)) {
            const operatingHoursRaw: Array<Record<string, unknown>> = Array.isArray((schedule as any)?.servicePattern?.operatingHours)
                ? (schedule as any).servicePattern.operatingHours
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

        const sp = day.servicePatterns.get(spKey)!;

        const ingestTrip = (trip: Record<string, unknown>) => {
            const route = (trip as any)?.route;
            const routeName = typeof route?.title === "string" ? route.title.trim() : "";
            if (!routeName) return;

            const time = schedulehelper2.normalizeTimeToHourMinute((trip as any)?.time);
            if (!time) return;

            if (!sp.routesAcc.has(routeName)) {
                sp.routesAcc.set(routeName, {
                    routeName,
                    tabColorValue: normalizeColorToArgbInt(route?.color),
                    times: new Set<string>(),
                });
            }

            sp.routesAcc.get(routeName)!.times.add(time);
        };

        const timeline: Array<Record<string, unknown>> = Array.isArray((schedule as any)?.timeline) ? (schedule as any).timeline : [];
        for (const slot of timeline) {
            const trips: Array<Record<string, unknown>> = Array.isArray((slot as any)?.trips) ? (slot as any).trips : [];
            for (const trip of trips) {
                ingestTrip(trip);
            }
        }
    }

    return Array.from(dayAcc.values()).map((day) => {
        const servicePatterns: GroupedServicePattern[] = Array.from(day.servicePatterns.values()).map((sp) => {
            const routes: GroupedRoute[] = Array.from(sp.routesAcc.values()).map((r) => ({
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

        const result: GroupedDay = {
            dayKey: day.dayKey,
            date: day.date,
            servicePatterns,
        };

        return result;
    });
};
